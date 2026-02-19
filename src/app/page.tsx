import { AnimatedBackground } from "@/components/ui/animated-background";
import { createClient } from "@/lib/supabase-server";
import { GuestLanding } from "@/components/home/guest-landing";
import { DashboardView } from "@/components/dashboard/dashboard-view";

import { Database } from "@/types/supabase";

type Trip = Database['public']['Tables']['itineraries']['Row'];
type TrendingTrip = Trip & { owner: { full_name: string | null; avatar_url: string | null } | null };

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  let recentTrips: Trip[] = [];
  let trendingTrips: TrendingTrip[] = [];

  if (session) {
    // Fetch User's Recent Trips
    const { data: recent } = await supabase
      .from('itineraries')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })
      .limit(3);
    recentTrips = recent as Trip[] || [];

    // Fetch Trending Public Trips
    const { data: trending } = await supabase
      .from('itineraries')
      .select('*, owner:users(full_name, avatar_url)')
      .eq('public', true)
      .neq('user_id', session.user.id)
      .order('upvotes', { ascending: false })
      .limit(3);
    trendingTrips = trending as any as TrendingTrip[] || [];
  }

  return (
    <div className="relative flex flex-col min-h-screen text-neutral-50 font-[family-name:var(--font-geist-sans)] overflow-x-hidden selection:bg-blue-500/30">
      <AnimatedBackground />

      {session ? (
        <DashboardView
          recentTrips={recentTrips}
          trendingTrips={trendingTrips}
        />
      ) : (
        <GuestLanding />
      )}
    </div>
  );
}
