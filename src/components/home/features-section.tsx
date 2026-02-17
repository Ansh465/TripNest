'use client';

import { motion } from 'framer-motion';
import { Globe, Users, Wallet } from 'lucide-react';
import Image from 'next/image';

const features = [
    {
        title: "Collaborative Planning",
        description: "Invite friends, vote on activities, and build your itinerary together in real-time.",
        icon: Users,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Global Exploration",
        description: "Discover community-curated trips and hidden gems from travelers worldwide.",
        icon: Globe,
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    },
    {
        title: "Expense Tracking",
        description: "Keep your budget in check with built-in expense logging and splitting.",
        icon: Wallet,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    },
];

export function FeaturesSection() {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Why Choose Itero?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="group relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2 h-[400px] flex flex-col justify-end"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                        </div>

                        <div className="relative z-10 p-8">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 text-white">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                            <p className="text-neutral-300 leading-relaxed">{feature.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
