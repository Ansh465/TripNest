'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function togglePublic(itineraryId: string, isPublic: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('itineraries')
        .update({ public: isPublic })
        .eq('id', itineraryId);

    if (error) {
        console.error('Error toggling public status:', error);
        return { error: 'Failed to update visibility.' };
    }

    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
}

export async function updateItineraryBudget(itineraryId: string, budget: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('itineraries')
        .update({ budget })
        .eq('id', itineraryId);

    if (error) {
        return { error: 'Failed to update budget.' };
    }

    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
}
