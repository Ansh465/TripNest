'use client';

import { useState } from 'react';
import { Plane, Search, Calendar, MapPin } from 'lucide-react';

interface FlightSearchWidgetProps {
    destination: string;
}

export function FlightSearchWidget({ destination }: FlightSearchWidgetProps) {
    const [origin, setOrigin] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = () => {
        // Construct query based on available data
        let query = `Flights to ${destination}`;
        if (origin) query += ` from ${origin}`;
        if (date) query += ` on ${date}`;

        const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-neutral-100 text-neutral-600 rounded-lg dark:bg-neutral-800 dark:text-neutral-400">
                    <Plane className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-neutral-900 dark:text-white text-sm">Find Flights</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Search deals to {destination}</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">From</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="City or Airport"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-neutral-900 outline-none transition-all placeholder:text-neutral-400"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className="text-xs font-medium text-neutral-500 mb-1 block">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:ring-2 focus:ring-neutral-900 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleSearch}
                        className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                        <Search className="w-4 h-4" />
                        Search Flights
                    </button>
                </div>
            </div>
        </div>
    );
}
