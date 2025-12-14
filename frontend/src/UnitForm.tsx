import React, { useState, FormEvent } from 'react';
import { UnitInput, Unit, QualityGrade } from './api_contract';
import { useUnits } from './UnitContext';

const TEMP_OWNER_ID = '123-456-789';

export const UnitForm: React.FC = () => {
    const { addUnit } = useUnits();

    type FormDataType = Omit<UnitInput, 'current_owner' |
        'parent_unit'> & { parent_unit: string };

    const initialFormData: FormDataType = {
        cultivar_name: '',
        weight: 0,
        unit_type: 'HARVEST',
        date_harvested: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        lab_test_status: 'PENDING',
        storage_location: '',
        gps_coordinates: '',
        quality_grade: 'Pending',
        description: '',
        parent_unit: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement |
        HTMLSelectElement |
        HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        const val = name === 'weight' ? parseFloat(value) : value;

        setFormData(prev => ({ ...prev, [name]: val }));
        setMessage('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        const parentUnitValue =
            formData.unit_type === 'HARVEST' ?
                null : (formData.parent_unit || null);
        
            const apiData: UnitInput = {
                cultivar_name: formData.cultivar_name,
                weight: typeof formData.weight === 'string' ?
                    parseFloat(formData.weight) : formData.weight,
                unit_type: formData.unit_type as Unit['unit_type'],
                date_harvested: formData.date_harvested,
                status: formData.status as Unit['status'],
                lab_test_status: formData.lab_test_status as
                    Unit['lab_test_status'],
                storage_location: formData.storage_location,
                gps_coordinates: formData.gps_coordinates,
                quality_grade: formData.quality_grade as QualityGrade,
                description: formData.description,
                current_owner: TEMP_OWNER_ID,
                parent_unit: parentUnitValue,
            };

            if (isNaN(apiData.weight) || apiData.weight <= 0) {
                setMessage('Error: Weight must be a positive number.');
                setIsSubmitting(false);
                return;
            }

            try {
                await addUnit(apiData);
                setMessage(`Success! Unit ${apiData.cultivar_name} created.`);
                setFormData(initialFormData);
            } catch (error) {
                setMessage('Error: Failed to register unit.');
            } finally {
                setIsSubmitting(false);
            }
    };

    const requiresParentUnit =
    formData.unit_type === 'PROCESSED' ||
    formData.unit_type === 'FINAL';

    return (
        <div className="p-6 bg-white border border-gray-200 
            rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Register Inventory Unit
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Cultivar Name and Weight */}
                <input type="text" name="name" 
                    value={formData.cultivar_name} onChange={handleChange} 
                    placeholder="Unit Name (e.g., Bale Alpha)" 
                    required 
                    className="w-full p-3 border border-gray-300 
                        rounded-lg focus:ring-indigo-500 
                        focus:border-indigo-500 transition"/>
                
                <input type="number" name="weight" 
                    value={formData.weight || ''} 
                    onChange={handleChange} 
                    placeholder="Weight (kg)" step="0.1" 
                    required 
                    className="w-full p-3 border border-gray-300 
                        rounded-lg focus:ring-indigo-500 
                        focus:border-indigo-500 transition"/>
                
                {/* Unit Type & Grade */}
                <div className="flex gap-2">
                    <select name="unit_type" 
                        value={formData.unit_type} 
                        onChange={handleChange} 
                        className="w-1/2 p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 
                            bg-white">
                        <option value="HARVEST">Harvest</option>
                        <option value="PROCESSED">Processed</option>
                        <option value="FINAL">Final</option>
                    </select>
                    <select name="quality_grade" 
                        value={formData.quality_grade} 
                        onChange={handleChange} 
                        className="w-1/2 p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 
                            bg-white transition">
                        <option value="Pending">Grade Pending</option>
                        <option value="A">Grade A</option>
                        <option value="B">Grade B</option>
                        <option value="C">Grade C</option>
                    </select>
                </div>   

                {/* Date Harvested and GPS */}
                <div className="flex gap-2">
                    <input type="date" name="date_harvested" 
                        value={formData.date_harvested} 
                        onChange={handleChange} 
                        required 
                        className="w-1/2 p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 transition"/>
                    <input type="text" name="gps_coordinates" 
                        value={formData.gps_coordinates} 
                        onChange={handleChange} 
                        placeholder="GPS (e.g., 34.0522,-118.2437)"
                        required 
                        className="w-1/2 p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 transition"/>
                </div>

                {/* Status, Lab Test Status, and Storage Location */}
                <div className="flex gap-2">
                    <select name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="w-1/2 p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 
                            bg-white">
                        <option value="ACTIVE">Active</option>
                        <option value="TRANSIT">In Transit</option>
                        <option value="ARCHIVED">Archived</option>
                        <option value="DISPOSED">Disposed</option>
                    </select>

                    <select name="lab_test_status" 
                        value={formData.lab_test_status} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500 
                            bg-white">
                        <option value="PENDING">Lab Test Pending</option>
                        <option value="PASS">Pass</option>
                        <option value="FAIL">Fail</option>
                    </select>

                    <input type="text" name="storage_location" 
                        value={formData.storage_location} 
                        onChange={handleChange} 
                        placeholder="Storage Location" 
                        required 
                        className="w-full p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500"/>
                </div>

                {/* Description */}
                <textarea name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Notes..." 
                    rows={2} 
                    className="w-full p-3 border border-gray-300 
                        rounded-lg focus:ring-indigo-500"/>

                {requiresParentUnit && (
                    <input type="text" name="parent_unit" 
                        value={formData.parent_unit} 
                        onChange={handleChange} 
                        placeholder="Parent Unit ID" 
                        required 
                        className="w-full p-3 border border-gray-300 
                            rounded-lg focus:ring-indigo-500"/>
                )}
                
                {/* Submit Button */}
                <button type="submit" disabled={isSubmitting} 
                    className="w-full p-3 bg-indigo-600 text-white 
                        font-semibold rounded-lg shadow-md 
                        hover:bg-indigo-700 disabled:opacity-50">
                    {isSubmitting ? 'Registering...' : 'Register Unit'}
                </button>
            </form>

            {message && (
                <p className={`mt-4 text-sm font-medium p-3 
                    rounded-lg border ${message.includes('Error') ? 
                    'text-red-600 bg-red-50 border-red-200' : 
                    'text-green-600 bg-green-50 border-green-200'}`}>
                    {message}
                </p>
            )}
        </div>
    );

}