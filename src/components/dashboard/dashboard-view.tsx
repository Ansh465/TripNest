import { HeroSection } from "@/components/home/hero-section";
import { BentoGrid } from "@/components/dashboard/bento-grid";
import { RecentTrips } from "@/components/dashboard/recent-trips";
import { TrendingTrips } from "@/components/dashboard/trending-trips";

interface DashboardViewProps {
    recentTrips: any[];
    trendingTrips: any[];
}

import { Footer } from "@/components/layout/footer";

export function DashboardView({ recentTrips, trendingTrips }: DashboardViewProps) {
    return (
        <>
            <main className="flex-1 w-full flex flex-col items-center justify-center">
                <HeroSection />
                <BentoGrid />
                <RecentTrips itineraries={recentTrips} />
                <TrendingTrips itineraries={trendingTrips} />
            </main>
            <Footer />
        </>
    );
}
