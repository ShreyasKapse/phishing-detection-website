import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Shield, Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    }

    const isActive = (path) => {
        return location.pathname === path ? "text-indigo-600 font-semibold" : "text-gray-500 hover:text-gray-900";
    }

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Email Analyzer', path: '/email' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center group">
                        <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
                            <Shield className="h-5 w-5 text-white" />
                        </div>
                        <span className="ml-3 text-xl font-bold text-gray-900 tracking-tight">PhishGuard<span className="text-indigo-600">AI</span></span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {currentUser && (
                            <Link to="/dashboard" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                                Dashboard
                            </Link>
                        )}
                        <Link to="/analyzer" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
                            Analyzer
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {currentUser ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">Hi, {currentUser.displayName?.split(' ')[0] || 'User'}</span>
                                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <span className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors cursor-pointer">Login</span>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 shadow-lg shadow-indigo-200">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 absolute w-full top-20 left-0 shadow-xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/analyzer"
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                            URL Analyzer
                        </Link>
                        {currentUser && (
                            <Link
                                to="/dashboard"
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="pt-4 mt-4 border-t border-gray-100">
                            {currentUser ? (
                                <div className="space-y-3 px-3">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{currentUser.displayName || 'User'}</div>
                                            <div className="text-xs text-gray-500">{currentUser.email}</div>
                                        </div>
                                    </div>
                                    <Button onClick={handleLogout} variant="outline" className="w-full justify-center">
                                        Log Out
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 px-3">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full bg-indigo-600">Sign Up</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
