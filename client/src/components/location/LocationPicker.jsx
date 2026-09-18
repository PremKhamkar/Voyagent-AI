import { useEffect, useRef, useState } from "react";

const API_BASE_URL = "http://127.0.0.1:8000";

const EMPTY_LEVELS = {
    country: null,
    state: null,
    district: null,
    subdistrict: null,
    city: null,
};

const LEVELS = ["country", "state", "district", "subdistrict", "city"];


function CloseIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        >
            <path d="M6 6l12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}

function LocationPicker({
    label,
    type,
    value,
    onChange,
    placeholder = "Search location...",
}) {
    const containerRef = useRef(null);
    const requestCounterRef = useRef(0);
    const debounceRefs = useRef({});

    const [levels, setLevels] = useState(EMPTY_LEVELS);
    const [activeField, setActiveField] = useState(null);
    const [fieldText, setFieldText] = useState({});
    const [fieldResults, setFieldResults] = useState({});
    const [fieldLoading, setFieldLoading] = useState({});
    const [countries, setCountries] = useState([]);
    const [countriesLoading, setCountriesLoading] = useState(false);
    const [directSearchText, setDirectSearchText] = useState("");
    const [directResults, setDirectResults] = useState([]);
    const [directLocation, setDirectLocation] = useState(null);
    const [directLoading, setDirectLoading] = useState(false);
    const [inputMode, setInputMode] = useState("direct");
    const [error, setError] = useState("");

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setActiveField(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        // Sync an externally cleared value, but do not overwrite the
        // progressive hierarchy after the user selects a lower level.
        if (!value?.name) {
            setLevels(EMPTY_LEVELS);
            setActiveField(null);
            setFieldText({});
            setFieldResults({});
            setDirectSearchText("");
            setDirectResults([]);
            return;
        }

        // A value created by the direct-search control must remain a direct
        // location. Never promote it to Country just because Planner returns
        // a simple { name } object.
        if (directLocation?.name === value.name) {
            return;
        }

        const hasSelectedLevel = Object.values(levels).some(Boolean);
        if (hasSelectedLevel) {
            return;
        }

        // If Planner restores a rich country object, it is safe to restore
        // the hierarchy. A plain { name } value is treated as a direct place.
        if (value.countryCode || value.featureCode === "ADM0") {
            setLevels({ ...EMPTY_LEVELS, country: value });
        }
    }, [value]);

    useEffect(() => {
        return () => {
            Object.values(debounceRefs.current).forEach((timer) => {
                if (timer) clearTimeout(timer);
            });
        };
    }, []);

    const normalizeLocation = (location, context = {}) => ({
        id: location?.id ?? null,
        name: location?.name || "",
        asciiName: location?.asciiName || location?.name || "",
        countryName:
            location?.countryName ||
            context.countryName ||
            levels.country?.name ||
            "",
        countryCode:
            location?.countryCode ||
            context.countryCode ||
            levels.country?.countryCode ||
            "",
        state:
            location?.state ||
            context.state ||
            levels.state?.name ||
            "",
        district:
            location?.district ||
            context.district ||
            levels.district?.name ||
            "",
        subdistrict:
            location?.subdistrict ||
            context.subdistrict ||
            levels.subdistrict?.name ||
            "",
        adminCode1:
            location?.adminCode1 ||
            context.adminCode1 ||
            levels.state?.adminCode1 ||
            "",
        adminCode2:
            location?.adminCode2 ||
            context.adminCode2 ||
            levels.district?.adminCode2 ||
            "",
        adminCode3:
            location?.adminCode3 ||
            context.adminCode3 ||
            levels.subdistrict?.adminCode3 ||
            "",
        featureClass: location?.featureClass || "",
        featureCode: location?.featureCode || "",
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
    });

    const fetchCountries = async () => {
        if (countries.length) return countries;

        try {
            setCountriesLoading(true);
            const response = await fetch(`${API_BASE_URL}/locations/countries`);
            if (!response.ok) throw new Error("Unable to load countries.");
            const data = await response.json();
            const list = Array.isArray(data)
                ? data
                : data.locations || data.countries || data.geonames || [];
            setCountries(list);
            return list;
        } catch (err) {
            console.error("Country loading error:", err);
            setError("Unable to load countries.");
            return [];
        } finally {
            setCountriesLoading(false);
        }
    };

    const fetchChildren = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/children/${id}`);
            if (!response.ok) throw new Error("Unable to load locations.");
            const data = await response.json();
            return Array.isArray(data)
                ? data
                : data.locations || data.children || data.geonames || [];
        } catch (err) {
            console.error("Children loading error:", err);
            return [];
        }
    };

    const searchLocations = async (query, level) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setFieldResults((prev) => ({ ...prev, [level]: [] }));
            setFieldLoading((prev) => ({ ...prev, [level]: false }));
            return;
        }

        const requestId = ++requestCounterRef.current;
        setFieldLoading((prev) => ({ ...prev, [level]: true }));
        setError("");

        try {
            const params = new URLSearchParams();
            params.set("q", trimmed);

            if (levels.country?.countryCode) {
                params.set("country", levels.country.countryCode);
            }
            if (levels.state?.adminCode1) {
                params.set("adminCode1", levels.state.adminCode1);
            }
            if (levels.district?.adminCode2) {
                params.set("adminCode2", levels.district.adminCode2);
            }
            if (levels.subdistrict?.adminCode3) {
                params.set("adminCode3", levels.subdistrict.adminCode3);
            }

            const response = await fetch(
                `${API_BASE_URL}/locations/search?${params.toString()}`
            );
            if (!response.ok) throw new Error("Search failed.");

            const data = await response.json();
            const results = Array.isArray(data)
                ? data
                : data.locations || data.results || data.geonames || [];

            if (requestId !== requestCounterRef.current) return;

            setFieldResults((prev) => ({
                ...prev,
                [level]: results.slice(0, 8),
            }));
        } catch (err) {
            if (requestId !== requestCounterRef.current) return;
            console.error("Location search error:", err);
            setFieldResults((prev) => ({ ...prev, [level]: [] }));
            setError("Location search is temporarily unavailable.");
        } finally {
            if (requestId === requestCounterRef.current) {
                setFieldLoading((prev) => ({ ...prev, [level]: false }));
            }
        }
    };

    const searchAnyPlace = async (query) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
            setDirectResults([]);
            setDirectLoading(false);
            return;
        }

        const requestId = ++requestCounterRef.current;
        setDirectLoading(true);
        setError("");

        try {
            const params = new URLSearchParams();
            params.set("q", trimmed);

            if (levels.country?.countryCode) {
                params.set("country", levels.country.countryCode);
            }
            if (levels.state?.adminCode1) {
                params.set("adminCode1", levels.state.adminCode1);
            }
            if (levels.district?.adminCode2) {
                params.set("adminCode2", levels.district.adminCode2);
            }
            if (levels.subdistrict?.adminCode3) {
                params.set("adminCode3", levels.subdistrict.adminCode3);
            }

            const response = await fetch(
                `${API_BASE_URL}/locations/search?${params.toString()}`
            );
            if (!response.ok) throw new Error("Search failed.");

            const data = await response.json();
            const results = Array.isArray(data)
                ? data
                : data.locations || data.results || data.geonames || [];

            if (requestId !== requestCounterRef.current) return;
            setDirectResults(results.slice(0, 8));
        } catch (err) {
            if (requestId !== requestCounterRef.current) return;
            console.error("Direct location search error:", err);
            setDirectResults([]);
            setError("Location search is temporarily unavailable.");
        } finally {
            if (requestId === requestCounterRef.current) {
                setDirectLoading(false);
            }
        }
    };

    const getContext = (level) => {
        if (level === "country") return {};
        return {
            countryName: levels.country?.name || levels.country?.countryName || "",
            countryCode: levels.country?.countryCode || "",
            state: levels.state?.name || "",
            district: levels.district?.name || "",
            subdistrict: levels.subdistrict?.name || "",
            adminCode1: levels.state?.adminCode1 || "",
            adminCode2: levels.district?.adminCode2 || "",
            adminCode3: levels.subdistrict?.adminCode3 || "",
        };
    };

    const setLevelAndNotify = (level, location) => {
        const normalized = normalizeLocation(location, getContext(level));
        const index = LEVELS.indexOf(level);
        const next = { ...levels };

        next[level] = normalized;
        LEVELS.slice(index + 1).forEach((key) => {
            next[key] = null;
        });

        if (level === "country") {
            next.country = normalized;
        }

        setLevels(next);
        setInputMode("hierarchy");

        const output = {
            ...normalized,
            name: normalized.name,
        };

        onChange?.(output);
        setActiveField(null);
        setError("");

        LEVELS.forEach((key) => {
            if (key !== level) {
                setFieldText((prev) => ({ ...prev, [key]: "" }));
                setFieldResults((prev) => ({ ...prev, [key]: [] }));
            }
        });

        return normalized;
    };

    const handleCountrySelect = async (location) => {
        const selected = setLevelAndNotify("country", location);
        if (!selected.id) return;

        // The next field is available immediately, but its own list is loaded only when opened.
        await fetchChildren(selected.id);
    };

    const handleChildSelect = async (level, location) => {
        const selected = setLevelAndNotify(level, location);
        if (!selected.id) return;
        await fetchChildren(selected.id);
    };

    const openField = async (level) => {
        const shouldOpen = activeField !== level;
        setActiveField(shouldOpen ? level : null);
        setError("");

        if (!shouldOpen) return;

        if (level === "country") {
            const list = await fetchCountries();
            setFieldResults((prev) => ({ ...prev, country: list }));
            return;
        }

        const parentLevel = LEVELS[LEVELS.indexOf(level) - 1];
        const parent = levels[parentLevel];

        if (!parent?.id) {
            setFieldResults((prev) => ({ ...prev, [level]: [] }));
            return;
        }

        setFieldLoading((prev) => ({ ...prev, [level]: true }));
        const children = await fetchChildren(parent.id);
        setFieldResults((prev) => ({ ...prev, [level]: children.slice(0, 100) }));
        setFieldLoading((prev) => ({ ...prev, [level]: false }));
    };

    const handleFieldChange = (level, event) => {
        const query = event.target.value;
        setFieldText((prev) => ({ ...prev, [level]: query }));
        setError("");

        if (debounceRefs.current[level]) {
            clearTimeout(debounceRefs.current[level]);
        }

        if (level === "country") {
            // Country uses the cached country list for instant local filtering.
            // This keeps the country dropdown fast while the top search handles
            // arbitrary places such as Taj Mahal, Kalsubai and Wagholi.
            const text = query.trim().toLowerCase();

            if (!text) {
                setFieldResults((prev) => ({
                    ...prev,
                    country: countries,
                }));
                setFieldLoading((prev) => ({
                    ...prev,
                    country: false,
                }));
                return;
            }

            setFieldLoading((prev) => ({
                ...prev,
                country: countriesLoading,
            }));

            setFieldResults((prev) => ({
                ...prev,
                country: countries
                    .filter((country) =>
                        (country.name || "")
                            .toLowerCase()
                            .startsWith(text)
                    )
                    .slice(0, 8),
            }));

            return;
        }

        setFieldResults((prev) => ({ ...prev, [level]: [] }));
        setFieldLoading((prev) => ({ ...prev, [level]: true }));

        debounceRefs.current[level] = setTimeout(() => {
            searchLocations(query, level);
        }, 250);
    };

    const handleDirectSearchChange = (event) => {
        const query = event.target.value;
        setDirectSearchText(query);

        if (debounceRefs.current.direct) {
            clearTimeout(debounceRefs.current.direct);
        }

        if (query.trim().length < 2) {
            setDirectResults([]);
            setDirectLoading(false);
            return;
        }

        setDirectResults([]);
        setDirectLoading(true);
        debounceRefs.current.direct = setTimeout(() => {
            searchAnyPlace(query);
        }, 250);
    };

    const clearLocation = (event) => {
        event.stopPropagation();
        setLevels(EMPTY_LEVELS);
        setDirectLocation(null);
        setActiveField(null);
        setFieldText({});
        setFieldResults({});
        setDirectSearchText("");
        setDirectResults([]);
        setDirectLocation(null);
        setInputMode("direct");
        setError("");
        onChange?.(null);
    };

    const getFieldConfig = (level) => {
        switch (level) {
            case "country":
                return {
                    title: "Country",
                    placeholder: "Search country...",
                    optional: false,
                };
            case "state":
                return {
                    title: "State",
                    placeholder: levels.country?.name
                        ? `Search state in ${levels.country.name}...`
                        : "Search state...",
                    optional: true,
                };
            case "district":
                return {
                    title: "District",
                    placeholder: levels.state?.name
                        ? `Search district in ${levels.state.name}...`
                        : "Search district...",
                    optional: true,
                };
            case "subdistrict":
                return {
                    title: "Taluka / Subdistrict",
                    placeholder: levels.district?.name
                        ? `Search taluka in ${levels.district.name}...`
                        : "Search taluka...",
                    optional: true,
                };
            case "city":
                return {
                    title: "City / Village",
                    placeholder: levels.subdistrict?.name
                        ? `Search city or village in ${levels.subdistrict.name}...`
                        : "Search city or village...",
                    optional: true,
                };
            default:
                return { title: "Location", placeholder: "Search location...", optional: true };
        }
    };

    const getNextLevel = (level) => {
        const index = LEVELS.indexOf(level);
        return LEVELS[index + 1] || null;
    };

    const getCountryResults = () => {
        const query = (fieldText.country || "").trim().toLowerCase();
        if (!query) return countries.slice(0, 8);
        return countries
            .filter((country) => (country.name || "").toLowerCase().includes(query))
            .slice(0, 8);
    };

    const getCurrentOptions = (level) => {
        const text = (fieldText[level] || "").trim();
        if (level === "country") return getCountryResults();
        return fieldResults[level] || (text ? [] : []);
    };

    const getSearchSubtitle = (location) => {
        return [
            location.subdistrict,
            location.district,
            location.state,
            location.countryName,
        ]
            .filter(Boolean)
            .slice(0, 3)
            .join(", ");
    };

    const selectedName = directLocation?.name || value?.name || "";

    const renderLocationIcon = () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
        </svg>
    );

    const renderSearchIcon = () => (
        <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
        </svg>
    );

    const renderChevron = (direction = "down") => {
        const path =
            direction === "up"
                ? "m18 15-6-6-6 6"
                : direction === "right"
                  ? "m9 18 6-6-6-6"
                  : "m6 9 6 6 6-6";

        return (
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d={path} />
            </svg>
        );
    };

    const renderField = (level, index) => {
        const config = getFieldConfig(level);
        const selected = levels[level];
        const parentLevel = LEVELS[index - 1];
        const parentSelected = index === 0 || levels[parentLevel];
        const isActive = activeField === level;
        const options = getCurrentOptions(level);
        const text = fieldText[level] || "";
        const loading = level === "country" ? countriesLoading : fieldLoading[level];

        if (!parentSelected) return null;

        return (
            <div key={level} className="relative">
                <div className="mb-1.5 flex items-center justify-between px-0.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {config.title}
                        {config.optional && (
                            <span className="ml-1 font-normal normal-case tracking-normal text-slate-400">
                                (Optional)
                            </span>
                        )}
                    </label>
                </div>

                <button
                    type="button"
                    onClick={() => openField(level)}
                    className={`flex min-h-[48px] w-full items-center gap-3 rounded-xl border bg-white px-3.5 text-left transition dark:bg-slate-900 ${
                        isActive
                            ? "border-blue-500 ring-2 ring-blue-500/10"
                            : "border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600"
                    }`}
                >
                    <span className="shrink-0 text-slate-400">
                        {renderLocationIcon()}
                    </span>
                    <span className="min-w-0 flex-1 truncate">
                        {selected?.name ? (
                            <span className="font-medium text-slate-800 dark:text-white">
                                {selected.name}
                            </span>
                        ) : (
                            <span className="text-sm text-slate-400 dark:text-slate-500">
                                {config.placeholder}
                            </span>
                        )}
                    </span>
                    <span className="shrink-0 text-slate-400">
                        {renderChevron(isActive ? "up" : "down")}
                    </span>
                </button>

                {isActive && (
                    <div className="absolute left-0 right-0 top-full z-[70] mt-1.5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                        <div className="border-b border-slate-100 p-2.5 dark:border-slate-800">
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    {renderSearchIcon()}
                                </span>
                                <input
                                    autoFocus
                                    type="text"
                                    value={text}
                                    onChange={(event) => handleFieldChange(level, event)}
                                    placeholder={config.placeholder}
                                    className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                                {loading && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="max-h-56 overflow-y-auto p-1.5">
                            {loading && options.length === 0 ? (
                                <div className="px-3 py-7 text-center text-xs text-slate-500">
                                    Searching locations...
                                </div>
                            ) : options.length > 0 ? (
                                options.map((location, optionIndex) => {
                                    const normalized = normalizeLocation(location, getContext(level));
                                    return (
                                        <button
                                            key={location.id ?? `${location.name}-${optionIndex}`}
                                            type="button"
                                            onClick={() =>
                                                level === "country"
                                                    ? handleCountrySelect(location)
                                                    : handleChildSelect(level, location)
                                            }
                                            className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                {renderLocationIcon()}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                                    {normalized.name}
                                                </span>
                                                {getSearchSubtitle(normalized) && (
                                                    <span className="mt-0.5 block truncate text-xs text-slate-400">
                                                        {getSearchSubtitle(normalized)}
                                                    </span>
                                                )}
                                            </span>
                                            <span className="shrink-0 text-slate-400">
                                                {getNextLevel(level) ? renderChevron("right") : null}
                                            </span>
                                        </button>
                                    );
                                })
                            ) : text.trim().length >= 2 ? (
                                <div className="px-3 py-7 text-center text-xs text-slate-500">
                                    No locations found.
                                </div>
                            ) : (
                                <div className="px-3 py-3 text-xs text-slate-400">
                                    Search or select a location.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderDirectSearch = () => (
        <div className="relative">
            <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {renderSearchIcon()}
                </span>
                <input
                    type="text"
                    value={directSearchText}
                    onChange={handleDirectSearchChange}
                    placeholder={placeholder || "Search any place..."}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
                />
                {directLoading && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                    </span>
                )}
            </div>

            {directSearchText.trim().length >= 2 && (
                <div className="mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                    {directLoading && directResults.length === 0 ? (
                        <div className="px-3 py-7 text-center text-xs text-slate-500">
                            Searching locations...
                        </div>
                    ) : directResults.length > 0 ? (
                        directResults.map((location, index) => {
                            const normalized = normalizeLocation(location);
                            return (
                                <button
                                    key={location.id ?? `${location.name}-${index}`}
                                    type="button"
                                    onClick={() => {
                                        const isCountry =
                                            normalized.featureCode === "ADM0";

                                        if (isCountry) {
                                            // A real country starts the optional
                                            // State -> District -> Taluka -> City
                                            // hierarchy.
                                            const next = {
                                                ...EMPTY_LEVELS,
                                                country: normalized,
                                            };

                                            setDirectLocation(null);
                                            setInputMode("hierarchy");
                                            setLevels(next);
                                            setFieldText({});
                                            setFieldResults({});
                                            setDirectSearchText("");
                                            setDirectResults([]);
                                            setActiveField(null);
                                            setError("");
                                            onChange?.(normalized);
                                            return;
                                        }

                                        // A normal place result is a final location.
                                        // Do not treat Kalsubai, Taj Mahal, Wagholi,
                                        // etc. as a country and do not load children.
                                        setDirectLocation(normalized);
                                        setInputMode("direct");
                                        setLevels({ ...EMPTY_LEVELS });
                                        setFieldText({});
                                        setFieldResults({});
                                        setDirectSearchText("");
                                        setDirectResults([]);
                                        setActiveField(null);
                                        setError("");
                                        onChange?.(normalized);
                                    }}
                                    className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <span className="mt-0.5 text-slate-400">
                                        {renderLocationIcon()}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                            {normalized.name}
                                        </span>
                                        {getSearchSubtitle(normalized) && (
                                            <span className="mt-0.5 block truncate text-xs text-slate-400">
                                                {getSearchSubtitle(normalized)}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                const typed = directSearchText.trim();
                                const manual = {
                                    id: null,
                                    name: typed,
                                    asciiName: typed,
                                    countryName: levels.country?.name || "",
                                    countryCode: levels.country?.countryCode || "",
                                    state: levels.state?.name || "",
                                    district: levels.district?.name || "",
                                    subdistrict: levels.subdistrict?.name || "",
                                    latitude: null,
                                    longitude: null,
                                    manual: true,
                                };

                                setDirectLocation(manual);
                                setInputMode("direct");
                                setLevels({ ...EMPTY_LEVELS });
                                setFieldText({});
                                setFieldResults({});
                                setDirectSearchText("");
                                setDirectResults([]);
                                setActiveField(null);
                                setError("");
                                onChange?.(manual);
                            }}
                            className="w-full rounded-lg px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                Use “{directSearchText.trim()}”
                            </span>
                            <span className="mt-0.5 block text-xs text-slate-400">
                                Continue with this place name
                            </span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );

    const hasHierarchy = Object.values(levels).some(Boolean);

    const switchToHierarchy = async () => {
        setInputMode("hierarchy");
        setDirectSearchText("");
        setDirectResults([]);
        setActiveField(null);
        setError("");

        if (!levels.country) {
            const list = await fetchCountries();
            setFieldResults((prev) => ({
                ...prev,
                country: list.slice(0, 100),
            }));
        }
    };

    const switchToDirectSearch = () => {
        setInputMode("direct");
        setActiveField(null);
        setFieldText({});
        setFieldResults({});
        setError("");
    };

    return (
        <div ref={containerRef} className="relative w-full">
            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {label}
            </label>

            {inputMode === "direct" ? (
                <div className="relative">
                    <div className="relative">
                        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                            {renderSearchIcon()}
                        </span>

                        <input
                            type="text"
                            value={directSearchText || directLocation?.name || ""}
                            onFocus={(event) => {
                                if (directLocation && !directSearchText) {
                                    event.currentTarget.select();
                                    setDirectLocation(null);
                                    setDirectSearchText("");
                                    onChange?.(null);
                                }
                            }}
                            onChange={handleDirectSearchChange}
                            placeholder={placeholder || "Search any place..."}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                        />

                        {directLoading && (
                            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-500" />
                            </span>
                        )}
                    </div>

                    {directSearchText.trim().length >= 2 && (
                        <div className="absolute left-0 right-0 top-full z-[80] mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">
                            {directLoading && directResults.length === 0 ? (
                                <div className="px-3 py-7 text-center text-xs text-slate-500">
                                    Searching locations...
                                </div>
                            ) : directResults.length > 0 ? (
                                directResults.map((location, index) => {
                                    const normalized = normalizeLocation(location);
                                    const isCountry = normalized.featureCode === "ADM0";

                                    return (
                                        <button
                                            key={location.id ?? `${location.name}-${index}`}
                                            type="button"
                                            onClick={() => {
                                                if (isCountry) {
                                                    const next = {
                                                        ...EMPTY_LEVELS,
                                                        country: normalized,
                                                    };

                                                    setDirectLocation(null);
                                                    setInputMode("hierarchy");
                                                    setLevels(next);
                                                    setFieldText({});
                                                    setFieldResults({});
                                                    setDirectSearchText("");
                                                    setDirectResults([]);
                                                    setActiveField(null);
                                                    setError("");
                                                    onChange?.(normalized);
                                                    return;
                                                }

                                                setDirectLocation(normalized);
                                                setInputMode("direct");
                                                setLevels({ ...EMPTY_LEVELS });
                                                setFieldText({});
                                                setFieldResults({});
                                                setDirectSearchText(normalized.name);
                                                setDirectResults([]);
                                                setActiveField(null);
                                                setError("");
                                                onChange?.(normalized);
                                            }}
                                            className="flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                                        >
                                            <span className="mt-0.5 shrink-0 text-slate-400">
                                                {renderLocationIcon()}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-slate-800 dark:text-slate-100">
                                                    {normalized.name}
                                                </span>
                                                {getSearchSubtitle(normalized) && (
                                                    <span className="mt-0.5 block truncate text-xs text-slate-400">
                                                        {getSearchSubtitle(normalized)}
                                                    </span>
                                                )}
                                            </span>
                                            {isCountry && (
                                                <span className="shrink-0 text-xs text-slate-400">
                                                    Country
                                                </span>
                                            )}
                                        </button>
                                    );
                                })
                            ) : !directLoading && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const typed = directSearchText.trim();
                                        if (!typed) return;

                                        const manual = {
                                            id: null,
                                            name: typed,
                                            asciiName: typed,
                                            countryName: "",
                                            countryCode: "",
                                            state: "",
                                            district: "",
                                            subdistrict: "",
                                            adminCode1: "",
                                            adminCode2: "",
                                            adminCode3: "",
                                            latitude: null,
                                            longitude: null,
                                            manual: true,
                                        };

                                        setDirectLocation(manual);
                                        setInputMode("direct");
                                        setLevels({ ...EMPTY_LEVELS });
                                        setDirectSearchText("");
                                        setDirectResults([]);
                                        setActiveField(null);
                                        setError("");
                                        onChange?.(manual);
                                    }}
                                    className="w-full rounded-lg px-3 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                                >
                                    <span className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                                        Use “{directSearchText.trim()}”
                                    </span>
                                    <span className="mt-0.5 block text-xs text-slate-400">
                                        Continue with this place name
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {!directSearchText.trim() && !directLocation && (
                        <button
                            type="button"
                            onClick={switchToHierarchy}
                            className="mt-2 text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Browse by country
                        </button>
                    )}

                    {directLocation && (
                        <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/60">
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    Selected location
                                </div>
                                <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {directLocation.name}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={clearLocation}
                                className="ml-3 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label={`Clear ${label}`}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <div className="text-sm font-semibold text-slate-800 dark:text-white">
                                Location details
                            </div>
                            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Lower levels are optional. Select only the detail you need.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={switchToDirectSearch}
                            className="shrink-0 text-xs font-medium text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Change
                        </button>
                    </div>

                    <div className="space-y-3">
                        {LEVELS.map((level, index) => renderField(level, index))}
                    </div>

                    {hasHierarchy && selectedName && (
                        <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/60">
                            <div className="min-w-0">
                                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                    Selected location
                                </div>
                                <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {selectedName}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={clearLocation}
                                className="ml-3 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                aria-label={`Clear ${label}`}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="mt-2 text-xs text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}

export default LocationPicker;
