import React, { MouseEvent } from 'react';
import { useUnits } from './UnitContext';
import { UnitRow } from './UnitRow';

export const UnitList: React.FC = () => {
    const { units, isLoading, error, refreshUnits } = useUnits();


    if (isLoading) {
        return (
            <div className="text-center p-10">
                <div className="animate-spin inline-block w-8 h-8
                border-4 border-t-indigo-600 border-gray-200
                rounded-full"> 
                </div>
                <p className="mt-4 text-indigo-600">
                    Loading Inventory Data...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400
            text-red-700 px-4 py-3 rounded relative my-4 shadow-md
            max-w-4x1 mx-auto">
                <strong className="font-bold">
                    Error Connecting to API:
                </strong>
                <span className="block sm:inline"> {error}</span>
                <button onClick={refreshUnits}
                    className="ml-4 underline font-medium">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg 
            overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex 
                justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                    Inventory Units ({units.length})
                </h3>
                <button 
                    onClick={(e: MouseEvent<HTMLButtonElement>) => { 
                        e.preventDefault(); 
                        refreshUnits(); 
                    }}
                    className="p-2 bg-gray-100 rounded-lg 
                        text-gray-600 hover:bg-gray-200 transition 
                        duration-150 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" 
                        stroke="currentColor" viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" 
                            strokeLinejoin="round" strokeWidth="2" 
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 0010.518 5m.05 8v5h.582m15.356 2A8.001 8.001 0 0110.518 19">
                        </path>
                    </svg>
                    Refresh
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y 
                    divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Name/Desc
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Location
                            </th> 
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Status
                            </th> 
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Lab Test
                            </th> 
                            <th className="px-6 py-3 text-left text-xs 
                                font-medium text-gray-500 uppercase 
                                tracking-wider">
                                Weight (kg)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y 
                        divide-gray-200">
                        {units.map((unit) => (
                            <UnitRow key={unit.id} unit={unit} />
                        ))}
                    </tbody>
                </table>
            </div>

            {units.length === 0 && !isLoading && (
                <div className="p-10 text-center text-gray-500">
                    No units found. Use the form to register your 
                    first bale.
                </div>
            )}
        </div>
    );
};