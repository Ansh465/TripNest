"use client";

import Link from "next/link";
import { Map, Calendar, ArrowRight } from "lucide-react";

interface Itinerary {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    items_count: number; // We'll need to fetch this or just approximate
}

export function ItineraryGrid({ itineraries }: { itineraries: any[] }) {
    if (!itineraries || itineraries.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                    <Map className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No itineraries yet</h3>
                <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                    Create your first itinerary to see it here and share it with the world.
                </p>
                <Link
                    href="/itineraries/new"
                    className="inline-flex items-center justify-center mt-6 px-6 py-2.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:opacity-90 transition-opacity"
                >
                    Create Itinerary
                </Link>
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
                    {/* Placeholder Cover - In a real app, this would be a map image or upload */}
                    <div className="h-40 bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Map className="w-12 h-12 text-neutral-300 dark:text-neutral-600 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="p-5">
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
