
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function verify() {
    const { count: itinCount } = await supabase.from('itineraries').select('*', { count: 'exact', head: true });
    const { count: placeCount } = await supabase.from('places').select('*', { count: 'exact', head: true });
    const { count: itemCount } = await supabase.from('itinerary_items').select('*', { count: 'exact', head: true });

    console.log(`Itineraries: ${itinCount}`);
    console.log(`Places: ${placeCount}`);
    console.log(`Itinerary Items: ${itemCount}`);
}

verify();
