
/**
 * Defines the structure of a Unit object as received from the Django API (Read Contract).
 */
export interface Unit {
    id: string;
    name: string;
    weight: number;
    unit_type: 'HARVEST' | 'PROCESSED' | 'FINAL';
    status: 'ACTIVE' | 'TRANSIT' | 'ARCHIVED' | 'DISPOSED';
    lab_test_status: 'PENDING' | 'PASS' | 'FAIL';
    storage_location: string;
    description: string;
    current_owner: string;
    parent_unit: string | null;
    created_at: string;
}

/**
 * Defines the structure of an Organization (Owner) for richer data display.
 * NOTE: The backend (users/models.py) must implement these fields.
 */
export interface Organization {
    id: string;
    name: string;
    licence_number: string;
    address: string;
    contact_email: string;
    is_active: boolean;
    created_at: string;
}

/**
 * Defines the structure of data sent to the Django API (Write Contract).
 * All fields required for creation, except for server-generated ones (id, created_at).
 */
export interface UnitInput {
    name: string;
    weight: number;
    unit_type: 'HARVEST' | 'PROCESSED' | 'FINAL';
    status: 'ACTIVE' | 'IN_TRANSIT' | 'ARCHIVED' | 'DISPOSED';
    lab_test_status: 'PENDING' | 'PASS' | 'FAIL';
    storage_location: string;
    description: string;
    current_owner: string; 
    parent_unit: string | null;
}