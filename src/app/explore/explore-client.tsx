'use client';

import { useState } from 'react';
import { ExploreGrid } from '@/components/explore/explore-grid';
import { PlaceSearch } from '@/components/places/place-search';
import { Search, Globe, MapPin } from 'lucide-react';

interface ExploreClientProps {
    itineraries: any[];
}

export function ExploreClient({ itineraries }: ExploreClientProps) {
    const [activeTab, setActiveTab] = useState<'community' | 'places'>('community');

    return (
        <div className="container max-w-6xl mx-auto pt-32 pb-12 px-4 md:px-6 mb-20">
            <div className="flex flex-col items-center text-center mb-12 space-y-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full mb-2">
                    {activeTab === 'community' ? <Globe className="w-8 h-8" /> : <MapPin className="w-8 h-8" />}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    {activeTab === 'community' ? 'Explore Community' : 'Find Places'}
                </h1>
                <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl">
                    {activeTab === 'community'
                        ? 'Discover trending itineraries created by the community.'
                        : 'Search for cities, landmarks, or addresses to add to your itinerary.'}
                </p>

                {/* Tab Switcher */}
                <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 mt-6">
                    <button
                        onClick={() => setActiveTab('community')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'community'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        Community Itineraries
                    </button>
                    <button
                        onClick={() => setActiveTab('places')}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'places'
                            ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                            }`}
                    >
                        Find Places
                    </button>
                </div>
            </div>

            {activeTab === 'community' ? (
                <ExploreGrid itineraries={itineraries} />
            ) : (
                <div className="max-w-2xl mx-auto">
                    <PlaceSearch mode="explore" />
                </div>
            )}
        </div>
    );
}
