'use client';

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Camera } from 'lucide-react';
import clsx from 'clsx';
import { Database } from '@/types/supabase';
import { VoteControl } from './vote-control';
import { getForecast, WeatherData } from '@/app/actions/weather';
import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Thermometer } from 'lucide-react';

export type ItineraryItem = Database['public']['Tables']['itinerary_items']['Row'] & {
    places: Database['public']['Tables']['places']['Row'] | null;
};

interface SortableItemProps {
    id: string;
    item: ItineraryItem;
    day: number;
    onJournalOpen?: () => void;
}

export function SortableItem({ id, item, onJournalOpen }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: id,
        data: {
            type: 'item',
            item,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={clsx(
                "group relative flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900",
                isDragging && "z-50 shadow-xl ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-950"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
                <GripVertical className="h-5 w-5" />
            </div>



            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-neutral-900 truncate dark:text-neutral-50">
                    {item.places?.name || 'Unknown Place'}
                </h4>
                <p className="text-xs text-neutral-500 truncate dark:text-neutral-400">
                    {item.places?.city || item.places?.country}
                </p>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onJournalOpen && (
                    <button
                        onClick={onJournalOpen}
                        className="p-1 text-neutral-400 hover:text-blue-500 transition-colors"
                        title="Add Memory"
                    >
                        <Camera className="h-4 w-4" />
                    </button>
                )}
                <button
                    // On click should delete, for now purely visual
                    className="p-1 text-neutral-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

interface DayColumnProps {
    day: number;
    items: ItineraryItem[];
    children?: React.ReactNode;
}

export function DayColumn({ day, items, children }: DayColumnProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null);

    const { setNodeRef } = useDroppable({
        id: `day-${day}`,
        data: {
            type: 'day',
            day,
        }
    });

    useEffect(() => {
        if (items.length > 0 && items[0].places) {
            const { lat, lon } = items[0].places;
            getForecast(lat, lon).then((res) => {
                if (Array.isArray(res) && res.length > 0) {
                    // Match by day index or just pick one
                    // For now, let's just pick the first forecast for the location
                    setWeather(res[0]); 
                }
            });
        }
    }, [items]);

    const WeatherIcon = () => {
        if (!weather) return null;
        if (weather.description.includes('rain')) return <CloudRain className="w-4 h-4 text-blue-400" />;
        if (weather.description.includes('cloud')) return <Cloud className="w-4 h-4 text-neutral-400" />;
        return <Sun className="w-4 h-4 text-yellow-400" />;
    };

    return (
        <div className="flex flex-col h-full rounded-xl border border-neutral-200 bg-neutral-50/50 dark:border-neutral-800 dark:bg-neutral-900/20">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-t-xl dark:bg-neutral-900/50">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-50">Day {day}</h3>
                    {weather && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                            <WeatherIcon />
                            <span>{weather.temp}°C</span>
                        </div>
                    )}
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {items.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-3 flex flex-col gap-3 min-h-[150px]"
            >
                {children}
                {items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-neutral-200 rounded-lg m-1 dark:border-neutral-800">
                        <span className="text-xs text-neutral-400 font-medium">Drag places here</span>
                    </div>
                )}
            </div>
        </div>
    );
}
