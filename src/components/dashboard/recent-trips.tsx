'use client';

import Link from 'next/link';
import { Map, Calendar, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentTripsProps {
    itineraries: any[];
}

export function RecentTrips({ itineraries }: RecentTripsProps) {
    return (
        <section className="w-full max-w-5xl px-6 py-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Continue Planning</h2>
                <Link href="/itineraries" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {itineraries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
                    <p className="text-neutral-400 mb-4">No recent trips found.</p>
                    <Link
                        href="/itineraries/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" /> create New
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {itineraries.map((itinerary, index) => (
                        <motion.div
                            key={itinerary.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={`/itineraries/${itinerary.id}`}
                                className="group block h-full bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Map className="w-6 h-6" />
                                    </div>
                                    {itinerary.public && (
                                        <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                            Public
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                    {itinerary.title}
                                </h3>
                                <div className="flex items-center text-xs text-neutral-400">
                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                    <span>
                                        {new Date(itinerary.updated_at || itinerary.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
