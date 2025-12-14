/**
 * The login page component.
 * @module login_page The module for the login page component.
 */
import React, { useState } from 'react';
import { loginUser, setAuthToken } from './client_service';

/**
 * The login page component.
 * @param {object} props - The component props.
 */
interface LoginPageProps {
    onLoginSuccess: () => void;
}

/**
 * The login page component.
 * @param {object} props - The component props.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await loginUser(username, password);
            setAuthToken(data.access);
            onLoginSuccess();
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // CSS CENTERING MAGIC: flex, items-center, justify-center
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-indigo-700">SOLV TrustLayer</h1>
                    <p className="text-gray-500 mt-2">Sign in to access your inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your username"
                            required 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••"
                            required 
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-400">
                    Protected by SOLV Security Standards
                </div>
            </div>
        </div>
    );

};

export default LoginPage;