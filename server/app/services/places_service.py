import math
import os
import re
from time import monotonic
from urllib.parse import quote, unquote

import requests
from dotenv import load_dotenv


load_dotenv()

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")

GEOAPIFY_GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search"
GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places"
GEOAPIFY_DETAILS_URL = "https://api.geoapify.com/v2/place-details"
WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"

REQUEST_TIMEOUT = 12
SEARCH_RADIUS_METERS = 30000
PLACE_DETAILS_CACHE_TTL = 1800
WIKIPEDIA_CACHE_TTL = 3600
WIKIPEDIA_USER_AGENT = os.getenv(
    "WIKIPEDIA_USER_AGENT",
    "Voyagent-AI/1.0 (https://github.com/PremKhamkar/Voyagent-AI)"
)
_PLACE_DETAILS_CACHE = {}
_WIKIPEDIA_MEDIA_CACHE = {}


def _require_geoapify_key():
    """Make sure the Geoapify API key is available."""
    if not GEOAPIFY_API_KEY:
        raise RuntimeError(
            "GEOAPIFY_API_KEY is not configured in the server .env file."
        )


def _normalise_text(value):
    """Return a simple normalized string for matching and filtering."""
    if not value:
        return ""

    return (
        str(value)
        .strip()
        .lower()
        .replace("-", " ")
        .replace(",", " ")
        .replace(".", " ")
        .replace("'", " ")
        .replace('"', " ")
    )


def _tokenize_name(value):
    """Convert a place name into useful comparison tokens."""
    normalized = _normalise_text(value)

    ignored = {
        "the",
        "of",
        "and",
        "in",
        "at",
        "near",
        "mumbai",
        "india",
    }

    return {
        token
        for token in normalized.split()
        if len(token) >= 3 and token not in ignored
    }


def _get_display_name(properties):
    """Prefer English names; fall back to a readable address label."""
    english_name = properties.get("name:en")
    local_name = properties.get("name")
    address_name = properties.get("address_line1")

    if english_name:
        return str(english_name).strip()

    if local_name:
        local_name = str(local_name).strip()
        if address_name and re.search(r"[A-Za-z]", str(address_name)):
            # Geoapify sometimes returns only a regional-script name even when
            # an English place name is available in address_line1.
            non_latin = sum(1 for ch in local_name if ord(ch) > 127)
            letters = sum(1 for ch in local_name if ch.isalpha())
            if letters and (non_latin / letters) > 0.5:
                return str(address_name).strip()
        return local_name

    return str(address_name).strip() if address_name else None


def get_coordinates(destination):
    """
    Resolve a destination to a useful city-level search center.

    Geoapify supports type=city for city/town/village-style geocoding.
    A general geocoding fallback is kept for specific landmark-like input.
    """
    _require_geoapify_key()

    destination = (destination or "").strip()
    if not destination:
        return None

    city_response = requests.get(
        GEOAPIFY_GEOCODE_URL,
        params={
            "text": destination,
            "type": "city",
            "lang": "en",
            "limit": 5,
            "apiKey": GEOAPIFY_API_KEY,
        },
        timeout=REQUEST_TIMEOUT,
    )
    city_response.raise_for_status()

    city_features = city_response.json().get("features", [])
    for feature in city_features:
        geometry = feature.get("geometry", {})
        coordinates = geometry.get("coordinates")
        if coordinates and len(coordinates) >= 2:
            return coordinates[1], coordinates[0]

    response = requests.get(
        GEOAPIFY_GEOCODE_URL,
        params={
            "text": destination,
            "lang": "en",
            "limit": 5,
            "apiKey": GEOAPIFY_API_KEY,
        },
        timeout=REQUEST_TIMEOUT,
    )
    response.raise_for_status()

    features = response.json().get("features", [])
    if not features:
        return None

    for feature in features:
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        coordinates = geometry.get("coordinates")
        if not coordinates or len(coordinates) < 2:
            continue

        result_type = (
            properties.get("result_type")
            or properties.get("type")
            or ""
        )

        if result_type in {"city", "town", "village", "locality"}:
            return coordinates[1], coordinates[0]

    coordinates = features[0].get("geometry", {}).get("coordinates")
    if not coordinates or len(coordinates) < 2:
        return None

    return coordinates[1], coordinates[0]


def _request_place_features(latitude, longitude, categories, limit=50):
    """Query one tourism category group around the destination."""
    response = requests.get(
        GEOAPIFY_PLACES_URL,
        params={
            "categories": categories,
            "filter": (
                f"circle:{longitude},{latitude},{SEARCH_RADIUS_METERS}"
            ),
            "bias": f"proximity:{longitude},{latitude}",
            "limit": limit,
            "lang": "en",
            "apiKey": GEOAPIFY_API_KEY,
        },
        timeout=REQUEST_TIMEOUT,
    )

    if not response.ok:
        print(
            "Geoapify Places Error:",
            response.status_code,
            response.text,
        )

    response.raise_for_status()
    return response.json().get("features", [])


def _get_place_features(latitude, longitude, limit=50):
    """
    Retrieve tourism-oriented places using separate category groups.

    Separate calls improve recall so a nearby low-value map object does not
    consume the entire result set before museums/historic attractions are
    considered.
    """
    _require_geoapify_key()

    category_groups = [
        "tourism.sights",
        "entertainment.museum",
        "tourism.attraction",
    ]

    all_features = []
    seen_ids = set()
    seen_signatures = set()

    per_group_limit = max(20, min(limit, 50))

    for categories in category_groups:
        try:
            features = _request_place_features(
                latitude,
                longitude,
                categories,
                limit=per_group_limit,
            )
        except requests.RequestException as error:
            print(
                f"Geoapify Places group failed ({categories}):",
                error,
            )
            continue

        for feature in features:
            properties = feature.get("properties", {})
            place_id = properties.get("place_id")
            name = _get_display_name(properties)
            signature = _normalise_text(name)

            if place_id and place_id in seen_ids:
                continue
            if signature and signature in seen_signatures:
                continue

            if place_id:
                seen_ids.add(place_id)
            if signature:
                seen_signatures.add(signature)

            all_features.append(feature)

    return all_features


def _friendly_category(categories):
    """Convert Geoapify's hierarchical category to a UI label."""
    if not categories:
        return "Tourist Attraction"

    category = str(categories[-1])
    leaf = category.split(".")[-1].lower()

    category_map = {
        "fort": "Fort",
        "castle": "Castle",
        "monastery": "Monastery",
        "temple": "Temple",
        "mosque": "Mosque",
        "church": "Church",
        "cathedral": "Cathedral",
        "archaeological_site": "Archaeological Site",
        "battlefield": "Historical Site",
        "bridge": "Bridge",
        "viewpoint": "Viewpoint",
        "tower": "Tower",
        "lighthouse": "Lighthouse",
        "memorial": "Memorial",
        "monument": "Monument",
        "ruines": "Ruins",
        "ruins": "Ruins",
        "building": "Historic Building",
        "historic": "Historic Site",
        "museum": "Museum",
        "shrine": "Shrine",
        "statue": "Statue",
        "fountain": "Fountain",
        "artwork": "Artwork",
        "place_of_worship": "Religious Site",
    }

    return category_map.get(
        leaf,
        leaf.replace("_", " ").title() if leaf else "Tourist Attraction",
    )


def _calculate_distance_km(
    origin_latitude,
    origin_longitude,
    destination_latitude,
    destination_longitude,
):
    """Calculate approximate straight-line distance in kilometres."""
    radius_km = 6371.0

    lat1 = math.radians(origin_latitude)
    lat2 = math.radians(destination_latitude)
    delta_lat = math.radians(destination_latitude - origin_latitude)
    delta_lon = math.radians(destination_longitude - origin_longitude)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    return radius_km * (
        2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    )


def _is_relevant_attraction(name, categories):
    """Remove obvious non-tourist and low-value map objects."""
    if not name:
        return False

    normalized = _normalise_text(name)

    blocked_name_patterns = [
        "chawl",
        "housing society",
        "residential society",
        "residential complex",
        "apartment",
        "government office",
        "custom house",
        "ward office",
        "municipal office",
        "police station",
        "post office",
        "railway station",
        "bus station",
        "jamat hall",
        "community hall",
        "marriage hall",
        "good shepard",
        "villagers cross",
        "tingling boys cross",
        "garden area",
        "offish",
        "office",
        "school",
        "college",
        "hospital",
        "clinic",
        "bank",
        "society",
        "housing",
        "chowk",
        "junction",
        "intersection",
        "crossing",
        "square",
        "traffic circle",
    ]

    if any(pattern in normalized for pattern in blocked_name_patterns):
        return False

    generic_names = {
        "cross",
        "hall",
        "building",
        "monument",
        "tower",
        "gate",
        "house",
        "temple",
        "church",
        "statue",
        "fountain",
        "artwork",
        "sculpture",
    }

    if normalized in generic_names:
        return False

    category_text = " ".join(
        str(category).lower() for category in categories
    )

    excluded_category_fragments = [
        "tourism.sights.memorial.wayside_cross",
        "tourism.attraction.artwork.statue",
        "tourism.attraction.artwork",
    ]

    if any(
        fragment in category_text
        for fragment in excluded_category_fragments
    ):
        return False

    useful_category_terms = [
        "museum",
        "fort",
        "castle",
        "ruin",
        "archaeological",
        "monument",
        "memorial",
        "viewpoint",
        "lighthouse",
        "tower",
        "bridge",
        "temple",
        "church",
        "cathedral",
        "mosque",
        "shrine",
        "attraction",
        "sight",
        "historic",
        "monastery",
        "battlefield",
    ]

    return any(term in category_text for term in useful_category_terms)


def _attraction_score(attraction):
    """Rank high-confidence tourist places above generic local map objects."""
    name = _normalise_text(attraction.get("name", ""))
    category_text = " ".join(attraction.get("categories", [])).lower()

    score = 0

    strong_terms = [
        "museum",
        "fort",
        "castle",
        "ruin",
        "archaeological",
        "viewpoint",
        "lighthouse",
        "historic",
        "battlefield",
    ]

    medium_terms = [
        "temple",
        "church",
        "cathedral",
        "mosque",
        "shrine",
        "monastery",
        "bridge",
        "tower",
    ]

    generic_memorial_terms = ["monument", "memorial"]

    for term in strong_terms:
        if term in category_text:
            score += 10

    for term in medium_terms:
        if term in category_text:
            score += 5

    for term in generic_memorial_terms:
        if term in category_text:
            score += 2

    if len(name.split()) >= 2:
        score += 2
    if len(name) >= 8:
        score += 1

    distance = attraction.get("distance_km", 9999)
    if distance <= 5:
        score += 3
    elif distance <= 15:
        score += 1

    # Verified metadata is the strongest signal that the POI represents a
    # useful travel destination rather than a generic map object.
    if attraction.get("image_url"):
        score += 8
    if attraction.get("wikipedia_url"):
        score += 4
    if attraction.get("website"):
        score += 2

    # Generic memorial/monument entries without any verified external
    # metadata are usually low-information POIs, so push them below stronger
    # attractions.
    if (
        any(term in category_text for term in generic_memorial_terms)
        and not attraction.get("image_url")
        and not attraction.get("wikipedia_url")
        and not attraction.get("website")
    ):
        score -= 6

    return score


def _build_wikipedia_url(title):
    """Build an English Wikipedia article URL."""
    if not title:
        return None

    title = unquote(str(title))
    if title.startswith("http://") or title.startswith("https://"):
        return title

    return (
        "https://en.wikipedia.org/wiki/"
        + quote(title.replace(" ", "_"), safe="()")
    )


def _get_place_details(place_id):
    """Fetch verified Geoapify Place Details with a short in-memory cache."""
    if not place_id:
        return {}

    now = monotonic()
    cached = _PLACE_DETAILS_CACHE.get(place_id)
    if cached and (now - cached["timestamp"]) < PLACE_DETAILS_CACHE_TTL:
        return cached["properties"]

    try:
        response = requests.get(
            GEOAPIFY_DETAILS_URL,
            params={
                "id": place_id,
                "features": "details",
                "lang": "en",
                "apiKey": GEOAPIFY_API_KEY,
            },
            timeout=REQUEST_TIMEOUT,
        )
        response.raise_for_status()
    except requests.RequestException as error:
        print("Geoapify Place Details error:", error)
        return {}

    features = response.json().get("features", [])
    if not features:
        return {}

    properties = features[0].get("properties", {})
    _PLACE_DETAILS_CACHE[place_id] = {
        "timestamp": now,
        "properties": properties,
    }
    return properties


def _extract_wikipedia_title(url):
    """Extract a clean English Wikipedia article title from a URL."""
    if not url:
        return None

    value = unquote(str(url)).strip()
    if not value:
        return None

    if "/wiki/" in value:
        value = value.split("/wiki/", 1)[1]

    value = value.split("#", 1)[0]
    value = value.split("?", 1)[0]
    value = value.replace("_", " ").strip()

    if value.lower().startswith("en:"):
        value = value[3:].strip()

    return value or None


def _normalise_wikipedia_title(value):
    """Normalize a Wikipedia title for deterministic cache/matching."""
    if not value:
        return ""
    return _normalise_text(unquote(str(value)).replace("_", " "))


def _get_batched_wikipedia_media(attractions):
    """Fetch media/description for known Wikipedia pages in one request.

    Only exact article titles already supplied by Geoapify are queried. This
    avoids broad Wikipedia searches and the old one-request-per-place pattern.
    """
    candidates = []
    for attraction in attractions:
        title = _extract_wikipedia_title(attraction.get("wikipedia_url"))
        if title:
            candidates.append(title)

    if not candidates:
        return {}

    now = monotonic()
    result_map = {}
    missing_titles = []
    seen_keys = set()

    for title in candidates:
        key = _normalise_wikipedia_title(title)
        if not key or key in seen_keys:
            continue
        seen_keys.add(key)

        cached = _WIKIPEDIA_MEDIA_CACHE.get(key)
        if cached and (now - cached["timestamp"]) < WIKIPEDIA_CACHE_TTL:
            result_map[key] = cached["data"]
        else:
            missing_titles.append((key, title))

    if not missing_titles:
        return result_map

    try:
        response = requests.get(
            WIKIPEDIA_API_URL,
            params={
                "action": "query",
                "format": "json",
                "formatversion": "2",
                "titles": "|".join(title for _, title in missing_titles[:50]),
                "prop": "pageimages|pageterms",
                "piprop": "thumbnail",
                "pithumbsize": 900,
                "pilicense": "free",
                "wbptterms": "description",
                "redirects": 1,
            },
            headers={"User-Agent": WIKIPEDIA_USER_AGENT},
            timeout=REQUEST_TIMEOUT,
        )

        if response.status_code == 429:
            retry_after = response.headers.get("Retry-After")
            print(
                "Wikipedia batch request rate-limited; skipping retry. "
                f"Retry-After={retry_after}"
            )
            return result_map

        response.raise_for_status()
        pages = response.json().get("query", {}).get("pages", [])

        for page in pages:
            title = page.get("title")
            if not title:
                continue

            thumbnail = page.get("thumbnail") or {}
            terms = page.get("terms") or {}
            descriptions = terms.get("description") or []
            data = {
                "image_url": thumbnail.get("source"),
                "description": descriptions[0] if descriptions else None,
            }
            key = _normalise_wikipedia_title(title)
            result_map[key] = data
            _WIKIPEDIA_MEDIA_CACHE[key] = {
                "timestamp": now,
                "data": data,
            }

    except requests.RequestException as error:
        print("Wikipedia batch metadata error:", error)

    return result_map


def _get_verified_media_and_description(attraction, destination):
    """Use Geoapify place metadata as the single trusted enrichment source.

    We intentionally do not call the Wikimedia Action API here. Geoapify
    already exposes the matched Wikimedia image, description and Wikipedia
    reference in its place-details response. Avoiding per-place Wikipedia API
    calls prevents the 429 rate-limit errors that occur when several
    attractions are enriched during one request.
    """
    place_details = _get_place_details(attraction.get("id"))

    media = place_details.get("wiki_and_media", {}) or {}
    image_url = media.get("image")
    wikipedia_reference = media.get("wikipedia")
    wikipedia_url = _build_wikipedia_url(wikipedia_reference)
    description = place_details.get("description")

    # Geoapify result-level fields remain the fallback when Place Details
    # does not contain a richer value.
    image_url = image_url or attraction.get("image_url")
    description = description or attraction.get("description")

    return {
        "image_url": image_url,
        "description": description,
        "wikipedia_url": wikipedia_url,
        "wikimedia_commons": media.get("wikimedia_commons"),
        "place_details": place_details,
    }


def get_attractions(latitude, longitude):
    """
    Return list[str] for the existing LangGraph Destination Node.

    This preserves the old contract and does not expose detailed dictionaries
    to the graph node that expects attraction names.
    """
    features = _get_place_features(latitude, longitude, limit=50)

    candidates = []
    seen_names = set()

    for place in features:
        properties = place.get("properties", {})
        name = _get_display_name(properties)
        categories = properties.get("categories", [])

        if not _is_relevant_attraction(name, categories):
            continue

        normalized_name = _normalise_text(name)
        if not normalized_name or normalized_name in seen_names:
            continue

        seen_names.add(normalized_name)

        coordinates = place.get("geometry", {}).get("coordinates")
        if not coordinates or len(coordinates) < 2:
            continue

        candidates.append(
            {
                "name": name.strip(),
                "categories": categories,
                "distance_km": _calculate_distance_km(
                    latitude,
                    longitude,
                    coordinates[1],
                    coordinates[0],
                ),
            }
        )

    candidates.sort(
        key=lambda item: (
            -_attraction_score(item),
            item.get("distance_km", 9999),
        )
    )

    return [item["name"] for item in candidates[:20]]


def get_detailed_attractions(
    latitude,
    longitude,
    destination,
    limit=8,
):
    """Return ranked, detailed tourist attractions with verified images."""

    features = _get_place_features(
        latitude,
        longitude,
        limit=50,
    )

    candidates = []
    seen_names = set()

    # ------------------------------------------------------------
    # 1. Build clean attraction candidates
    # ------------------------------------------------------------

    for feature in features:
        properties = feature.get("properties", {})
        geometry = feature.get("geometry", {})
        coordinates = geometry.get("coordinates")

        if not coordinates or len(coordinates) < 2:
            continue

        name = _get_display_name(properties)
        categories = properties.get("categories", [])

        if not name or not _is_relevant_attraction(
            name,
            categories,
        ):
            continue

        normalized_name = _normalise_text(name)

        if normalized_name in seen_names:
            continue

        seen_names.add(normalized_name)

        place_longitude = coordinates[0]
        place_latitude = coordinates[1]

        candidates.append(
            {
                "id": properties.get("place_id"),
                "name": name.strip(),
                "category": _friendly_category(categories),
                "categories": categories,
                "latitude": place_latitude,
                "longitude": place_longitude,
                "distance_km": round(
                    _calculate_distance_km(
                        latitude,
                        longitude,
                        place_latitude,
                        place_longitude,
                    ),
                    1,
                ),
                "formatted_address": properties.get(
                    "formatted"
                ),
                "address": properties.get(
                    "address_line1"
                ),
                "city": properties.get("city"),
                "country": properties.get("country"),
                "website": properties.get("website"),
                "opening_hours": properties.get(
                    "opening_hours"
                ),
                "image_url": properties.get("image"),
                "description": properties.get(
                    "description"
                ),
                "wikipedia_url": None,
            }
        )

    # ------------------------------------------------------------
    # 2. Rank candidates before enrichment
    # ------------------------------------------------------------

    candidates.sort(
        key=lambda item: (
            -_attraction_score(item),
            item.get("distance_km", 9999),
        )
    )

    # ------------------------------------------------------------
    # 3. Enrich a larger candidate pool.
    #
    # We intentionally inspect more candidates than the final
    # limit because some attractions will not have a verified
    # image.
    # ------------------------------------------------------------

    enrichment_limit = min(
        len(candidates),
        max(limit * 4, 32),
    )

    enriched = []

    for attraction in candidates[:enrichment_limit]:
        try:
            media = _get_verified_media_and_description(
                attraction,
                destination,
            )

            attraction["image_url"] = (
                media.get("image_url")
                or attraction.get("image_url")
            )

            attraction["description"] = (
                media.get("description")
                or attraction.get("description")
            )

            attraction["wikipedia_url"] = (
                media.get("wikipedia_url")
            )

        except Exception as error:
            print(
                f"Attraction enrichment failed "
                f"for {attraction.get('name')}:",
                error,
            )

        enriched.append(attraction)

    # ------------------------------------------------------------
    # 4. Enrich known Wikipedia pages in one batch.
    #
    # Only exact Wikipedia references already associated with
    # these attractions are queried.
    # ------------------------------------------------------------

    wiki_media = _get_batched_wikipedia_media(
        [
            item
            for item in enriched
            if item.get("wikipedia_url")
        ]
    )

    for attraction in enriched:
        wiki_title = _extract_wikipedia_title(
            attraction.get("wikipedia_url")
        )

        wiki_key = _normalise_wikipedia_title(
            wiki_title
        )

        wiki_data = wiki_media.get(
            wiki_key,
            {},
        )

        # Use the exact Wikipedia article image only when the
        # Geoapify-linked article has no image from Place Details.
        if not attraction.get("image_url"):
            attraction["image_url"] = (
                wiki_data.get("image_url")
            )

        if not attraction.get("description"):
            attraction["description"] = (
                wiki_data.get("description")
            )

        if attraction.get("description"):
            attraction["description_source"] = (
                "verified"
            )
        else:
            location_text = (
                attraction.get("formatted_address")
                or destination
            )

            attraction["description"] = (
                f"{attraction['name']} is a "
                f"{attraction['category'].lower()} "
                f"in {location_text}."
            )

            attraction["description_source"] = (
                "generated_fallback"
            )

    # ------------------------------------------------------------
    # 5. Remove low-confidence generic memorials.
    # ------------------------------------------------------------

    filtered = []

    for item in enriched:
        category_text = " ".join(
            item.get("categories", [])
        ).lower()

        is_generic_memorial = any(
            term in category_text
            for term in (
                "monument",
                "memorial",
            )
        )

        has_verified_signal = any(
            item.get(key)
            for key in (
                "image_url",
                "wikipedia_url",
                "website",
            )
        )

        if (
            is_generic_memorial
            and not has_verified_signal
        ):
            continue

        filtered.append(item)

    # ------------------------------------------------------------
    # 6. CRITICAL GALLERY RULE:
    #
    # Only attractions with a non-empty image URL are allowed
    # into the final attraction response.
    # ------------------------------------------------------------

    image_ready = [
        item
        for item in filtered
        if (
            isinstance(
                item.get("image_url"),
                str,
            )
            and item.get("image_url").strip()
        )
    ]

    # ------------------------------------------------------------
    # 7. Rank the verified-image attractions again.
    # ------------------------------------------------------------

    image_ready.sort(
        key=lambda item: (
            -_attraction_score(item),
            item.get(
                "distance_km",
                9999,
            ),
        )
    )

    # ------------------------------------------------------------
    # 8. Return up to `limit` verified-image attractions only.
    # ------------------------------------------------------------

    return image_ready[:limit]


def get_attractions_for_destination(destination):
    """Frontend-facing helper used by GET /attractions."""
    coordinates = get_coordinates(destination)
    if not coordinates:
        return []

    latitude, longitude = coordinates

    return get_detailed_attractions(
        latitude,
        longitude,
        destination,
        limit=8,
    )
