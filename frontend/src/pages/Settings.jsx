import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { User, Lock, Mail, Save, Bell, Shield, LogOut } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { currentUser, updateUserProfile, updateUserPassword, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [formData, setFormData] = useState({
        displayName: currentUser?.displayName || '',
        email: currentUser?.email || '',
        photoURL: currentUser?.photoURL || ''
    });

    // Password State
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateUserProfile(formData);
            toast({ title: "Profile Updated", description: "Your profile details have been saved." });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword) {
            return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
        }
        setLoading(true);
        try {
            await updateUserPassword(passwords.password);
            toast({ title: "Password Updated", description: "Your password has been changed successfully." });
            setPasswords({ password: '', confirmPassword: '' });
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            toast({ title: "Error", description: "Failed to log out", variant: "destructive" });
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-center py-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500">Manage your profile, security, and preferences.</p>
                </div>
                <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Navigation (Mock) */}
                <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2 bg-indigo-50 text-indigo-700 font-bold">
                        <User className="w-4 h-4" /> Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900">
                        <Lock className="w-4 h-4" /> Security
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900">
                        <Bell className="w-4 h-4" /> Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:text-gray-900">
                        <Shield className="w-4 h-4" /> Privacy
                    </Button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Public Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Public Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="displayName">Display Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="displayName"
                                            className="pl-9"
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            className="pl-9 bg-gray-50"
                                            value={formData.email}
                                            disabled // Email change is complex with Firebase, disabling for now
                                            title="Email change not supported in this demo"
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" disabled={loading}>
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Security */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Update your password to keep your account safe.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.password}
                                        onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="submit" variant="outline" disabled={loading || !passwords.password}>
                                        Update Password
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
