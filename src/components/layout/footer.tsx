import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black/40 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h4 className="text-lg font-bold text-white">Itero</h4>
                    <p className="text-neutral-500 text-sm mt-1">
                        © {new Date().getFullYear()} Itero. All rights reserved.
                    </p>
                </div>

                <div className="flex gap-6 text-sm text-neutral-400">
                    <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                </div>

                <div className="flex gap-4">
                    <a href="https://github.com/ansh465/itero" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    {/* Add more social links as needed */}
                </div>
            </div>
        </footer>
    );
}
