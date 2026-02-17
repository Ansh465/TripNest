'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ItineraryBuilder } from '@/components/itinerary/itinerary-builder';
import { PlaceSearch } from '@/components/places/place-search';
import { PublicShare } from '@/components/itinerary/public-share';
import { InviteControl } from '@/components/itinerary/invite-control';
import { createClient } from '@/lib/supabase';
import { ItineraryLikeButton } from '@/components/itinerary/itinerary-like-button';
import { FlightSearchWidget } from '@/components/itinerary/flight-search-widget';

import { ExpenseTracker } from '@/components/itinerary/expense-tracker';
import { PackingList } from '@/components/itinerary/packing-list';
import { PlaceResult } from '@/types/places';
import { DollarSign, MapIcon, List, Luggage, Printer } from 'lucide-react';

import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/itinerary/map-view'), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-neutral-400" /></div>
});

export default function ItineraryPage() {

    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [itinerary, setItinerary] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // View Mode: 'builder' | 'expenses' | 'packing'
    const [viewMode, setViewMode] = useState<'builder' | 'expenses' | 'packing' | 'map'>('builder');

    const supabase = createClient();

    useEffect(() => {
        // Fetch User
        supabase.auth.getUser().then(({ data }: any) => {
            setUser(data.user);
        });

        if (!id) return;

        async function fetchItinerary() {
            try {
                const res = await fetch(`/api/itineraries/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to load itinerary');
                }
                const data = await res.json();
                setItinerary(data);
                setItems(data.items || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchItinerary();

        // Realtime Subscription
        const channel = supabase
            .channel(`itinerary-${id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'itinerary_items',
                    filter: `itinerary_id=eq.${id}`,
                },
                (payload: any) => {
                    console.log('Realtime change:', payload);
                    if (payload.eventType === 'INSERT') {
                        fetchItinerary();
                    } else if (payload.eventType === 'DELETE') {
                        setItems((current) => current.filter((i) => i.id !== payload.old.id));
                    } else if (payload.eventType === 'UPDATE') {
                        fetchItinerary();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, supabase]);

    const handleAddItem = async (place: any) => {
        try {
            const res = await fetch(`/api/itineraries/${id}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ place, day: 1 }),
            });

            if (!res.ok) throw new Error('Failed to add item');

            const newItem = await res.json();
            setItems(prev => [...prev, newItem]);
        } catch (err) {
            console.error(err);
            alert('Failed to add place to itinerary');
        }
    };

    const handleItemsChange = async (newItems: any[]) => {
        setItems(newItems);
        try {
            await fetch(`/api/itineraries/${id}/items/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: newItems }),
            });
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen items-center justify-center text-red-500">
                Error: {error}
            </div>
        );
    }

    if (!itinerary) return null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
            <header className="border-b border-neutral-200 bg-white px-6 py-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                                {itinerary.title}
                            </h1>

                            <div className="flex items-center gap-2">
                                <PublicShare itineraryId={itinerary.id} isPublic={itinerary.public} />
                                <InviteControl
                                    itineraryId={itinerary.id}
                                    collaborators={itinerary.itinerary_collaborators || []}
                                    isOwner={itinerary.owner_id === user?.id}
                                />
                                <ItineraryLikeButton itineraryId={itinerary.id} initialLikes={itinerary.upvotes || 0} />
                            </div>
                        </div>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {itinerary.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* View Switcher */}
                        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
                            <button
                                onClick={() => setViewMode('builder')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'builder'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                                    }`}
                            >
                                <span className="flex items-center gap-2"><MapIcon className="w-4 h-4" /> Plan</span>
                            </button>
                            <button
                                onClick={() => setViewMode('expenses')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'expenses'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                                    }`}
                            >
                                <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Expenses</span>
                            </button>
                            <button
                                onClick={() => setViewMode('packing')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'packing'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                                    }`}
                            >
                                <span className="flex items-center gap-2"><Luggage className="w-4 h-4" /> Packing</span>
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'map'
                                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                                    }`}
                            >
                                <span className="flex items-center gap-2"><MapIcon className="w-4 h-4" /> Map</span>
                            </button>
                        </div>

                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />

                        <button
                            onClick={() => window.print()}
                            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 print:hidden"
                            title="Print Itinerary"
                        >
                            <Printer className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => router.push('/itineraries')}
                            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 print:hidden"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                {viewMode === 'builder' ? (
                    <div className="h-full flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
                        {/* Sidebar for Search */}
                        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 overflow-y-auto z-10">
                            <div className="space-y-6">
                                <section>
                                    <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                        Add Places
                                    </h2>
                                    <PlaceSearch onAddPlace={handleAddItem} />
                                </section>

                                <section>
                                    <FlightSearchWidget destination={itinerary.title} />
                                </section>
                            </div>
                        </aside>

                        {/* Main Builder Area */}
                        <main className="flex-1 overflow-y-auto bg-neutral-50 p-6 dark:bg-neutral-950/50">
                            <ItineraryBuilder
                                itineraryId={id}
                                items={items}
                                onItemsChange={handleItemsChange}
                                user={user}
                            />
                        </main>
                    </div>
                ) : viewMode === 'expenses' ? (
                    <div className="h-full max-w-5xl mx-auto w-full p-6 overflow-y-auto">
                        <ExpenseTracker
                            itineraryId={id}
                            initialBudget={itinerary.budget || 0}
                            currency={itinerary.currency || 'USD'}
                            onBudgetUpdate={(newBudget) => setItinerary({ ...itinerary, budget: newBudget })}
                        />
                    </div>
                ) : viewMode === 'packing' ? (
                    <div className="h-full max-w-3xl mx-auto w-full p-6 overflow-y-auto">
                        <PackingList itineraryId={id} />
                    </div>
                ) : (
                    <div className="h-full w-full p-6">
                        <MapView items={items} />
                    </div>
                )}
            </div>
        </div>
    );
}
