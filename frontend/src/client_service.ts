/**
 * Client Service for the SOLV TrustLayer API.
 * @module client_service The module for the client service.
 */
import { Unit, UnitInput } from './api_contract';

/**
 * Determines the API base URL based on the current hostname.
 * @returns {string} The API base URL.
 */
const getApiBaseUrl = () => {
    if (import.meta.env.DEV) {
        return 'http:localhost:8000/api';
    }
    return 'api';
};

/**
 * The base URL for the API.
 */
export const API_BASE_URL = getApiBaseUrl();

/**
 * Logs in the user and sets the access token in local storage.
 * @param username The username of the user.
 * @param password The password of the user.
 * @param token The access token to set in local storage.
 * @returns {string | null} The access token from local storage, or null if not found.
 */
export const setAuthToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

/**
 * Retrieves the access token from local storage.
 * @returns {string | null} The access token from local storage, or null if not found.
 */
export const getAuthToken = () => {
    return localStorage.getItem('access_token');
};

/**
 * Logs the user out by removing the access token from local storage.
 * @returns {void}
 */
export const logout = () => {
    localStorage.removeItem('access_token');
};

// --- Core Reusable Fetcher ---
/**
 * Fetches data from the API with error handling and retry logic.
 * @param endpoint The API endpoint to fetch data from.
 * @param options Additional fetch options.
 * @returns A Promise that resolves to the fetched data.
 */
const apiFetch = async (
    endpoint: string,
    options: RequestInit = {}
): Promise<any> => {
    const token = getAuthToken(); // Real token
    const defaultHeaders: any = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}/${endpoint}`;
    options.headers = { ...defaultHeaders, ...options.headers };

    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        if (attempt > 0) {
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        try {
            const response = await fetch(url, options);

            // Error Handling: Checking for non-2xx status codes
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    detail: `HTTP Error! Status: ${response.status}`
                }));
                throw new Error(
                    errorData.detail ||
                    `Request failed with status ${response.status}`
                );
            }

            if (response.status === 401 ||
                response.status === 403
            ) {
                logout();
                throw new Error(
                    "Authentcation failed. Please log in again.");
            }

            if (response.status === 204) return null;

            return response.json();
        } catch (e: any) {
            lastError = e;
            if (e.message.includes("Authentication failed")) throw e;
        }
    }

    if (lastError) throw lastError;
    throw new Error("API request failed after multiple retries.");
};


// -- Unit Specific Functions (The Service Methods) ---

/**
 *  Retrieves all Units from the API. (GET /api/units/)
 * @returns A Promise that resolves to an array of Units.
 */
export const fetchUnits = async (): Promise<Unit[]> => {
    return apiFetch('units/');
};

/**
 *  Creates a new Unit via the API. (POST /api/units/)
 * @param unitData The data for the new Unit.
 * @returns A Promise that resolves to the created Unit.
 */
export const createUnit = async (unitData: Unit): Promise<Unit> => {
    const dataToSend = {
        ...unitData,
        date_harvested: unitData.date_harvested // date format: YYY-MM-DD
    };
    return apiFetch('units/', {
        method: 'POST',
        body: JSON.stringify(dataToSend),
    });
};

/**
 * Updates an existing Unit. (PATCH /api/units/{id}/)
 * @param unit The Unit to update.
 * @returns A Promise that resolves to the updated Unit.
 */
export const refreshUnits = async (unit: Unit): Promise<Unit> => {
    const dataToSend = {
        ...unit,
        date_harvested: unit.date_harvested
    };

    return apiFetch(`units/${unit.id}/`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend),
    });
};

/**
 * Deletes an existing Unit. (DELETE /api/units/{id}/)
 * @param unitId The ID of the Unit to delete.
 * @returns A Promise that resolves to void.
 */
export const deleteUnit = async (unitId: number): Promise<void> => {
    await apiFetch(`units/${unitId}/`, {
        method: 'DELETE'
    });
};

// --- Authentication Service ---
/**
 * Logs in the user and sets the access token in local storage.
 * @param username The username of the user.
 * @param password The password of the user.
 * @returns A Promise that resolves to the response data from login endpoint.
 */
export const loginUser = async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password})
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            detail: 'Login failed: Network or Server Error'
        }));
        throw new Error(errorData.detail || 'Login failed.');
    }
    return response.json();
};