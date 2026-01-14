import React from 'react';

export default function Terms() {
    return (
        <div className="py-24 bg-white min-h-screen font-sans">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
                <div className="prose prose-indigo prose-lg text-gray-600">
                    <p>Last updated: January 14, 2026</p>

                    <h3>1. Agreement to Terms</h3>
                    <p>
                        By accessing our website and using our services, you agree to be bound by these Terms of Service.
                        If you do not agree to be bound by these Terms, you may not use the Service.
                    </p>

                    <h3>2. Description of Service</h3>
                    <p>
                        PhishGuard provides AI-powered phishing detection services related to URLs and Emails.
                        You understand and agree that the Service is provided on an AS IS and AS AVAILABLE basis.
                        PhishGuard disclaims all responsibility and liability for the availability, timeliness, security or reliability of the Service.
                    </p>

                    <h3>3. Acceptable Use</h3>
                    <p>
                        You agree not to misuse the PhishGuard services. For example, you must not:
                    </p>
                    <ul>
                        <li>Use the service to test the security of systems you do not own or have permission to test.</li>
                        <li>Reverse engineer the API or Machine Learning models.</li>
                        <li>Send automated requests exceeding the rate limits of your plan.</li>
                    </ul>

                    <h3>4. Limitation of Liability</h3>
                    <p>
                        In no event shall PhishGuard, nor its directors, employees, partners, agents, suppliers, or affiliates,
                        be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation,
                        loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h3>5. Changes</h3>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                        By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </div>
            </div>
        </div>
    );
}
