import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { API_CONFIG } from '../config/api';

const GoogleIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_CONFIG.baseUrl}/auth/google-login`, {
                method: 'GET',
                headers: {
                    'Accept': 'text/plain'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get Google login URL');
            }

            // --- THIS IS THE FIX ---
            // 2. Read the response as a plain string
            const googleAuthUrl = await response.text();

            // 3. Check if it looks like the URL Google sent
            if (googleAuthUrl && googleAuthUrl.startsWith("https://accounts.google.com")) {
                // 4. Redirect the user's browser to that URL
                window.location.href = googleAuthUrl;
            } else {
                throw new Error('Invalid response from server. Expected a Google URL.');
            }
            // --- END OF FIX ---

        } catch (err: any) {
            console.error('Google login error:', err);
            setError(err.message || 'An unknown error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome!</h1>
                <p className="text-gray-600 mb-8">Sign in to your account</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                >
                    {loading ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="w-6 h-6" />
                    ) : (
                        <GoogleIcon />
                    )}
                    <span>Sign in with Google</span>
                </button>
            </div>
        </div>
    );
}