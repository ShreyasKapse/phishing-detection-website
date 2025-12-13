import React from 'react';
import Navbar from './Navbar';
import { Toaster } from './ui/toaster';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 font-sans antialiased text-gray-900">
            <Navbar />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Toaster />
        </div>
    );
}
