import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const { title, description, public: isPublic } = json;

    // Ensure user exists in public.users (failsafe for trigger)
    const { data: publicUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

    if (!publicUser) {
        const { error: insertUserError } = await supabase
            .from('users')
            .insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || '',
                avatar_url: user.user_metadata?.avatar_url || '',
            });

        if (insertUserError) {
            console.error('Failed to create backup user record:', insertUserError);
            // Verify if it failed because it already exists (race condition), if so continue
            if (insertUserError.code !== '23505') { // unique_violation
                return NextResponse.json({ error: 'Failed to initialize user profile' }, { status: 500 });
            }
        }
    }

    const { data, error } = await supabase
        .from('itineraries')
        .insert({
            owner_id: user.id,
            title,
            description,
            public: isPublic || false,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating itinerary:', error);
        return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    return NextResponse.json(data);
}
