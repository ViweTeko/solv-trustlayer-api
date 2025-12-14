
export type UnitType = 'HARVEST' | 'PROCESSED' | 'FINAL';
export type UnitStatus = 'ACTIVE' | 'TRANSIT' | 'ARCHIVED' | 'DISPOSED';
export type LabTestStatus = 'PENDING' | 'PASS' | 'FAIL';
export type QualityGrade = 'A' | 'B' | 'C' | 'Pending';
/**
 * Defines the structure of a Unit object as received
 * from the Django API (Read Contract).
 * NOTE: The backend (units/models.py) must implement these fields.
 * 
 */
export interface Unit {
    id: string;
    cultivar_name: string;
    weight: number;
    unit_type: UnitType;
    status: UnitStatus;
    lab_test_status: LabTestStatus;
    date_harvested: string;
    gps_coordinates: string;
    quality_grade: QualityGrade;
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
 * The input data for creating a new unit.
 * @interface UnitInput
 */
export interface UnitInput extends Omit<Unit, 'id' | 'created_at'> {}