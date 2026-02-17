import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const id = (await params).id;

    const { data: itinerary, error: itinError } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

    if (itinError) {
        return NextResponse.json({ error: itinError.message }, { status: 404 });
    }

    // Check access (public or owner)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!itinerary.public && itinerary.owner_id !== user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch items
    const { data: items, error: itemsError } = await supabase
        .from('itinerary_items')
        .select('*, places(*)')
        .eq('itinerary_id', id)
        .order('day_number', { ascending: true })
        .order('order_in_day', { ascending: true });

    if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ ...itinerary, items });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const id = (await params).id;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();

    const { data, error } = await supabase
        .from('itineraries')
        .update(json)
        .eq('id', id)
        .eq('owner_id', user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const id = (await params).id;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id)
        .eq('owner_id', user.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
