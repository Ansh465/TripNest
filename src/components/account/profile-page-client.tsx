"use client";

import { useState, useCallback, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import AccountForm from "@/components/account/account-form";
import { ProfileHeader } from "@/components/account/profile-header";
import { ItineraryGrid } from "@/components/account/itinerary-grid";
import { Loader2 } from "lucide-react";

export default function ProfilePageClient({ user }: { user: User }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState({ itineraries: 0, upvotes: 0 });
    const [itineraries, setItineraries] = useState<any[]>([]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            // 1. Fetch Profile
            const { data: profileData } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single();

            setProfile(profileData);

            // 2. Fetch Itineraries
            const { data: itinerariesData, count } = await supabase
                .from("itineraries")
                .select("*", { count: "exact" })
                .eq("owner_id", user.id)
                .order("created_at", { ascending: false });

            setItineraries(itinerariesData || []);

            // 3. Calculate Stats (Total upvotes)
            const totalUpvotes = itinerariesData?.reduce((acc: number, curr: any) => acc + (curr.upvotes || 0), 0) || 0;

            setStats({
                itineraries: count || 0,
                upvotes: totalUpvotes,
            });

        } catch (error) {
            console.error("Error fetching profile data:", error);
        } finally {
            setLoading(false);
        }
    }, [user.id, supabase]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = () => {
        fetchData();
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    return (
        <div className="container max-w-5xl mx-auto pt-32 pb-12 px-4 md:px-6">
            <div className="mb-12">
                {isEditing ? (
                    <div className="max-w-2xl mx-auto bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <button onClick={() => setIsEditing(false)} className="text-sm text-neutral-500 hover:text-neutral-900">Cancel</button>
                        </div>
                        <AccountForm user={user} onUpdate={handleUpdate} />
                    </div>
                ) : (
                    <ProfileHeader
                        user={user}
                        profile={profile}
                        stats={stats}
                        onEditProfile={() => setIsEditing(true)}
                    />
                )}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-12">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Public Itineraries
                    <span className="text-sm font-normal text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
                        {stats.itineraries}
                    </span>
                </h2>

                <ItineraryGrid itineraries={itineraries} />
            </div>
        </div>
    );
}
