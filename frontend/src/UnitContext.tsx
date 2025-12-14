import React, { 
    createContext, useContext, useState, useEffect, useCallback, ReactNode 
} from 'react';
import { 
    createUnit, getAuthToken
} from './client_service';
import { Unit, UnitInput } from './api_contract';


/**
 * The context for managing units.
 * @interface UnitContextType
 * @property {Unit[]} units - The list of units.
 * @property {boolean} isLoading - Indicates if units are being loaded.
 * @property {string | null} error - The error message, if any.
 * @property {(unitData: UnitInput) => Promise<Unit | null>} addUnit 
 *          - Function to add a new unit.
 * @property {(updatedUnit: Unit) => Promise<Unit | null>} editUnit 
 *          - Function to update an existing unit
 * @property {() => void} refreshUnits 
 *          - Function to refresh the list of units.
 */
interface UnitContextType {
    units: Unit[];
    isLoading: boolean;
    error: string | null;
    addUnit: (unitData: UnitInput) => Promise<Unit | null>;
    editUnit: (updatedUnit: Unit) => Promise<Unit | null>;
    refreshUnits: () => void;
    //removeUnits: (unitId: number) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider
        : React.FC<{ children: ReactNode }> = ({ children }) => {
    const isAuthenticated = !!getAuthToken();

    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    

    const refreshUnits = useCallback(() => {
            setRefreshTrigger(prev => prev + 1);
        }, []);

    useEffect(() => {
        if (!isAuthenticated) { 
            setIsLoading(false);
            return; 
        }

        const fetchUnits = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data: Unit[] = await getUnits();
                setUnits(data);
            } catch (e: any) {
                console.error("Failed to fetch units:", e);
                setError(
                    e.message ||
                    "Failed to fetch inventory data."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUnits();
    }, [isAuthenticated, refreshTrigger]);

    const addUnit = async (unitData: UnitInput): Promise<Unit | null> => {
        try {
            const newUnit: Unit = await createUnit(unitData);
            setUnits(prevUnits => [newUnit, ...prevUnits]);
            return newUnit;
        } catch (e: any) {
            setError(e.message || 'Failed to add unit.');
            throw e;
        }
    };

    const editUnit = async (updatedUnit: Unit): Promise<Unit | null> => {
        try {
            //const updateUnit = await refreshUnits(updatedUnit);
            setUnits(prevUnits => prevUnits.map(u =>
                u.id === updatedUnit.id ? updatedUnit : u
            ));
            return updatedUnit;
        } catch (e: any) {
            setError(e.message || "Failed to update unit.");
            throw e;
        }
    };

    /*const removeUnit = async (unitId: number) => {
        try {
            const deletedUnit = await deleteUnit(unitId);
            setUnits(prevUnits => prevUnits.filter(
                u => u.id !== unitId ? deletedUnit: u
            ));
        } catch (e: any) {
            setError(e.message || 'Failed to delete unit.');
            throw e;
        }
    }; */

    const contextValue: UnitContextType = {
        units,
        isLoading,
        error,
        addUnit,
        editUnit,
        refreshUnits,
    };

    return (
        <UnitContext.Provider value={contextValue}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnits = () => {
    const context = useContext(UnitContext);
    if (context === undefined) {
        throw new Error('useUnits must be used within a UnitProvider');
    }
    return context;
};