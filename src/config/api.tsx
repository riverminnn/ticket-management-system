const baseUrl = "/api";

/**
 * Saves the JWT token to local storage
 * @param token The JWT token string
 */
const setToken = (token: string): void => {
    localStorage.setItem("authToken", token);
};

/**
 * Retrieves the JWT token from local storage
 * @returns The token string or null if not found
 */
const getToken = (): string | null => {
    return localStorage.getItem("authToken");
};

/**
 * Removes the JWT token from local storage
 */
const clearToken = (): void => {
    localStorage.removeItem("authToken");
};


// Export the functions and config
export const API_CONFIG = {
    baseUrl,
    setToken,
    getToken,
    clearToken
};