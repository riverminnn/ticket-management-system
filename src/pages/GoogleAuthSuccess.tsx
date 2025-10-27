import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleAuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processing your login...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                // Save token to localStorage
                localStorage.setItem('authToken', token);
                
                setStatus('success');
                setMessage('Login successful! Redirecting...');

                // Redirect to dashboard after 1.5 seconds
                setTimeout(() => {
                    navigate('/user/dashboard');
                }, 1500);
            } catch (error) {
                console.error('Error saving token:', error);
                setStatus('error');
                setMessage('Failed to save authentication token. Please try again.');
            }
        } else {
            setStatus('error');
            setMessage('No authentication token received. Please try logging in again.');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        {status === 'processing' && (
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        )}
                        {status === 'success' && (
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    <h2 className={`text-2xl font-bold mb-2 ${
                        status === 'success' ? 'text-green-600' :
                        status === 'error' ? 'text-red-600' :
                        'text-gray-800'
                    }`}>
                        {status === 'processing' && 'Processing Login'}
                        {status === 'success' && 'Success!'}
                        {status === 'error' && 'Authentication Failed'}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">{message}</p>

                    {/* Manual redirect button for error case */}
                    {status === 'error' && (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                        >
                            Back to Login
                        </button>
                    )}

                    {/* Loading dots animation */}
                    {status === 'processing' && (
                        <div className="flex justify-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
