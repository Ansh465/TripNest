'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Loader2, Calendar, Trash2 } from 'lucide-react';
import { Database } from '@/types/supabase';
import { createClient } from '@/lib/supabase';

type Itinerary = Database['public']['Tables']['itineraries']['Row'];

export function ItineraryList() {
    const [itineraries, setItineraries] = useState<Itinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchItineraries() {
            try {
                const res = await fetch('/api/itineraries');
                if (res.ok) {
                    const data = await res.json();
                    setItineraries(data);
                }
            } catch (error) {
                console.error('Failed to fetch itineraries', error);
            } finally {
                setLoading(false);
            }
        }
        fetchItineraries();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        // Optimistic update
        setItineraries(current => current.filter(i => i.id !== id));

        const { error } = await supabase
            .from('itineraries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting itinerary:', error);
            alert('Failed to delete itinerary');
            // Revert changes could be handled here if strict, but for now simple alert.
            // Repopulate would require re-fetch or storing previous state.
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">My Itineraries</h2>
                <Link
                    href="/itineraries/new"
                    className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 dark:focus-visible:ring-neutral-300"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Itinerary
                </Link>
            </div>

            {itineraries.length === 0 ? (
                <div className="rounded-lg border border-dashed border-neutral-300 p-12 text-center dark:border-neutral-700">
                    <h3 className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                        No itineraries
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Get started by creating a new trip plan.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/itineraries/new"
                            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Create Trip
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {itineraries.map((itinerary) => (
                        <Link
                            key={itinerary.id}
                            href={`/itineraries/${itinerary.id}`}
                            className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="flex flex-1 flex-col p-6">
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 group-hover:underline truncate">
                                        {itinerary.title}
                                    </h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {itinerary.public && (
                                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900/20 dark:text-green-400">
                                                Public
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => handleDelete(e, itinerary.id, itinerary.title)}
                                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                                            title="Delete Itinerary"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-2 flex-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">
                                    {itinerary.description || 'No description provided.'}
                                </p>
                                <div className="mt-4 flex items-center text-xs text-neutral-400">
                                    <Calendar className="mr-1.5 h-3.5 w-3.5" />
                                    Created {new Date(itinerary.created_at || '').toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
