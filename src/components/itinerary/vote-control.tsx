'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface VoteControlProps {
    itemId: string;
    initialScore?: number; // Optional if we want to preload
}

export function VoteControl({ itemId }: VoteControlProps) {
    const [score, setScore] = useState(0);
    const [userVote, setUserVote] = useState<1 | -1 | 0>(0);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchVotes() {
            // Get total score
            const { data: votes, error } = await supabase
                .from('itinerary_item_votes')
                .select('vote_type, user_id');

            if (error) {
                console.error('Error fetching votes', error);
                return;
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (votes) {
                // Filter for this item (or better, use eq in query if possible, but RLS might complicate count queries if not careful, 
                // actually we should query by item_id. The effect is per item.)
                // Wait, fetching ALL votes is bad.
            }
        }

        // Let's rewrite fetch properly.
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser();

            // Fetch Score
            // This is naive count. 
            // Better: use .rpc() for performance if heavily used, or just select count.
            // Select all votes for this item
            const { data: itemVotes, error } = await supabase
                .from('itinerary_item_votes')
                .select('vote_type, user_id')
                .eq('itinerary_item_id', itemId);

            if (itemVotes) {
                const newScore = itemVotes.reduce((acc, v) => acc + v.vote_type, 0);
                setScore(newScore);

                if (user) {
                    const myVote = itemVotes.find(v => v.user_id === user.id);
                    if (myVote) setUserVote(myVote.vote_type as 1 | -1);
                }
            }
            setInitialLoad(false);
        }

        loadData();
    }, [itemId, supabase]);

    const handleVote = async (type: 1 | -1) => {
        if (loading) return;
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('You must be logged in to vote.');
            setLoading(false);
            return;
        }

        // Optimistic update
        const previousVote = userVote;
        const previousScore = score;

        let newVote = type;
        if (userVote === type) {
            // Toggle off
            newVote = 0 as any; // Temporary cast, logic handles it
        }

        // Calculate score change
        // If unvoting: -type
        // If changing vote: -old + new
        // If new vote: +new

        let scoreChange = 0;
        if (userVote === type) {
            // Remove vote
            scoreChange = -type;
            setUserVote(0);
        } else if (userVote === 0) {
            // New vote
            scoreChange = type;
            setUserVote(type);
        } else {
            // Change vote (e.g. 1 to -1) -> change is -2
            scoreChange = type - (userVote);
            setUserVote(type);
        }

        setScore(current => current + scoreChange);

        try {
            if (userVote === type) {
                // Delete
                await supabase
                    .from('itinerary_item_votes')
                    .delete()
                    .eq('itinerary_item_id', itemId)
                    .eq('user_id', user.id);
            } else {
                // Upsert
                await supabase
                    .from('itinerary_item_votes')
                    .upsert({
                        itinerary_item_id: itemId,
                        user_id: user.id,
                        vote_type: type
                    });
            }
        } catch (error) {
            console.error(error);
            // Revert
            setUserVote(previousVote);
            setScore(previousScore);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoad) return null; // Or skeleton

    return (
        <div className="flex items-center gap-1 bg-neutral-50 dark:bg-neutral-800 rounded-full px-2 py-0.5 border border-neutral-100 dark:border-neutral-700">
            <button
                onClick={(e) => { e.stopPropagation(); handleVote(1); }}
                className={`p-1 rounded-full transition-colors ${userVote === 1 ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-neutral-400 hover:text-green-600'}`}
            >
                <ThumbsUp className="w-3 h-3" />
            </button>
            <span className={`text-xs font-medium w-4 text-center ${score > 0 ? 'text-green-600' : score < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                {score}
            </span>
            <button
                onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
                className={`p-1 rounded-full transition-colors ${userVote === -1 ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-neutral-400 hover:text-red-600'}`}
            >
                <ThumbsDown className="w-3 h-3" />
            </button>
        </div>
    );
}
