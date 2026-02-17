'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const steps = [
    {
        num: "01",
        title: "Create a Trip",
        description: "Start a new itinerary or fork a template from the community.",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80"
    },
    {
        num: "02",
        title: "Invite & Plan",
        description: "Add friends, vote on spots, and drag-and-drop your schedule.",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80"
    },
    {
        num: "03",
        title: "Explore the World",
        description: "Sync to offline mode and enjoy your adventure stress-free.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 px-6 w-full bg-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="container px-6 mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold tracking-tight mb-4 text-white">How TripNest Works</h2>
                        <p className="text-neutral-400 text-lg">
                            From inspiration to departure, we're with you every step of the way.
                        </p>
                    </div>
                </div>

                <div className="space-y-24">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-16`}
                        >
                            {/* Image Side */}
                            <div className="flex-1 w-full">
                                <div className="relative aspect-video md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/10 group">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Text Side */}
                            <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                                <div className="flex flex-col items-center md:items-start">
                                    <span className="text-8xl font-bold text-white/5 select-none leading-none mb-4 -ml-2">
                                        {step.num}
                                    </span>
                                    <h3 className="text-3xl font-bold text-white mb-4">{step.title}</h3>
                                    <p className="text-lg text-neutral-400 leading-relaxed max-w-md">{step.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
