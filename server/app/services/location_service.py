import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from dotenv import load_dotenv


load_dotenv()


GEONAMES_BASE_URL = "http://api.geonames.org"
GEONAMES_USERNAME = os.getenv("GEONAMES_USERNAME")


def _geonames_request(endpoint: str, params: dict):
    if not GEONAMES_USERNAME:
        raise RuntimeError(
            "GEONAMES_USERNAME is not configured."
        )

    request_params = {
        **params,
        "username": GEONAMES_USERNAME,
    }

    url = (
        f"{GEONAMES_BASE_URL}/{endpoint}"
        f"?{urlencode(request_params)}"
    )

    request = Request(
        url,
        headers={
            "User-Agent": "Voyagent-AI/1.0"
        },
    )

    try:
        with urlopen(
            request,
            timeout=10
        ) as response:

            data = json.loads(
                response.read().decode("utf-8")
            )

    except Exception as error:
        raise RuntimeError(
            f"GeoNames request failed: {error}"
        ) from error

    if "status" in data:
        message = data["status"].get(
            "message",
            "GeoNames API error."
        )

        raise RuntimeError(message)

    return data


# =========================================================
# COUNTRIES
# =========================================================

def get_countries():
    data = _geonames_request(
        "countryInfoJSON",
        {}
    )

    countries = []

    for country in data.get(
        "geonames",
        []
    ):
        countries.append({
            "id": country.get("geonameId"),
            "name": country.get("countryName"),
            "countryCode": country.get("countryCode"),
            "continent": country.get("continent"),
            "capital": country.get("capital"),
        })

    countries.sort(
        key=lambda item: (
            item["name"] or ""
        ).lower()
    )

    return countries


# =========================================================
# CHILD LOCATIONS
# =========================================================

def get_children(geoname_id: int):
    data = _geonames_request(
        "childrenJSON",
        {
            "geonameId": geoname_id,
            "maxRows": 500,
        },
    )

    locations = []

    for place in data.get(
        "geonames",
        []
    ):
        locations.append({
            "id": place.get("geonameId"),
            "name": place.get("name"),
            "asciiName": place.get("asciiName"),

            "countryCode":
                place.get("countryCode"),

            "adminCode1":
                place.get("adminCode1"),

            "adminCode2":
                place.get("adminCode2"),

            "adminCode3":
                place.get("adminCode3"),

            "featureClass":
                place.get("fcl"),

            "featureCode":
                place.get("fcode"),

            "latitude":
                place.get("lat"),

            "longitude":
                place.get("lng"),
        })

    locations.sort(
        key=lambda item: (
            item["name"] or ""
        ).lower()
    )

    return locations


# =========================================================
# SEARCH LOCATIONS
# =========================================================

def search_locations(
    query: str,
    country_code: str | None = None,
    admin_code1: str | None = None,
    admin_code2: str | None = None,
    admin_code3: str | None = None,
):
    query = query.strip()

    if not query:
        return []

    # -----------------------------------------------------
    # GeoNames search parameters
    # -----------------------------------------------------

    params = {
        "name_startsWith": query,
        "maxRows": 10,
        "type": "json",
        "style": "MEDIUM",
    }

    # -----------------------------------------------------
    # CONTEXT FILTERS
    #
    # Country selected:
    #     country = IN
    #
    # Maharashtra selected:
    #     country = IN
    #     adminCode1 = ...
    #
    # Pune selected:
    #     country = IN
    #     adminCode1 = ...
    #     adminCode2 = ...
    #
    # Taluka selected:
    #     country = IN
    #     adminCode1 = ...
    #     adminCode2 = ...
    #     adminCode3 = ...
    # -----------------------------------------------------

    if country_code:
        params["country"] = country_code

    if admin_code1:
        params["adminCode1"] = admin_code1

    if admin_code2:
        params["adminCode2"] = admin_code2

    if admin_code3:
        params["adminCode3"] = admin_code3

    # -----------------------------------------------------
    # Search GeoNames
    # -----------------------------------------------------

    data = _geonames_request(
        "searchJSON",
        params
    )

    locations = []

    # -----------------------------------------------------
    # Add matching countries ONLY when no country
    # context is selected.
    #
    # Example:
    # User types "ind"
    # → India should appear.
    #
    # But if user already selected India:
    # User types "ma"
    # → we don't want country results.
    # -----------------------------------------------------

    if not country_code:
        query_lower = query.lower()

        countries_data = _geonames_request(
            "countryInfoJSON",
            {}
        )

        for country in countries_data.get(
            "geonames",
            []
        ):
            country_name = (
                country.get("countryName")
                or ""
            )

            country_code_value = (
                country.get("countryCode")
                or ""
            )

            if (
                country_name.lower().startswith(
                    query_lower
                )
                or country_code_value.lower()
                == query_lower
            ):
                locations.append({
                    "id":
                        country.get("geonameId"),

                    "name":
                        country_name,

                    "asciiName":
                        country_name,

                    "countryName":
                        country_name,

                    "countryCode":
                        country_code_value,

                    "state": "",
                    "district": "",
                    "subdistrict": "",

                    "adminCode1": "",
                    "adminCode2": "",
                    "adminCode3": "",

                    "featureClass": "A",
                    "featureCode": "ADM0",

                    "latitude":
                        country.get("lat"),

                    "longitude":
                        country.get("lng"),
                })

    # -----------------------------------------------------
    # Add GeoNames places
    # -----------------------------------------------------

    for place in data.get(
        "geonames",
        []
    ):
        locations.append({
            "id":
                place.get("geonameId"),

            "name":
                place.get("name"),

            "asciiName":
                place.get("asciiName"),

            "countryName":
                place.get("countryName"),

            "countryCode":
                place.get("countryCode"),

            "state":
                place.get("adminName1"),

            "district":
                place.get("adminName2"),

            "subdistrict":
                place.get("adminName3"),

            "adminCode1":
                place.get("adminCode1"),

            "adminCode2":
                place.get("adminCode2"),

            "adminCode3":
                place.get("adminCode3"),

            "featureClass":
                place.get("fcl"),

            "featureCode":
                place.get("fcode"),

            "latitude":
                place.get("lat"),

            "longitude":
                place.get("lng"),
        })

    # -----------------------------------------------------
    # Remove duplicate locations
    # -----------------------------------------------------

    unique_locations = {}

    for location in locations:
        location_id = location.get("id")

        if location_id is not None:
            if location_id not in unique_locations:
                unique_locations[
                    location_id
                ] = location

    locations = list(
        unique_locations.values()
    )

    # -----------------------------------------------------
    # Countries first, then normal locations
    # -----------------------------------------------------

    locations.sort(
        key=lambda item: (
            0
            if item.get("featureCode") == "ADM0"
            else 1,

            (
                item.get("name")
                or ""
            ).lower(),
        )
    )

    return locations[:10]