import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
    return (
        <div className="relative flex flex-col min-h-screen bg-neutral-950 text-neutral-200 pt-32">
            <main className="flex-1 container max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                <p className="text-neutral-400 mb-8">Effective date: February 17, 2026</p>

                <div className="space-y-8 text-lg leading-relaxed text-neutral-300">
                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">1. Introduction & Acceptance</h3>
                        <p className="mb-4">
                            1.1. <strong className="text-white">TripNest</strong> (the “Site”, “Service”, “we”, “us”, “our”) is operated by <strong>[YOUR LEGAL ENTITY]</strong> (the “Company”).
                        </p>
                        <p>
                            1.2. By accessing or using the Site (including any mobile‑friendly web pages, APIs, or related services), you (“User”, “you”, “your”) agree to be bound by these Terms of Service (the “Terms”). If you do <strong>not</strong> agree, you must <strong>not</strong> use the Site.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">2. Eligibility</h3>
                        <p className="mb-4">
                            2.1. You must be at least <strong>13 years old</strong> (or the age of digital consent in your jurisdiction, whichever is higher) to create an account.
                        </p>
                        <p>
                            2.2. By creating an account you represent and warrant that all information you provide is true, accurate, and not misleading.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">3. Account Registration & Security</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>3.1. You may register using an email/password or via supported third‑party providers (Google, GitHub, etc.).</li>
                            <li>3.2. You are responsible for all activity that occurs under your account. Keep your password and any OAuth tokens confidential.</li>
                            <li>3.3. If you suspect unauthorized access, notify us immediately at <strong>[YOUR SUPPORT EMAIL]</strong> and change your credentials.</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">4. User‑Generated Content (UGC)</h3>
                        <p className="mb-4">
                            4.1. You may create, edit, and share <strong>itineraries</strong>, <strong>reviews</strong>, <strong>comments</strong>, <strong>photos</strong>, and any other content (collectively “User Content”).
                        </p>
                        <p className="mb-4">
                            4.2. You retain all copyrights in your User Content, but you grant us a <strong>world‑wide, royalty‑free, non‑exclusive, irrevocable, sublicensable license</strong> to:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>display, reproduce, distribute, modify, create derivative works, and publicly perform the content as necessary to provide the Service; and</li>
                            <li>share the content with third‑party partners (e.g., affiliate booking sites) solely for the purpose of facilitating travel bookings.</li>
                        </ul>
                        <p>
                            4.3. You represent that your User Content does not infringe any third‑party rights and complies with all applicable laws.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h3>
                        <p className="mb-4">You may <strong>not</strong>:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>Post illegal, defamatory, hateful, pornographic, or violent material.</li>
                            <li>Spam, harass, or impersonate any person or entity.</li>
                            <li>Attempt to hack, reverse‑engineer, or interfere with the Site’s security or functionality.</li>
                            <li>Upload viruses, malware, or any malicious code.</li>
                            <li>Use the Service for any commercial purpose not expressly authorized (e.g., reselling our APIs).</li>
                        </ul>
                        <p>Violations may result in immediate suspension or termination of your account, at our sole discretion.</p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h3>
                        <p className="mb-4">
                            6.1. All non‑User‑Content material (including the Site’s design, code, logos, trademarks, and graphics) is owned by or licensed to the Company and is protected by copyright, trademark, and other laws.
                        </p>
                        <p>
                            6.2. No license, express or implied, is granted to you other than the limited right to use the Service in accordance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-2xl font-bold text-white mb-4">7. Disclaimer & Limitation of Liability</h3>
                        <p className="mb-4">
                            9.1. The Service is provided “**as is**” and “**as available**” without warranties of any kind, either expressed or implied.
                        </p>
                        <p className="mb-4">
                            9.2. We do <strong>not</strong> guarantee the accuracy, completeness, or timeliness of any travel information.
                        </p>
                        <p>
                            9.4. Our total aggregate liability to you for any claim arising out of these Terms shall not exceed <strong>USD 100</strong>.
                        </p>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}
