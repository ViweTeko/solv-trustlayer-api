import React from 'react';
import { Unit } from './api_contract';

interface UnitRowProps {
    unit: Unit;
}

export const UnitRow: React.FC<UnitRowProps> = ({ unit }) => {
    const getTypeClass = (type: Unit['unit_type']) => {
        switch (type) {
            case 'HARVEST': return 'bg-green-100 text-green-800';
            case 'PROCESSED': return 'bg-yellow-100 text-yellow-800';
            case 'FINAL': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getLabTestClass = (status: Unit['lab_test_status']) => {
        switch (status) {
            case 'PASS': return 'bg-green-500 text-white';
            case 'FAIL': return 'bg-red-500 text-white';
            case 'PENDING': return 'bg-gray-400 text-white';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusClass = (status: Unit['status']) => {
        switch (status) {
            case 'ACTIVE': return 'text-green-600 bg-green-100';
            case 'TRANSIT': return 'text-yellow-600 bg-yellow-100';
            case 'DISPOSED': return 'text-red-600 bg-red-100';
            case 'ARCHIVED': return 'text-gray-600 bg-gray-200';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <tr className="hover:bg-gray-50 transition duration-150">
            <td className="px-6 py-4 whitespace-nowrap text-sm 
                font-medium text-gray-900" title={unit.description}>
                {unit.cultivar_name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 
                    font-semibold rounded-full 
                    ${getTypeClass(unit.unit_type)}`}>
                    {unit.unit_type}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm 
                text-gray-500" title={unit.storage_location}>
                {unit.storage_location}
            </td>
            <td className="px-3 py-4 whitespace-nowrap text-sm 
                text-gray-500">
                <div className="font-semibold text-gray-700">
                    Grade: {unit.quality_grade}
                </div>
                <div className="text-xs text-gray-500">
                    {unit.storage_location}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 
                    font-semibold rounded-full 
                    ${getStatusClass(unit.status)}`}>
                    {unit.status.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs leading-5 
                    font-bold rounded-lg shadow-sm 
                    ${getLabTestClass(unit.lab_test_status)}`}>
                    {unit.lab_test_status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm 
                text-gray-500">
                {unit.weight.toFixed(2)} kg
            </td>
        </tr>
    );
};