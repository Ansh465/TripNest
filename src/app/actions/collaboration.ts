'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function inviteUser(email: string, itineraryId: string) {
    const supabase = await createClient();

    // 1. Check if user exists
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .single();

    if (userError || !user) {
        return { error: 'User not found. Please ask them to sign up first.' };
    }

    // 2. Add to collaborators
    const { error: insertError } = await supabase
        .from('itinerary_collaborators')
        .insert({
            itinerary_id: itineraryId,
            user_id: user.id,
            role: 'editor'
        });

    if (insertError) {
        if (insertError.code === '23505') { // Unique violation
            return { error: 'User is already a collaborator.' };
        }
        return { error: 'Failed to invite user.' };
    }

    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
}

export async function removeCollaborator(userId: string, itineraryId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('itinerary_collaborators')
        .delete()
        .eq('itinerary_id', itineraryId)
        .eq('user_id', userId);

    if (error) {
        return { error: 'Failed to remove collaborator.' };
    }

    revalidatePath(`/itineraries/${itineraryId}`);
    return { success: true };
}
