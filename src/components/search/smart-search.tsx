'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Compass, Plus, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchItineraries, type ItinerarySearchResult } from '@/app/actions/search';
import { PlaceResult } from '@/types/places';
import clsx from 'clsx';
import Link from 'next/link';
// Local hook used below

// Simple debounce hook if not present
function useDebouncedValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

export function SmartSearch() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 500);
    const [itineraries, setItineraries] = useState<ItinerarySearchResult[]>([]);
    const [places, setPlaces] = useState<PlaceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch data when debounced query changes
    useEffect(() => {
        async function fetchData() {
            if (debouncedQuery.length < 3) {
                setItineraries([]);
                setPlaces([]);
                return;
            }

            setLoading(true);
            setIsOpen(true);

            try {
                // Parallel fetch
                const [itinRes, placesRes] = await Promise.all([
                    searchItineraries(debouncedQuery),
                    fetch(`/api/places/search?q=${encodeURIComponent(debouncedQuery)}`).then(res => res.json())
                ]);

                setItineraries(itinRes.itineraries || []);
                setPlaces(Array.isArray(placesRes) ? placesRes : []);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [debouncedQuery]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query) {
            router.push(`/explore?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
            <div className={`relative flex items-center w-full h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl transition-all duration-300 ${isOpen ? 'rounded-b-none bg-neutral-900/80' : 'hover:bg-white/20'}`}>
                <Search className="absolute left-5 w-5 h-5 text-white/70" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query.length >= 3 && setIsOpen(true)}
                    placeholder="Where to next? (e.g., Tokyo, Paris 5 days...)"
                    className="w-full h-full bg-transparent border-none outline-none text-white placeholder:text-neutral-400 px-12 text-lg font-medium"
                />

                {loading ? (
                    <Loader2 className="absolute right-5 w-5 h-5 text-white/70 animate-spin" />
                ) : query && (
                    <button
                        onClick={() => { setQuery(''); setIsOpen(false); }}
                        className="absolute right-5 text-white/50 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-14 left-0 w-full bg-neutral-900/90 backdrop-blur-xl border-x border-b border-white/10 rounded-b-2xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto"
                    >
                        {/* 1. Existing Itineraries */}
                        {itineraries.length > 0 && (
                            <div className="p-2">
                                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-2">
                                    Community Trips
                                </h3>
                                {itineraries.map((itin) => (
                                    <Link
                                        key={itin.id}
                                        href={`/itineraries/${itin.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                            <Compass className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{itin.title}</div>
                                            <div className="text-xs text-neutral-400">
                                                by {itin.owner?.full_name || 'Anonymous'}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* 2. Places -> Start New Trip */}
                        {places.length > 0 && (
                            <div className="p-2 border-t border-white/10">
                                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-2">
                                    Start a New Trip
                                </h3>
                                {places.map((place) => (
                                    <Link
                                        key={place.place_id}
                                        href={`/itineraries/new?place=${encodeURIComponent(JSON.stringify(place))}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{place.name}</div>
                                            <div className="text-xs text-neutral-400">
                                                {place.display_name}
                                            </div>
                                        </div>
                                        <ArrowRight className="w-4 h-4 ml-auto text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* 3. Empty State / Create Custom */}
                        <div className="p-2 border-t border-white/10">
                            <Link
                                href={`/itineraries/new?title=${encodeURIComponent(query)}`}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                                    <Plus className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-white font-medium">Create new trip to &quot;{query}&quot;</div>
                                    <div className="text-xs text-neutral-400">
                                        Start from scratch
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Icon helper
import { ArrowRight } from 'lucide-react';
