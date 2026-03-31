'use client';

import { motion } from 'framer-motion';
import { Map, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center text-center pt-48 pb-32 px-6 w-full overflow-hidden min-h-[100vh]">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0 select-none">
                <Image
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
                    alt="Travel Background"
                    fill
                    className="object-cover opacity-60 brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-neutral-950" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex flex-col items-center gap-6"
            >
                <div className="bg-white/10 p-4 rounded-3xl ring-1 ring-white/20 backdrop-blur-xl shadow-2xl shadow-blue-500/20 mb-4">
                    <Map className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white mb-2 drop-shadow-2xl">
                    Plan Your <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 animate-gradient-x">
                        Next Adventure
                    </span>
                </h1>

                <p className="text-xl text-neutral-100 max-w-2xl leading-relaxed mb-8 drop-shadow-md font-medium text-balance">
                    Itero is the all-in-one travel companion that helps you plan, collaborate, and explore the world with ease.
                </p>


                <div className="w-full max-w-2xl px-4">
                    <SmartSearch />

                    <div className="flex justify-center gap-4 mt-8 text-sm text-neutral-400">
                        <span>Popular:</span>
                        <Link href="/explore?q=Paris" className="hover:text-white transition-colors">Paris</Link>
                        <Link href="/explore?q=Tokyo" className="hover:text-white transition-colors">Tokyo</Link>
                        <Link href="/explore?q=London" className="hover:text-white transition-colors">London</Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

import { SmartSearch } from '@/components/search/smart-search';
