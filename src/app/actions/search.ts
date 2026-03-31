'use server';

import { createClient } from '@/lib/supabase-server';

export interface ItinerarySearchResult {
    id: string;
    title: string;
    description?: string | null;
    owner?: {
        full_name: string | null;
    } | null;
}

export interface SearchResult {
    itineraries: ItinerarySearchResult[];
}

export async function searchItineraries(query: string): Promise<SearchResult> {
    if (!query || query.length < 3) {
        return { itineraries: [] };
    }

    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('itineraries')
            .select('id, title, description, owner:users(full_name)')
            .eq('public', true)
            .ilike('title', `%${query}%`)
            .limit(5);

        if (error) {
            console.error('Error searching itineraries:', error);
            return { itineraries: [] };
        }

        return { itineraries: data || [] };
    } catch (err) {
        console.error('Unexpected error searching itineraries:', err);
        return { itineraries: [] };
    }
}
