'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

interface AIPlace {
    name: string;
    description: string;
    lat: number;
    lon: number;
    city: string;
    country: string;
    day_number: number;
    order_in_day: number;
    notes?: string;
}

export async function generateItinerary(prompt: string, itineraryId: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: 'Gemini API key is not configured.' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Authenticated user required' };

    try {
        const fullPrompt = `Generate a detailed travel itinerary for the following request: "${prompt}". 
        Return a JSON array of objects, where each object represents a place to visit. 
        Each object must have these exact fields: 
        name (string), description (string), lat (number), lon (number), city (string), country (string), 
        day_number (integer starting from 1), order_in_day (integer starting from 0), 
        notes (short tip for this spot).
        
        Focus on famous and relevant landmarks. Ensure coordinates are accurate.
        Respond ONLY with a JSON array, no markdown formatting.`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        
        // Clean text in case Gemini wraps it in code blocks
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const aiItems: AIPlace[] = JSON.parse(cleanedText);

        // 1. Insert places and get IDs
        const itemsToInsert = [];

        for (const item of aiItems) {
            // First, find or insert the place
            const { data: place, error: placeError } = await supabase
                .from('places')
                .insert({
                    name: item.name,
                    description: item.description,
                    lat: item.lat,
                    lon: item.lon,
                    city: item.city,
                    country: item.country,
                    source: 'AI-Generated',
                    created_by: user.id
                })
                .select()
                .single();

            if (placeError) {
                console.error('Error inserting place:', placeError);
                continue;
            }

            itemsToInsert.push({
                itinerary_id: itineraryId,
                place_id: place.id,
                day_number: item.day_number,
                order_in_day: item.order_in_day,
                notes: item.notes
            });
        }

        if (itemsToInsert.length > 0) {
            const { error: insertError } = await supabase
                .from('itinerary_items')
                .insert(itemsToInsert);

            if (insertError) {
                console.error('Error inserting itinerary items:', insertError);
                return { error: 'Failed to add generated items to itinerary' };
            }
        }

        revalidatePath(`/itineraries/${itineraryId}`);
        return { success: true, count: itemsToInsert.length };

    } catch (err) {
        console.error('AI Error:', err);
        return { error: 'Failed to generate itinerary. Please check your prompt or try again later.' };
    }
}
