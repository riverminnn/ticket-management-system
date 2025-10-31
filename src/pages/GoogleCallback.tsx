import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * This page handles the OAuth callback from Google.
 * Google redirects to backend, backend returns JSON with redirect URL.
 * We need to extract the token and redirect to GoogleAuthSuccess.
 */
export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'processing' | 'error'>('processing');
    const [message, setMessage] = useState('Processing Google login...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get the authorization code from URL
                const code = searchParams.get('code');
                
                if (!code) {
                    throw new Error('No authorization code received from Google');
                }

                console.log('🔄 Received auth code, exchanging with backend...');

                // Call backend to exchange code for token
                const response = await fetch(`http://localhost:5105/auth/google-callback?code=${code}`);
                
                if (!response.ok) {
                    throw new Error(`Backend returned error: ${response.status}`);
                }

                const result = await response.json();
                console.log('📦 Backend response:', result);

                if (result.success && result.data) {
                    // Extract redirect URL from response
                    const redirectUrl = result.data;
                    console.log('🎯 Redirect URL:', redirectUrl);
                    
                    // Parse the URL to get the token
                    const url = new URL(redirectUrl);
                    const token = url.searchParams.get('token');
                    
                    if (token) {
                        console.log('✅ Token extracted, redirecting...');
                        // Redirect to GoogleAuthSuccess with the token
                        navigate(`/google-auth-success?token=${token}`);
                    } else {
                        throw new Error('No token in redirect URL');
                    }
                } else {
                    throw new Error(result.error || 'Failed to authenticate');
                }
            } catch (error) {
                console.error('❌ Callback error:', error);
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'Authentication failed');
                
                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        handleCallback();
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
                        status === 'error' ? 'text-red-600' : 'text-gray-800'
                    }`}>
                        {status === 'processing' && 'Completing Login'}
                        {status === 'error' && 'Authentication Failed'}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">{message}</p>

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
