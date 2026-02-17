import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { PlaceResult } from '@/types/places';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const id = (await params).id;
    const json = await request.json();
    const placeData: PlaceResult = json.place;
    const dayNumber = json.day || 1;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Verify Itinerary Ownership/Access
    const { data: itinerary, error: itinError } = await supabase
        .from('itineraries')
        .select('id, owner_id')
        .eq('id', id)
        .single();

    if (itinError || !itinerary) {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 });
    }

    if (itinerary.owner_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Find or Create Place
    // We use osm_id and osm_type to check uniqueness
    const { data: existingPlace, error: placeError } = await supabase
        .from('places')
        .select('id')
        .eq('source', 'nominatim') // Assuming we might have other sources later
        .eq('description', `${placeData.osm_type}:${placeData.osm_id}`) // Storing osm info in description or creating dedicated columns would be better, but schema is fixed for now?
        // Wait, let's check schema. `source` exists. 
        // We didn't add osm_id column. Let's use `source` = `nominatim:${osm_id}` for uniqueness? 
        // Or just check by name/lat/lon? Lat/Lon is float, allows small diffs.
        // Let's use `source` column to store `nominatim:${placeData.osm_id}`
        .eq('source', `nominatim:${placeData.osm_id}`)
        .maybeSingle();

    let placeId = existingPlace?.id;

    if (!placeId) {
        // Create new place
        const { data: newPlace, error: createPlaceError } = await supabase
            .from('places')
            .insert({
                name: placeData.name || placeData.display_name.split(',')[0],
                lat: parseFloat(placeData.lat),
                lon: parseFloat(placeData.lon),
                country: placeData.address?.country,
                city: placeData.address?.city || placeData.address?.state, // Fallback
                description: placeData.display_name,
                source: `nominatim:${placeData.osm_id}`, // Unique identifier
                created_by: user.id,
            })
            .select('id')
            .single();

        if (createPlaceError) {
            console.error('Failed to create place:', createPlaceError);
            return NextResponse.json({ error: 'Failed to create place record' }, { status: 500 });
        }
        placeId = newPlace.id;
    }

    // 3. Add to Itinerary Items
    // Get max order for the day
    const { data: maxOrderData } = await supabase
        .from('itinerary_items')
        .select('order_in_day')
        .eq('itinerary_id', id)
        .eq('day_number', dayNumber)
        .order('order_in_day', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = maxOrderData ? maxOrderData.order_in_day + 1 : 0;

    const { data: newItem, error: itemError } = await supabase
        .from('itinerary_items')
        .insert({
            itinerary_id: id,
            place_id: placeId,
            day_number: dayNumber,
            order_in_day: nextOrder,
        })
        .select('*, places(*)')
        .single();

    if (itemError) {
        console.error('Failed to add item:', itemError);
        return NextResponse.json({ error: 'Failed to add item to itinerary' }, { status: 500 });
    }

    return NextResponse.json(newItem);
}
