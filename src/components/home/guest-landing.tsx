import Link from "next/link";
import { User } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturesSection } from "@/components/home/features-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { Footer } from "@/components/layout/footer";

export function GuestLanding() {
    return (
        <>


            <main className="flex-1 w-full flex flex-col items-center justify-center">
                <HeroSection />
                <FeaturesSection />
                <HowItWorks />
                <Footer />
            </main>
        </>
    );
}
