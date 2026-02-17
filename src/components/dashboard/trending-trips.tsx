'use client';

import Link from 'next/link';
import { Map, ArrowRight, ThumbsUp, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrendingTripsProps {
    itineraries: any[];
}

export function TrendingTrips({ itineraries }: TrendingTripsProps) {
    if (itineraries.length === 0) return null;

    return (
        <section className="w-full max-w-5xl px-6 pb-20">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Trending Community Trips</h2>
                <Link href="/explore" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                    Explore All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {itineraries.map((itinerary, index) => (
                    <motion.div
                        key={itinerary.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={`/itineraries/${itinerary.id}`}
                            className="group block bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col"
                        >
                            <div className="relative h-32 bg-white/5 flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                                <Map className="w-10 h-10 text-neutral-600 group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                                    <ThumbsUp className="w-3 h-3" /> {itinerary.upvotes || 0}
                                </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">
                                    {itinerary.title}
                                </h3>

                                <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/5">
                                    <div className="w-5 h-5 rounded-full bg-neutral-700 overflow-hidden shrink-0">
                                        {itinerary.owner?.avatar_url ? (
                                            <img src={itinerary.owner.avatar_url} alt="User" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-3 h-3 m-1 text-neutral-400" />
                                        )}
                                    </div>
                                    <span className="text-xs text-neutral-400 truncate">
                                        {itinerary.owner?.full_name || 'Anonymous'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
