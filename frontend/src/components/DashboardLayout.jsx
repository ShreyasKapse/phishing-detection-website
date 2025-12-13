import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    Shield,
    LogOut,
    Bell,
    HelpCircle,
    Search,
    Menu,
    X,
    User,
    Mail,
    Home
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Toaster } from './ui/toaster';

export default function DashboardLayout({ children }) {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'URL Analysis', path: '/analyzer', icon: Shield },
        { name: 'Email Analysis', path: '/email', icon: Mail },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row font-sans">

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="font-bold text-xl text-gray-900">PhishGuard<span className="text-indigo-600">AI</span></span>
                    </Link>
                    <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive(item.path)
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-indigo-600' : 'text-gray-400'}`} />
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            {/* Placeholder Avatar */}
                            <span className="font-bold text-gray-500 text-sm">
                                {currentUser?.displayName ? currentUser.displayName[0] : 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{currentUser?.displayName || 'User'}</p>
                            <p className="text-xs text-gray-400 truncate">Premium Plan</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-600">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-30 border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 -ml-2 text-gray-600" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 hidden sm:block">
                            {navItems.find(i => isActive(i.path))?.name || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search logs..."
                                className="pl-10 h-10 bg-gray-50 border-transparent focus:bg-white hover:bg-white transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <HelpCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

            <Toaster />
        </div>
    );
}
