"use client";

import { Home, Map, Plus, Search, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from 'clsx';

export function GlobalNav({ session }: { session: any }) {
    const pathname = usePathname();

    const links = [
        { href: "/", icon: Home, label: "Home", show: true },
        { href: "/explore", icon: Search, label: "Explore", show: true },
        { href: "/itineraries", icon: Map, label: "My Trips", show: !!session },
        { href: "/account", icon: User, label: "Profile", show: !!session },
    ];

    return (
        <>
            <Link
                href="/"
                className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all duration-300"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                    <Map className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold tracking-tight text-neutral-900 drop-shadow-sm dark:text-white hidden sm:block">
                    TripNest
                </span>
            </Link>

            {/* Nav Pill */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 print:hidden">
                <nav className="flex items-center gap-1 p-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 hover:scale-[1.02] transition-all duration-300">
                    {links.filter(l => l.show).map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={clsx(
                                    "flex items-center justify-center px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium whitespace-nowrap",
                                    isActive
                                        ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
                                        : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800"
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {session && (
                        <>
                            <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />
                            <Link
                                href="/itineraries/new"
                                className="flex items-center justify-center px-4 py-2 rounded-full bg-blue-500 text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 hover:shadow-lg transition-all text-sm font-medium whitespace-nowrap"
                            >
                                New Trip
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </>
    );
}
