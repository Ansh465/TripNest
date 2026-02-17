import { Map, Plus, Globe, User } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "@/components/ui/tilt-card";

export function BentoGrid() {
    const features = [
        {
            title: "My Itineraries",
            description: "Manage your trips.",
            icon: Map,
            href: "/itineraries",
            color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            className: "md:col-span-2 md:row-span-2",
            iconSize: "w-12 h-12"
        },
        {
            title: "Create New",
            description: "Start fresh.",
            icon: Plus,
            href: "/itineraries/new",
            color: "bg-green-500/10 text-green-400 border-green-500/20",
            className: "md:col-span-1 md:row-span-1",
            iconSize: "w-8 h-8"
        },
        {
            title: "Explore",
            description: "Discover community trips.",
            icon: Globe,
            href: "/explore",
            color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
            className: "md:col-span-1 md:row-span-2",
            iconSize: "w-12 h-12"
        },
        {
            title: "Profile",
            description: "Your stats.",
            icon: User,
            href: "/account",
            color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
            className: "md:col-span-1 md:row-span-1",
            iconSize: "w-8 h-8"
        },
    ];

    return (
        <section className="w-full max-w-5xl px-6 py-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[180px]">
                {features.map((feature) => (
                    <TiltCard key={feature.href} className={`h-full ${feature.className}`}>
                        <Link
                            href={feature.href}
                            className="group relative h-full p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-blue-500/10 hover:border-white/20 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={`p-3 w-fit rounded-2xl ${feature.color} ring-1 ring-inset ring-white/10 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className={feature.iconSize} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-xl text-neutral-100 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        </Link>
                    </TiltCard>
                ))}
            </div>
        </section>
    );
}
