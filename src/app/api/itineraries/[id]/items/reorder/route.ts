import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const id = (await params).id;
    const json = await request.json();
    const { items } = json;
    // Expecting items to be an array of { id, day_number, order_in_day }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: itinerary } = await supabase
        .from('itineraries')
        .select('owner_id')
        .eq('id', id)
        .single();

    if (!itinerary || itinerary.owner_id !== user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Perform updates in a batch (or loop for MVP if batch RPC not set up)
    // Supabase JS doesn't support bulk update with different values easily without RPC.
    // For MVP with small lists, we can use `upsert` if we include all required fields, 
    // or just loop. Looping is slow but safe for < 50 items.
    // Better approach: `upsert` with all fields.

    const updates = items.map((item: any) => ({
        id: item.id,
        itinerary_id: id,
        place_id: item.places?.id || item.place_id, // Ensure we have place_id
        day_number: item.day_number,
        order_in_day: item.order_in_day,
        updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase
        .from('itinerary_items')
        .upsert(updates, { onConflict: 'id' });

    if (error) {
        console.error('Failed to reorder items:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
