import React, { useState, useEffect } from 'react';
import { UnitForm } from 'UnitForm';
import { UnitList } from 'UnitList';
import { UnitProvider } from 'UnitContext';
import LoginPage from 'LoginPage';
import { getAuthToken, logout } from 'client_service';

/**
 * The dashboard layout component.
 * @module DashboardLayout The module for the dashboard layout component.
 * @property {React.FC} DashboardLayout - The dashboard layout component.
 * @param param0 - The props for the component.
 * @returns {React.ReactElement} The rendered dashboard layout.
 */
const DashboardLayout: React.FC<{ onLogout: () => void }> = ({
    onLogout
}) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 
                    lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold 
                        text-indigo-600 tracking-wider">
                        Agri Inventory Tracker
                    </h1>
                    <button
                        onClick={onLogout}
                        className="text-sm font-medium text-red-600 
                            hover:text-red-700 py-2 px-3 rounded-lg 
                            border border-red-200 hover:bg-red-50 
                            transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Unit Form Column (1/3 width) */}
                    <div className="lg:col-span-1">
                        <UnitForm />
                    </div>

                    {/* Unit List Column (2/3 width) */}
                    <div className="lg:col-span-2">
                        <UnitList />
                    </div>
                </div>
            </main>
        </div>
    )
};

/**
 * The main application component.
 * @module App The module for the main application component.
 * @property {React.FC} App - The main application component.
 * @returns {React.ReactElement} The rendered main application.
 * @param param0 - The props for the component.
 */
const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        logout();
        setIsAuthenticated(false);
    };

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <UnitProvider>
            <DashboardLayout onLogout={handleLogout} />;
        </UnitProvider>
    );
};

export default App;