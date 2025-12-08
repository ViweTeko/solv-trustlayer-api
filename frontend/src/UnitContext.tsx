import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Unit, UnitInput } from './api_contract';
import { fetchUnits, createUnit, updateUnit } from './client_service';

interface UnitContextType {
    units: Unit[];
    isLoading: boolean;
    error: string | null;
    addUnit: (data: UnitInput) => Promise<Unit | undefined>;
    updateExistingUnit: (id: string, data: Partial<UnitInput>) => Promise<Unit | undefined>;
    refreshUnits: () => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [units, setUnits] = useState<Unit[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    // const { isAuthenticated } = useAuth();

    const loadUnits = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUnits();
            setUnits(data);
        } catch (e: any) {
            console.error("Failed to load units:", e);
            let errorMessage = "Failed to load inventory data. Check API connection and ensure backend is running.";
            try {
                const errorObj = JSON.parse(e.message);
                if (errorObj.detail) {
                     errorMessage = `API Error: ${errorObj.detail}`;
                }
            } catch {}
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    
    };

    useEffect(() => {
        // if (isAuthenticated) { loadUnits(); }
        loadUnits();
    }, []);

    const addUnit = async (data: UnitInput): Promise<Unit | undefined> => {
        try {
            const newUnit = await createUnit(data);
            setUnits(prevUnits => [...prevUnits, newUnit]);
            return newUnit;
        } catch (e: any) {
            const errorObj = JSON.parse(e.message);
            const validationErrors = Object.entries(errorObj).map(([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(', '): value}`
            ).join(', ');
            setError(`Creation failed: ${validationErrors}`);
            return undefined;
        }
    };

    const updateExistingUnit = async (id: string, data: Partial<UnitInput>): Promise<Unit | undefined> => {
        try {
            const updatedUnit = await updateUnit(id, data);
            setUnits(prevUnits => prevUnits.map(unit =>
                unit.id === id ? updatedUnit : unit
            ));
            return updatedUnit;
        } catch (e: any) {
            setError(e.message || "Failed to update unit.");
            return undefined;
        }
    };

    const contextValue: UnitContextType = {
        units,
        isLoading,
        error,
        addUnit,
        updateExistingUnit,
        refreshUnits: loadUnits,
    };

    return (
        <UnitContext.Provider value={contextValue}>
            {children}
        </UnitContext.Provider>
    );
};

export const useUnits = () => {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error('useUnits must be used within a UnitProvider');
    }
    return context;
};