'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NewItineraryPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/itineraries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    public: isPublic,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to create itinerary');
            }

            const data = await res.json();
            router.push(`/itineraries/${data.id}`);
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message}`); // Simple alert for immediate feedback
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-12 px-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Create New Itinerary</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        Trip Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="e.g. Summer in Japan"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
                        placeholder="A short summary of your trip..."
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        id="public"
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600 dark:border-neutral-700 dark:bg-neutral-900"
                    />
                    <label htmlFor="public" className="text-sm font-medium">
                        Make this itinerary public
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900/90 disabled:opacity-50 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Itinerary
                </button>
            </form>
        </div>
    );
}
