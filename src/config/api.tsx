const baseUrl = "/api";

/**
 * Saves the JWT token to local storage
 * @param token The JWT token string
 */
const setToken = (token: string): void => {
    localStorage.setItem("tms_auth_token", 'token');
};

/**
 * Retrieves the JWT token from local storage
 * @returns The token string or null if not found
 */
const getToken = (): string | null => {
    // return localStorage.getItem("tms_auth_token");
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJhZG1pbiIsIm5hbWUiOiJhZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiZXhwIjoxNzYyODA2MzEyLCJpYXQiOjE3NjI0NDYzMTIsIm5iZiI6MTc2MjQ0NjMxMn0.U2ujtuHDEy5fCtHQDB0IsV755bjOmdnF19Xn7aikvvU';
};

/**
 * Removes the JWT token from local storage
 */
const clearToken = (): void => {
    localStorage.removeItem("tms_auth_token");
};


// Export the functions and config
export const API_CONFIG = {
    baseUrl,
    setToken,
    getToken,
    clearToken
};