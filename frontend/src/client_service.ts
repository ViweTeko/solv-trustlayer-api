import { Unit, UnitInput } from './api_contract';
// Dynamically determine the API base URL for Cloud Workstations.
const getApiBaseUrl = () => {
    if (window.location.hostname.includes('.cloudworkstations.dev')) {
        return window.location.protocol + '//8000-' + window.location.hostname + '/api';
    }
    return 'http://127.0.0.1:8000/api'; 
};

const API_BASE_URL = getApiBaseUrl();

export const DUMMY_ORG_ID = '1234789-1234-456789';
const DUMMY_JWT_TOKEN = 'mock_auth_token_12345';

// --- Core Reusable Fetcher ---
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DUMMY_JWT_TOKEN}`,
    };

    const url = `${API_BASE_URL}/${endpoint}`;
    options.headers = { ...defaultHeaders, ...options.headers };

    try {
        const response =await fetch(url, options);

        // Error Handling: Checking for non-2xx status codes
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
                detail: `API Error: ${response.statusText}`
            }));
            throw new Error(JSON.stringify(errorData));
        }

        if (response.status === 204) return null;
        return response.json();
    } catch (e) {
        console.error("Fetch failed:", e);
        throw e;
    }
};

// -- Unit Specific Functions (The Service Methods) ---

/**
 *  Retrieves all Units from the API. (GET /api/units/)
 */
export const fetchUnits = async (): Promise<Unit[]> => {
    return apiFetch('units/');
};

/**
 *  Creates a new Unit via the API. (POST /api/units/)
 */
export const createUnit = async (data: UnitInput): Promise<Unit> => {
    return apiFetch('units/', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * Updates an existing Unit. (PATCH /api/units/{id}/)
 */
export const updateUnit = async (id: string, data: Partial<UnitInput>): Promise<Unit> => {
    return apiFetch(`units/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};