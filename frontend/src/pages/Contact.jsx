import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';

export default function Contact() {
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast({
            title: "Message Sent",
            description: "We've received your inquiry and will get back to you shortly.",
        });
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="py-24 bg-gray-50 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Get in Touch</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Have questions about our enterprise plans, API, or found a bug? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Contact Info */}
                    <div className="p-12 bg-indigo-900 text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <Mail className="w-6 h-6 text-indigo-300 mt-1" />
                                    <div>
                                        <p className="font-semibold">Email</p>
                                        <p className="text-indigo-200">support@phishguard.ai</p>
                                        <p className="text-indigo-200">sales@phishguard.ai</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="w-6 h-6 text-indigo-300 mt-1" />
                                    <div>
                                        <p className="font-semibold">Phone</p>
                                        <p className="text-indigo-200">+1 (555) 123-4567</p>
                                        <p className="text-indigo-200">Mon-Fri 9am-6pm EST</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <MapPin className="w-6 h-6 text-indigo-300 mt-1" />
                                    <div>
                                        <p className="font-semibold">Office</p>
                                        <p className="text-indigo-200">123 Security Blvd, Suite 400</p>
                                        <p className="text-indigo-200">San Francisco, CA 94107</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer">
                                    <span className="font-bold">tw</span>
                                </div>
                                <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer">
                                    <span className="font-bold">li</span>
                                </div>
                                <div className="w-10 h-10 bg-indigo-800 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors cursor-pointer">
                                    <span className="font-bold">gh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <Input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-base">
                                <Send className="w-4 h-4 mr-2" /> Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
