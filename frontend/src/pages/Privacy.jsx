import React from 'react';

export default function Privacy() {
    return (
        <div className="py-24 bg-white min-h-screen font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
                <div className="prose prose-indigo prose-lg text-gray-600">
                    <p>Last updated: January 14, 2026</p>

                    <h3>1. Introduction</h3>
                    <p>
                        PhishGuard ("we", "us", or "our") respects your privacy and is committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h3>2. Data We Collect</h3>
                    <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
                    <ul>
                        <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services (specifically URLS scanned).</li>
                    </ul>

                    <h3>3. How We Use Your Data</h3>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul>
                        <li>To provide the phishing detection analysis service you requested.</li>
                        <li>To improve our machine learning models (anonymized data only).</li>
                        <li>To manage your account and subscription.</li>
                    </ul>

                    <h3>4. Data Security</h3>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@phishguard.ai.
                    </p>
                </div>
            </div>
        </div>
    );
}
