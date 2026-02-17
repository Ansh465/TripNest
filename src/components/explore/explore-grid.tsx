"use client";

import Link from "next/link";
import { Map, Calendar, ArrowRight, User as UserIcon } from "lucide-react";

interface Itinerary {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    items_count: number;
    upvotes: number;
    owner: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
}

export function ExploreGrid({ itineraries }: { itineraries: any[] }) {
    if (!itineraries || itineraries.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-neutral-500">No public itineraries found yet.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map((itinerary) => (
                <Link
                    key={itinerary.id}
                    href={`/itineraries/${itinerary.id}`}
                    className="group block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
                >
                    <div className="h-40 bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Map className="w-12 h-12 text-neutral-300 dark:text-neutral-600 group-hover:scale-110 transition-transform duration-500" />

                        {/* Upvote Badge */}
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                            👍 {itinerary.upvotes || 0}
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                                {itinerary.owner?.avatar_url ? (
                                    <img src={itinerary.owner.avatar_url} alt="Owner" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-4 h-4 m-1 text-neutral-400" />
                                )}
                            </div>
                            <span className="text-xs text-neutral-500 font-medium truncate">
                                {itinerary.owner?.full_name || "Anonymous Traveler"}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">
                            {itinerary.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 h-10">
                            {itinerary.description || "No description provided."}
                        </p>

                        <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(itinerary.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}</span>
                            </div>
                            <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-neutral-900 dark:text-white font-medium">
                                View <ArrowRight className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
