import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_CONFIG } from '../config/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Save the token
            API_CONFIG.setToken(token);

            // 2. Redirect to the main user dashboard
            // We use replace to remove this callback page from browser history
            navigate('/user/dashboard', { replace: true });
        } else {
            // 3. Handle a failed login
            setError('Google authentication failed. No token provided.');
            // Optionally, redirect back to login
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 3000);
        }
    }, [searchParams, navigate]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="text-center p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Login Failed</h2>
                    <p className="text-gray-700">{error}</p>
                    <p className="text-gray-500 mt-2">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
                <FontAwesomeIcon icon={faSpinner} spin className="text-blue-600 text-5xl mb-4" />
                <p className="text-gray-600 text-lg">Authenticating, please wait...</p>
            </div>
        </div>
    );
};

export default GoogleAuthCallback;