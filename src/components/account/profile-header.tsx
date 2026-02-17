"use client";

import { User } from "@supabase/supabase-js";
import { Map, ThumbsUp, Edit2 } from "lucide-react";

interface ProfileHeaderProps {
    user: User;
    profile: {
        full_name: string | null;
        avatar_url: string | null;
        bio: string | null;
    } | null;
    stats: {
        itineraries: number;
        upvotes: number;
    };
    onEditProfile: () => void;
}

export function ProfileHeader({ user, profile, stats, onEditProfile }: ProfileHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            {/* Avatar */}
            <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-neutral-950 shadow-lg">
                    {profile?.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.full_name || "User"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl text-neutral-400 font-bold">
                            {(profile?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                        </span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent">
                        {profile?.full_name || "Traveler"}
                    </h1>
                    <button
                        onClick={onEditProfile}
                        className="px-4 py-1.5 text-sm font-medium rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Profile
                    </button>
                </div>

                <p className="text-neutral-600 dark:text-neutral-400 max-w-lg md:text-lg leading-relaxed">
                    {profile?.bio || "No bio yet. Tell the world about your travels!"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start gap-8 pt-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                            <Map className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold leading-none">{stats.itineraries}</p>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Itineraries</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                            <ThumbsUp className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <p className="text-lg font-bold leading-none">{stats.upvotes}</p>
                            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Upvotes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
