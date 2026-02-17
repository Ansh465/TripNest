import { createClient } from '@/lib/supabase-server'
import { ExploreClient } from './explore-client'

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
    const supabase = await createClient()

    // Fetch public itineraries with owner details
    const { data: itineraries, error } = await supabase
        .from('itineraries')
        .select(`
            *,
            owner:users (
                full_name,
                avatar_url
            )
        `)
        .eq('public', true)
        .order('upvotes', { ascending: false })
        .limit(20)

    if (error) {
        console.error("Error fetching explore itineraries:", error)
    }

    return <ExploreClient itineraries={itineraries || []} />
}

