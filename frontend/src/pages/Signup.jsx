import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { Shield, Lock, Mail, Loader2, User } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const { signup, loginWithGoogle } = useAuth(); // Assuming signup takes email, password
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await signup(email, password, fullName);
            toast({
                title: "Account Created",
                description: "Welcome to PhishGuard! Please log in.",
            });
            navigate('/login');
        } catch (err) {
            let message = "Failed to create an account.";
            if (err.code === 'auth/email-already-in-use') {
                message = "You are already registered. Please login.";
            } else if (err.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            } else if (err.code === 'auth/invalid-email') {
                message = "Invalid email address.";
            } else {
                message = err.message;
            }

            setError(message);
            toast({
                variant: "destructive",
                title: "Signup Failed",
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
                description: "Signed in with Google!",
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to sign in with Google: ' + err.message);
            toast({
                variant: "destructive",
                title: "Google Sign In Failed",
                description: err.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Side - Branding/Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-indigo-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-purple-800 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-900 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-2 mb-20">
                        <Shield className="h-8 w-8 text-indigo-400" />
                        <span className="text-2xl font-bold">PhishGuardAI</span>
                    </Link>

                    <h2 className="text-4xl font-bold font-display mb-6 leading-tight">
                        Join the Defense Network.
                    </h2>
                    <p className="text-indigo-200 text-lg max-w-md">
                        Create your account today to get real-time URL analysis, browser extensions, and developer API keys.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="bg-indigo-800/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-700/50">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="h-6 w-6 text-green-400" />
                            <span className="font-semibold">Security Report</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-indigo-200">Threats Blocked</span>
                                <span className="font-mono font-bold">2,405</span>
                            </div>
                            <div className="w-full bg-indigo-900/50 rounded-full h-2">
                                <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Start your 14-day free trial. No credit card required.
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
                                Sign up with Google
                            </Button>
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>

                            <div>
                                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="fullName"
                                        type="text"
                                        required
                                        className="pl-10 h-11"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                            </div>

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
                                        placeholder="you@company.com"
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
                                        placeholder="Must be at least 8 characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                                        I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-base" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Create Account
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
