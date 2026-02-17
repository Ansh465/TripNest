'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface ItineraryLikeButtonProps {
    itineraryId: string;
    initialLikes?: number;
}

export function ItineraryLikeButton({ itineraryId, initialLikes = 0 }: ItineraryLikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false); // In a real app, fetch this from a join table
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleLike = async () => {
        if (loading) return;
        setLoading(true);

        // Optimistic toggle
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikes(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            // Note: This is a simplified implementation. 
            // Ideally, we should have an 'itinerary_votes' table to track unique user likes.
            // Here we are just incrementing/decrementing the counter on the itinerary row.

            const { error } = await supabase.rpc('increment_itinerary_upvotes', {
                row_id: itineraryId,
                count: newIsLiked ? 1 : -1
            });

            // Fallback if RPC doesn't exist (likely doesn't), use direct update (race condition prone)
            if (error) {
                // Fetch current first to minimize race condition window
                const { data: current } = await supabase
                    .from('itineraries')
                    .select('upvotes')
                    .eq('id', itineraryId)
                    .single();

                if (current) {
                    const currentVotes = current.upvotes || 0;
                    const newVotes = newIsLiked ? currentVotes + 1 : currentVotes - 1;

                    await supabase
                        .from('itineraries')
                        .update({ upvotes: Math.max(0, newVotes) })
                        .eq('id', itineraryId);
                }
            }

        } catch (error) {
            console.error('Error updating likes:', error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikes(prev => newIsLiked ? prev - 1 : prev + 1);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={loading}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:border-rose-200 hover:text-rose-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400'
                }`}
            title="Like this itinerary"
        >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{likes}</span>
        </button>
    );
}
