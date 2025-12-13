import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Shield, Eye, Heart, Linkedin, Twitter, Github } from 'lucide-react';

export default function AboutUs() {
    const team = [
        {
            name: "David Chen",
            role: "Lead Security Architect",
            bio: "Specializes in threat modeling and cryptographic protocols. Previously led security teams at major fintech firms.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
            social: ["linkedin", "twitter"]
        },
        {
            name: "Sarah Jenkins",
            role: "Senior AI Engineer",
            bio: "Expert in Natural Language Processing and heuristic analysis. Sarah trains our models to detect subtleties.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            social: ["linkedin", "github"]
        },
        {
            name: "Marcus Johnson",
            role: "Lead Full-Stack Developer",
            bio: "Ensures the PhishGuard platform is robust, scalable, and responsive. Marcus bridges the gap between os...",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
            social: ["linkedin", "github"]
        },
        {
            name: "Emily Rodriguez",
            role: "UI/UX Designer",
            bio: "Advocate for user-centric security. Emily designs intuitive interfaces that make advanced protection accessible.",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
            social: ["linkedin", "twitter"]
        }
    ];

    return (
        <div className="bg-white">
            {/* Hero / Mission */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-indigo-50/50 to-white -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Securing the <span className="text-indigo-600">Digital Future</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        PhishGuard AI was born from a simple belief: safety on the internet should be a fundamental right, not a luxury. We combine state-of-the-art artificial intelligence with human-centric design to detect threats before they strike, ensuring your digital life remains uninterrupted and secure.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Uncompromising Security</h3>
                            <p className="text-gray-500 text-sm">Proactive threat detection that evolves faster than attackers.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Eye className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Radical Transparency</h3>
                            <p className="text-gray-500 text-sm">Open source core modules and clear data handling policies.</p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AI for Good</h3>
                            <p className="text-gray-500 text-sm">Leveraging machine learning to protect communities, not exploit them.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Guide */}
            <section className="py-20 bg-gradient-to-r from-gray-50 to-indigo-50/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Mentorship</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Our Strategic Guide</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden md:flex">
                        <div className="md:w-1/3 bg-indigo-100 relative min-h-[300px] md:min-h-0">
                            {/* Avatar Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center p-8">
                                <div className="w-48 h-48 bg-indigo-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <span className="text-6xl">👨‍🏫</span>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">Dr. Alistair Sterling</h3>
                            <p className="text-indigo-600 font-medium mb-6">Founder & Chief Scientific Advisor</p>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                With over 20 years of experience in cybersecurity and behavioral analysis, Dr. Sterling guides PhishGuard AI's mission with unwavering ethical standards. His mentorship ensures that our team not only develops cutting-edge technology but also understands the human impact of every line of code we write.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Ethical AI</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Cyber Defense</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">Mentorship</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Our Creators</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Meet the Team</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">The brilliant minds behind the algorithms. Our diverse team of developers and security analysts is dedicated to staying one step ahead.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all text-center">
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-2 border-indigo-100">
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                                <p className="text-indigo-600 text-xs font-bold uppercase mb-4">{member.role}</p>
                                <p className="text-gray-500 text-xs leading-relaxed mb-6">
                                    {member.bio}
                                </p>
                                <div className="flex justify-center gap-3">
                                    {member.social.includes('linkedin') && <Linkedin className="w-4 h-4 text-gray-400 hover:text-indigo-600 cursor-pointer" />}
                                    {member.social.includes('twitter') && <Twitter className="w-4 h-4 text-gray-400 hover:text-blue-400 cursor-pointer" />}
                                    {member.social.includes('github') && <Github className="w-4 h-4 text-gray-400 hover:text-gray-900 cursor-pointer" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hiring CTA */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Want to join our mission?</h2>
                    <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                        We are always looking for talented individuals passionate about cybersecurity and AI. Check out our open roles.
                    </p>
                    <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full">
                        View Open Positions
                    </Button>
                </div>
            </section>
        </div>
    );
}
