'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Database } from '@/types/supabase';

// Fix for default marker icon missing in Leaflet + Webpack
// Only run on client
if (typeof window !== 'undefined') {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
}

type ItineraryItem = Database['public']['Tables']['itinerary_items']['Row'] & {
    places: Database['public']['Tables']['places']['Row'];
};

interface MapViewProps {
    items: ItineraryItem[];
}

function MapBounds({ items }: { items: ItineraryItem[] }) {
    const map = useMap();

    useEffect(() => {
        if (items.length === 0) return;

        const bounds = L.latLngBounds(items.map(i => [i.places.lat, i.places.lon]));
        map.fitBounds(bounds, { padding: [50, 50] });
    }, [items, map]);

    return null;
}

export default function MapView({ items }: MapViewProps) {
    // Sort items by day and order
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (a.day_number !== b.day_number) return a.day_number - b.day_number;
            return a.order_in_day - b.order_in_day;
        });
    }, [items]);

    const positions = sortedItems.map(item => [item.places.lat, item.places.lon] as [number, number]);

    // Group by day for different colors? Or just one line?
    // Let's do a single line for now, maybe different colors per day later if needed.
    // Actually, distinct colors per day would be nice.
    const colors = ['#2563eb', '#dc2626', '#16a34a', '#d97706', '#9333ea', '#db2777'];

    // Group items by day
    const itemsByDay = useMemo(() => {
        const groups: Record<number, ItineraryItem[]> = {};
        sortedItems.forEach(item => {
            if (!groups[item.day_number]) groups[item.day_number] = [];
            groups[item.day_number].push(item);
        });
        return groups;
    }, [sortedItems]);

    // Center on first item or default 0,0
    const center: [number, number] = sortedItems.length > 0
        ? [sortedItems[0].places.lat, sortedItems[0].places.lon]
        : [0, 0];

    return (
        <div className="h-full w-full min-h-[500px] rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm relative z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full z-0" style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />

                <MapBounds items={sortedItems} />

                {/* Render Polylines for each day */}
                {Object.entries(itemsByDay).map(([day, dayItems]) => {
                    const dayPositions = dayItems.map(i => [i.places.lat, i.places.lon] as [number, number]);
                    if (dayPositions.length < 2) return null;

                    return (
                        <Polyline
                            key={`line-${day}`}
                            positions={dayPositions}
                            pathOptions={{ color: colors[(parseInt(day) - 1) % colors.length], weight: 4, opacity: 0.7 }}
                        />
                    );
                })}

                {/* Render Markers */}
                {sortedItems.map((item, index) => (
                    <Marker
                        key={item.id}
                        position={[item.places.lat, item.places.lon]}
                    >
                        <Popup>
                            <div className="text-sm">
                                <span className="font-bold block mb-1">
                                    <span
                                        className="inline-block w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: colors[(item.day_number - 1) % colors.length] }}
                                    ></span>
                                    Day {item.day_number}: {item.places.name}
                                </span>
                                <p className="text-neutral-500 mb-0">{item.places.city}, {item.places.country}</p>
                                {item.notes && <p className="mt-2 text-neutral-600 italic border-l-2 border-neutral-200 pl-2">{item.notes}</p>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
