import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loginWithGoogle, resetPassword, currentUser } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetOpen, setResetOpen] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (currentUser) {
            navigate('/dashboard');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            toast({
                title: "Success",
                title: "Success",
                description: "Logged in successfully!",
            });
            // Navigation handled by useEffect
        } catch (err) {
            let message = "Failed to log in.";
            if (err.code === 'auth/invalid-credential') {
                message = "Invalid email or password.";
            } else if (err.code === 'auth/user-not-found') {
                message = "No account found with this email.";
            } else if (err.code === 'auth/wrong-password') {
                message = "Incorrect password.";
            } else if (err.code === 'auth/too-many-requests') {
                message = "Too many failed attempts. Please try again later.";
            }

            setError(message);
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: message,
            });
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await loginWithGoogle();
            toast({
                title: "Success",
                title: "Success",
                description: "Logged in with Google!",
            });
            // Navigation handled by useEffect
        } catch (err) {
            setError('Failed to log in with Google.');
            toast({
                variant: "destructive",
                title: "Google Login Failed",
                description: "Could not sign in with Google. Please try again.",
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-purple-900 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-20">
                        <Shield className="h-8 w-8 text-indigo-400" />
                        <span className="text-2xl font-bold">PhishGuardAI</span>
                    </Link>

                    <h2 className="text-4xl font-bold font-display mb-6 leading-tight">
                        Secure your digital world with AI-powered precision.
                    </h2>
                    <p className="text-indigo-200 text-lg max-w-md">
                        Join thousands of security professionals who rely on PhishGuard for real-time threat detection.
                    </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-sm text-indigo-200">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-900 bg-indigo-700"></div>
                        ))}
                    </div>
                    <span>Trusted by 50,000+ users</span>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left mb-10">
                        {/* Mobile Back Button */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <Link to="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium">
                                <span className="text-sm">← Back to Home</span>
                            </Link>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <div className="mt-8">
                        {/* Google Login Button */}
                        <div className="mb-6">
                            <Button
                                variant="outline"
                                className="w-full h-12 text-base font-medium flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M12.0003 20.4002C16.8003 20.4002 20.8003 16.6002 20.8003 12.0002C20.8003 11.4002 20.7003 10.9002 20.6003 10.4002H12.0003V13.8002H17.2003C16.9003 15.3002 15.7003 16.4002 14.1003 16.9002L14.0883 16.9692L16.6853 18.9692L16.7603 19.0402C18.3003 17.6002 19.2003 15.5002 19.2003 12.8002C19.2003 12.7002 19.1003 12.6002 19.1003 12.4002H12.0003V20.4002Z" fill="#4285F4" />
                                    <path d="M12.0002 23.9998C14.3002 23.9998 16.3002 23.2998 17.9002 21.9998L15.3002 19.9998C14.6002 20.4998 13.6002 20.8998 12.4002 20.8998C9.50023 20.8998 6.90023 18.9998 5.80023 16.2998L5.72823 16.3058L3.10723 18.3308L3.08023 18.4008C4.70023 21.6998 8.00023 23.9998 12.0002 23.9998Z" fill="#34A853" />
                                    <path d="M5.80016 16.2998C5.20016 14.7998 5.20016 13.1998 5.80016 11.6998L5.79416 11.6248L3.13616 9.56082L3.08016 9.59982C1.90016 11.8998 1.90016 14.5998 3.08016 16.8998L5.80016 16.2998Z" fill="#FBBC05" />
                                    <path d="M12.0002 6.89982C13.8002 6.89982 15.4002 7.59982 16.5002 8.59982L19.0002 6.09982C17.1002 4.29982 14.7002 3.29982 12.0002 3.29982C8.00023 3.29982 4.70023 5.59982 3.08023 8.89982L5.80023 11.3998C6.90023 8.79982 9.40023 6.89982 12.0002 6.89982Z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        className="pl-10 h-11"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className="pl-10 h-11"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={() => setResetOpen(true)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Forgot your password?
                                    </button>
                                </div>
                            </div>

                            {/* Reset Password Modal/Dialog (Simple inline conditional for now or proper dialog) */}
                            {resetOpen && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                                        <h3 className="text-lg font-bold mb-4">Reset Password</h3>
                                        <p className="text-sm text-gray-600 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
                                        <div className="mb-4">
                                            <Label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">Email address</Label>
                                            <Input
                                                id="reset-email"
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) => setResetEmail(e.target.value)}
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setResetOpen(false)}>Cancel</Button>
                                            <Button type="button" onClick={async () => {
                                                try {
                                                    await resetPassword(resetEmail);
                                                    toast({ title: "Email Sent", description: "Check your inbox for password reset instructions." });
                                                    setResetOpen(false);
                                                } catch (err) {
                                                    toast({ variant: "destructive", title: "Error", description: "Failed to send reset email. " + err.message });
                                                }
                                            }}>Send Link</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-base" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Sign in
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
