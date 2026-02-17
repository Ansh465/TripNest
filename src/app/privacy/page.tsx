import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
    return (
        <div className="relative flex flex-col min-h-screen bg-neutral-950 text-neutral-200 pt-32">
            <main className="flex-1 container max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-neutral-400 mb-8">Effective date: February 17, 2026</p>

                <div className="space-y-8 text-lg leading-relaxed text-neutral-300">
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">1. Who We Are</h3>
                        <p>
                            <strong className="text-white">TripNest</strong> (“we”, “us”, “our”) is a travel‑itinerary web application operated by <strong>[YOUR LEGAL ENTITY]</strong>. This Privacy Policy explains how we collect, use, share, and protect personal information you provide to us.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h3>
                        <div className="overflow-x-auto rounded-lg border border-neutral-800">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-neutral-900 text-white">
                                    <tr>
                                        <th className="p-4 border-b border-neutral-800">Category</th>
                                        <th className="p-4 border-b border-neutral-800">Examples</th>
                                        <th className="p-4 border-b border-neutral-800">Legal Basis (GDPR)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-neutral-950">
                                    <tr>
                                        <td className="p-4 border-b border-neutral-800 font-semibold text-neutral-200">Account Information</td>
                                        <td className="p-4 border-b border-neutral-800">Email address, name, profile photo</td>
                                        <td className="p-4 border-b border-neutral-800">Consent or Legitimate interest</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-neutral-800 font-semibold text-neutral-200">User‑Generated Content</td>
                                        <td className="p-4 border-b border-neutral-800">Itineraries, comments, ratings, photos</td>
                                        <td className="p-4 border-b border-neutral-800">Consent</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 border-b border-neutral-800 font-semibold text-neutral-200">Device & Usage Data</td>
                                        <td className="p-4 border-b border-neutral-800">IP address, browser type, timestamps</td>
                                        <td className="p-4 border-b border-neutral-800">Legitimate interest</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h3>
                        <ul className="list-decimal pl-6 space-y-2 marker:text-neutral-500">
                            <li><strong>Provide & Maintain the Service</strong> – authenticating users, storing itineraries, enabling sharing.</li>
                            <li><strong>Improve & Personalize</strong> – analytics and UI/UX enhancements.</li>
                            <li><strong>Communications</strong> – transactional emails (password reset, etc.).</li>
                            <li><strong>Legal & Safety</strong> – enforce our Terms, prevent fraud.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">4. Data Sharing & Recipients</h3>
                        <ul className="list-disc pl-6 space-y-2 marker:text-neutral-500">
                            <li><strong>Supabase</strong> – Data storage & realtime sync.</li>
                            <li><strong>Service Providers</strong> – Hosting (Vercel), Analytics.</li>
                            <li><strong>Law‑enforcement</strong> – If required by law.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">5. Contact Information</h3>
                        <p>If you have any questions about our privacy practices, feel free to reach out:</p>
                        <div className="mt-4 p-6 bg-neutral-900/50 rounded-xl border border-neutral-800">
                            <p className="text-neutral-200"><strong>Email:</strong> [YOUR SUPPORT EMAIL]</p>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
