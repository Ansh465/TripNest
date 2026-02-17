import { PlaceResult } from '@/types/places';
import { MapPin } from 'lucide-react';

interface PlaceCardProps {
    place: PlaceResult;
    onSelect?: (place: PlaceResult) => void;
}

export function PlaceCard({ place, onSelect }: PlaceCardProps) {
    // Nominatim display_name is often very long, let's try to parse it or just show it
    // For MVP, showing the full name is safer.

    return (
        <div
            className="group relative flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-50 mb-1">
                            {place.name || place.display_name.split(',')[0]}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">
                            {place.display_name}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                            <span className="capitalize bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                                {place.type.replace('_', ' ')}
                            </span>
                            {place.address?.country && (
                                <span>{place.address.country}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {onSelect && (
                <button
                    onClick={() => onSelect(place)}
                    className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-900/90 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                >
                    Add to Itinerary
                </button>
            )}
        </div>
    );
}
