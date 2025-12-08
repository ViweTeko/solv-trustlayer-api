import React, { useState, FormEvent, MouseEvent } from 'react';
import { Unit, UnitInput } from './api_contract';
import { useUnits, UnitProvider } from './UnitContext';
import { DUMMY_ORG_ID } from './client_service';

// --- Component: UnitRow ---
interface UnitRowProps {
    unit: Unit;
}

const UnitRow: React.FC<UnitRowProps> = ({ unit }) => {
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
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" title={unit.description}>
                {unit.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeClass(unit.unit_type)}`}>
                    {unit.unit_type}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={unit.storage_location}>
                {unit.storage_location}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(unit.status)}`}>
                    {unit.status.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs leading-5 font-bold rounded-lg shadow-sm ${getLabTestClass(unit.lab_test_status)}`}>
                    {unit.lab_test_status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.weight.toFixed(2)}</td>
        </tr>
    );
};


// --- Component: UnitList ---
const UnitList: React.FC = () => {
    const { units, isLoading, error, refreshUnits } = useUnits();

    if (isLoading) {
        return (
            <div className="text-center p-10">
                <div className="animate-spin inline-block w-8 h-8 border-4 border-t-indigo-600 border-gray-200 rounded-full"></div>
                <p className="mt-4 text-indigo-600">Loading Inventory Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4 shadow-md max-w-4xl mx-auto">
                <strong className="font-bold">Error Connecting to API:</strong>
                <span className="block sm:inline"> {error}</span>
                <button onClick={refreshUnits} className="ml-4 underline font-medium">Retry</button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Inventory Units ({units.length})</h3>
                <button 
                    onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); refreshUnits(); }}
                    className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition duration-150 flex items-center"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0010.518 5m.05 8v5h.582m15.356 2A8.001 8.001 0 0110.518 19"></path></svg>
                    Refresh
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Desc</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lab Test</th> 
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {units.map((unit) => (
                            <UnitRow key={unit.id} unit={unit} />
                        ))}
                    </tbody>
                </table>
            </div>

            {units.length === 0 && !isLoading && (
                <div className="p-10 text-center text-gray-500">
                    No units found. Use the form to register your first bale.
                </div>
            )}
        </div>
    );
};


// --- Component: UnitForm ---
const UnitForm: React.FC = () => {
    const { addUnit } = useUnits();
    
    const initialFormData: Omit<UnitInput, 'current_owner' | 'parent_unit'> & { parent_unit: string } = {
        name: '',
        weight: 0,
        unit_type: 'HARVEST',
        status: 'ACTIVE', 
        lab_test_status: 'PENDING', 
        storage_location: '',
        description: '',
        parent_unit: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const val = name === 'weight' ? parseFloat(value) : value;

        setFormData(prev => ({ ...prev, [name]: val }));
        setMessage(''); 
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const apiData: UnitInput = {
            ...formData,
            weight: typeof formData.weight === 'string' ? parseFloat(formData.weight) : formData.weight,
            current_owner: DUMMY_ORG_ID, 
            parent_unit: formData.unit_type === 'HARVEST' ? null : (formData.parent_unit || null),
        };

        if (isNaN(apiData.weight) || apiData.weight <= 0) {
            setMessage('Error: Weight must be a positive number.');
            setIsSubmitting(false);
            return;
        }

        const newUnit = await addUnit(apiData);
        setIsSubmitting(false);

        if (newUnit) {
            setMessage(`Success! Unit ${newUnit.name} created.`);
            setFormData(initialFormData);
        }
    };

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Register Inventory Unit (Full Metadata)</h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name and Weight */}
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Unit Name (e.g., Bale Alpha)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
                <input type="number" name="weight" value={formData.weight || ''} onChange={handleChange} placeholder="Weight (kg)" step="0.1" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
                
                {/* Unit Type & Status Row */}
                <div className="flex gap-2">
                    <select name="unit_type" value={formData.unit_type} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white">
                        <option value="HARVEST">Harvest</option>
                        <option value="PROCESSED">Processed</option>
                        <option value="FINAL">Final</option>
                    </select>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white">
                        <option value="ACTIVE">Active</option>
                        <option value="IN_TRANSIT">In Transit</option>
                        <option value="ARCHIVED">Archived</option>
                        <option value="DISPOSED">Disposed</option>
                    </select>
                </div>

                {/* Lab Test Status */}
                <select name="lab_test_status" value={formData.lab_test_status} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 bg-white">
                    <option value="PENDING">Lab Test Pending</option>
                    <option value="PASS">Pass</option>
                    <option value="FAIL">Fail</option>
                </select>

                {/* Storage Location */}
                <input type="text" name="storage_location" value={formData.storage_location} onChange={handleChange} placeholder="Storage Location (e.g., Warehouse A, Row 5)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
                
                {/* Description */}
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description/Notes (e.g., Harvest Date, Strain)" rows={2} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>

                {/* Parent Unit ID (Conditional) */}
                {(formData.unit_type === 'PROCESSED' || formData.unit_type === 'FINAL') && (
                    <input type="text" name="parent_unit" value={formData.parent_unit} onChange={handleChange} placeholder="Parent Unit ID (UUID of the source)" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"/>
                )}
                
                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting} className="w-full p-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Registering...' : 'Register Unit'}
                </button>
            </form>

            {/* Success Message */}
            {message && (
                <p className="mt-4 text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-200">
                    {message}
                </p>
            )}
        </div>
    );
};


// --- Main App Component ---
const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
            <UnitProvider>
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">SOLV TrustLayer</h1>
                    <p className="mt-2 text-lg text-gray-600">Industrial Hemp Trace & Inventory Management</p>
                </header>

                <main className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    {/* Left Column: Unit Creation Form */}
                    <div className="lg:w-1/3">
                        <UnitForm />
                    </div>

                    {/* Right Column: Unit List/Dashboard */}
                    <div className="lg:w-2/3">
                        <UnitList />
                    </div>
                </main>
            </UnitProvider>
        </div>
    );
};

export default App;