'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, X, Compass, Plus } from 'lucide-react';
import { PlaceResult } from '@/types/places';
import { PlaceCard } from './place-card';
import { searchItineraries, type SearchResult, type ItinerarySearchResult } from '@/app/actions/search';
import Link from 'next/link';


interface PlaceSearchProps {
    onAddPlace?: (place: PlaceResult) => void;
    mode?: 'select' | 'explore';
}

export function PlaceSearch({ onAddPlace, mode = 'select' }: PlaceSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlaceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query || query.length < 3) {
                setResults([]);
                setItineraries([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const promises: Promise<any | SearchResult>[] = [
                    fetch(`/api/places/search?q=${encodeURIComponent(query)}`).then(res => {
                        if (!res.ok) throw new Error('Failed to fetch results');
                        return res.json();
                    })
                ];

                if (mode === 'explore') {
                    promises.push(searchItineraries(query));
                }

                const [placesData, itinData] = await Promise.all(promises);

                setResults(placesData);
                if (itinData && itinData.itineraries) {
                    setItineraries(itinData.itineraries);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to search. Please try again.');
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, mode]);

    return (
        <div className="w-full max-w-2xl space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search for a city, landmark, or address..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 pl-10 pr-10 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                />
                {query && !loading && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                        title="Clear search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                    </div>
                )}
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20">
                    {error}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-1">
                {/* 1. Community Itineraries (Explore Mode Only) */}
                {mode === 'explore' && itineraries.length > 0 && (
                    <div className="space-y-4 mb-4">
                        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                            Found Itineraries
                        </h3>
                        {itineraries.map((itin) => (
                            <Link
                                key={itin.id}
                                href={`/itineraries/${itin.id}`}
                                className="flex items-center gap-4 p-4 rounded-lg bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-all dark:bg-neutral-900 dark:border-neutral-800"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Compass className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-semibold text-neutral-900 dark:text-neutral-50">{itin.title}</div>
                                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                        by {itin.owner?.full_name || 'Anonymous'}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* 2. Places */}
                {(mode === 'explore' || results.length > 0) && (
                    <div className="space-y-4">
                        {mode === 'explore' && results.length > 0 && (
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
                                Places
                            </h3>
                        )}
                        {results.map((place) => (
                            mode === 'explore' ? (
                                <Link
                                    key={place.place_id}
                                    href={`/itineraries/new?place=${encodeURIComponent(JSON.stringify(place))}`}
                                    className="block transition-transform hover:scale-[1.01]"
                                >
                                    <PlaceCard place={place} />
                                </Link>
                            ) : (
                                <PlaceCard
                                    key={place.place_id}
                                    place={place}
                                    onSelect={onAddPlace}
                                />
                            )
                        ))}
                    </div>
                )}

                {/* 3. Create New Option (Explore Mode Only) */}
                {mode === 'explore' && query.length >= 3 && !loading && (
                    <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                        <Link
                            href={`/itineraries/new?title=${encodeURIComponent(query)}`}
                            className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-900 hover:text-neutral-900 transition-all dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-50 dark:hover:text-neutral-50"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Create a new trip to &quot;{query}&quot;</span>
                        </Link>
                    </div>
                )}

                {!loading && query.length >= 3 && results.length === 0 && itineraries.length === 0 && (
                    <div className="text-center text-neutral-500 py-8">
                        No results found for &quot;{query}&quot;.
                        {mode === 'explore' && (
                            <div className="mt-4">
                                <Link
                                    href={`/itineraries/new?title=${encodeURIComponent(query)}`}
                                    className="text-blue-600 hover:underline font-medium"
                                >
                                    Create a new trip instead?
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
