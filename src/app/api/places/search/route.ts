import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        // Use OpenStreetMap Nominatim API
        // Must include User-Agent header as per OSM usage policy
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
            )}&format=json&addressdetails=1&limit=10`,
            {
                headers: {
                    'User-Agent': 'TravelItineraryApp/1.0 (educational project)',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch from Nominatim');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Search API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch search results' },
            { status: 500 }
        );
    }
}
