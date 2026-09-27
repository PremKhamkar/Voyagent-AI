import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import CONFIG from "../constants/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(
        localStorage.getItem("authToken")
    );
    const [isLoading, setIsLoading] = useState(true);

    /*
     * On first load, if a token already exists (from a
     * previous session), verify it against the backend and
     * restore the logged-in user instead of trusting it blindly.
     */
    useEffect(() => {
        async function restoreSession() {
            const storedToken = localStorage.getItem("authToken");

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${CONFIG.apiBaseUrl}/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${storedToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Session expired.");
                }

                const data = await response.json();
                setUser(data);
                setToken(storedToken);
            } catch {
                clearSession();
            } finally {
                setIsLoading(false);
            }
        }

        restoreSession();
    }, []);

    function persistSession(accessToken, userData) {
        localStorage.setItem("authToken", accessToken);

        /*
         * Kept for backward compatibility: other pages
         * (Dashboard, Profile, SavedTrips, etc.) still read
         * these directly for now.
         */
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userEmail", userData.email);

        setToken(accessToken);
        setUser(userData);
    }

    function clearSession() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");

        setToken(null);
        setUser(null);
    }

    async function login(email, password) {
        const response = await fetch(
            `${CONFIG.apiBaseUrl}/auth/login`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || "Login failed.",
            };
        }

        persistSession(data.access_token, data.user);
        return { success: true };
    }

    async function register(name, email, password) {
        const response = await fetch(
            `${CONFIG.apiBaseUrl}/auth/register`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                error: data.detail || "Registration failed.",
            };
        }

        persistSession(data.access_token, data.user);
        return { success: true };
    }

    function logout() {
        clearSession();
    }

    const value = {
        user,
        token,
        isLoading,
        isLoggedIn: Boolean(token && user),
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used within an AuthProvider."
        );
    }

    return context;
}