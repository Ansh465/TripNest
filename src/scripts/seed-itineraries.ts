
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    "Giethoorn": { lat: 52.7397, lon: 6.0772 },
    "Coober Pedy": { lat: -29.0135, lon: 134.7544 },
    "Shirakawa-go": { lat: 36.2559, lon: 136.9066 },
    "Matera": { lat: 40.6633, lon: 16.6075 },
    "Longyearbyen": { lat: 78.2232, lon: 15.6267 },
    "Huacachina": { lat: -14.0875, lon: -75.7626 },
    "Chefchaouen": { lat: 35.1716, lon: -5.2697 },
    "Tokyo": { lat: 35.6762, lon: 139.6503 },
    "Paris": { lat: 48.8566, lon: 2.3522 },
    "New York City": { lat: 40.7128, lon: -74.0060 },
    "Rome": { lat: 41.9028, lon: 12.4964 },
    "Cape Town": { lat: -33.9249, lon: 18.4241 },
    "Sydney": { lat: -33.8688, lon: 151.2093 },
};

const RAW_DATA = `Tokyo,Japan,1,09:00 AM,Temple,Senso-ji Temple,Asakusa Taito City,Explore Tokyo oldest temple
Tokyo,Japan,1,01:00 PM,Viewpoint,Tokyo Skytree,Oshiage Sumida City,Take in the 360-degree views
Tokyo,Japan,1,05:00 PM,Culture,Akihabara,Chiyoda City,Browse electronics and anime shops
Tokyo,Japan,2,10:00 AM,Landmark,Shibuya Crossing,Shibuya City,Walk the busy intersection
Tokyo,Japan,2,01:00 PM,Shopping,Takeshita Street,Harajuku,Try local crepes and browse fashion
Tokyo,Japan,2,06:00 PM,Dining,Omoide Yokocho,Shinjuku,Enjoy yakitori in narrow alleyways
Tokyo,Japan,3,09:00 AM,Food,Tsukiji Outer Market,Chuo City,Sample fresh seafood for breakfast
Tokyo,Japan,3,01:00 PM,Museum,teamLab Planets,Toyosu Koto City,Immersive digital art exhibition
Tokyo,Japan,3,05:00 PM,Shopping,Ginza Six,Ginza Chuo City,Upscale shopping and architecture
Paris,France,1,09:00 AM,Landmark,Eiffel Tower,Champ de Mars Paris,Arrive early for the elevator
Paris,France,1,01:30 PM,Museum,Louvre Museum,Rue de Rivoli Paris,See the Mona Lisa and classical art
Paris,France,1,05:00 PM,Leisure,Seine River Cruise,Port de la Bourdonnais,Sunset boat ride along the river
Paris,France,2,10:00 AM,History,Sacre-Coeur Basilica,Montmartre Paris,Panoramic city views from the hill
Paris,France,2,01:00 PM,Leisure,Place du Tertre,Montmartre Paris,Watch local artists paint
Paris,France,2,04:00 PM,Museum,Musee d'Orsay,Esplanade Valery Giscard d'Estaing,Impressionist art collection
Paris,France,3,09:00 AM,History,Palace of Versailles,Place d'Armes Versailles,Half-day trip to the royal palace
Paris,France,3,03:00 PM,Landmark,Arc de Triomphe,Place Charles de Gaulle,Climb to the top for city views
Paris,France,3,06:00 PM,Shopping,Champs-Elysees,Avenue des Champs-Elysees,Evening stroll down the famous avenue
New York City,USA,1,09:00 AM,Landmark,Statue of Liberty,Liberty Island NY,Morning ferry from Battery Park
New York City,USA,1,01:00 PM,History,9/11 Memorial & Museum,180 Greenwich St NY,Pay respects and view the exhibits
New York City,USA,1,05:00 PM,Landmark,Brooklyn Bridge,Brooklyn Bridge NY,Walk across at golden hour
New York City,USA,2,10:00 AM,Park,Central Park,New York NY,Rent bikes and explore Bethesda Terrace
New York City,USA,2,02:00 PM,Museum,The Metropolitan Museum of Art,1000 5th Ave NY,Explore massive global art collections
New York City,USA,2,07:00 PM,Entertainment,Times Square,Manhattan NY,See the bright lights and catch a show
New York City,USA,3,10:00 AM,Park,The High Line,Gansevoort St to 34th St,Walk the elevated linear park
New York City,USA,3,12:30 PM,Food,Chelsea Market,75 9th Ave NY,Grab lunch from indoor food stalls
New York City,USA,3,04:00 PM,Viewpoint,Top of the Rock,30 Rockefeller Plaza NY,Enjoy sunset views of the Empire State Building
Rome,Italy,1,09:00 AM,History,Colosseum,Piazza del Colosseo Roma,Guided tour of ancient gladiator arena
Rome,Italy,1,12:00 PM,History,Roman Forum,Via della Salara Vecchia Roma,Walk the ruins of downtown ancient Rome
Rome,Italy,1,04:00 PM,Landmark,Pantheon,Piazza della Rotonda Roma,See the famous domed ceiling
Rome,Italy,2,08:30 AM,Museum,Vatican Museums,Viale Vaticano Roma,See the Sistine Chapel early
Rome,Italy,2,12:00 PM,Landmark,St. Peter's Basilica,Piazza San Pietro,Climb the dome for square views
Rome,Italy,2,05:00 PM,Leisure,Piazza Navona,Piazza Navona Roma,Dinner and street performers by the fountains
Rome,Italy,3,10:00 AM,Leisure,Trevi Fountain,Piazza di Trevi Roma,Toss a coin to ensure a return trip
Rome,Italy,3,12:30 PM,Landmark,Spanish Steps,Piazza di Spagna Roma,Climb the steps to the church
Rome,Italy,3,03:00 PM,Park,Villa Borghese,Piazzale Napoleone Roma,Rent a rowboat in the park gardens
Cape Town,South Africa,1,08:30 AM,Nature,Table Mountain,Tafelberg Rd Cape Town,Take the cable car up for city views
Cape Town,South Africa,1,01:00 PM,Culture,Bo-Kaap,Wale St Cape Town,Walk among the brightly painted houses
Cape Town,South Africa,1,04:00 PM,Leisure,V&A Waterfront,19 Dock Rd Cape Town,Shopping and dinner by the harbor
Cape Town,South Africa,2,09:00 AM,Nature,Cape Point Nature Reserve,Cape Peninsula,Hike to the lighthouse
Cape Town,South Africa,2,01:00 PM,Nature,Boulders Beach,Kleintuin Rd Simon's Town,See the local African penguin colony
Cape Town,South Africa,2,05:00 PM,Leisure,Camps Bay Beach,Victoria Rd Camps Bay,Watch the sunset over the ocean
Cape Town,South Africa,3,09:00 AM,History,Robben Island,Nelson Mandela Gateway,Ferry ride and historical prison tour
Cape Town,South Africa,3,02:00 PM,Nature,Kirstenbosch Botanical Gardens,Rhodes Dr Newlands,Walk the treetop canopy bridge
Cape Town,South Africa,3,06:00 PM,Food,Mojo Market,30 Regent Rd Sea Point,Live music and diverse street food
Sydney,Australia,1,09:00 AM,Landmark,Sydney Opera House,Bennelong Point Sydney,Take a guided architecture tour
Sydney,Australia,1,12:00 PM,Nature,Royal Botanic Garden,Mrs Macquaries Rd Sydney,Picnic lunch with harbour views
Sydney,Australia,1,03:00 PM,Landmark,Sydney Harbour Bridge,Sydney Harbour Bridge,Do the bridge climb or walk the pedestrian path
Sydney,Australia,2,09:00 AM,Nature,Bondi Beach,Bondi Beach Sydney,Morning surf or swim
Sydney,Australia,2,11:00 AM,Nature,Bondi to Coogee Coastal Walk,Bondi to Coogee,Scenic cliffside walking trail
Sydney,Australia,2,04:00 PM,Leisure,Darling Harbour,Sydney NSW,Waterfront dining and entertainment
Sydney,Australia,3,09:30 AM,Nature,Taronga Zoo,Bradleys Head Rd Mosman,Ferry ride to see native Australian wildlife
Sydney,Australia,3,02:00 PM,Culture,The Rocks,The Rocks Sydney,Explore historic laneways and pubs
Sydney,Australia,3,06:00 PM,Viewpoint,Sydney Tower Eye,100 Market St Sydney,Sunset views from the observation deck`;

interface PlaceData {
    city: string;
    country: string;
    day: number;
    time: string;
    type: string;
    place_name: string;
    address: string;
    notes: string;
}

async function main() {
    console.log('Seeding itineraries...');

    // 1. Get a valid user
    // Try to find a user, or create one if none exist?
    // We can select from auth.users, but service_role can access public tables mostly.
    // Actually, inserting into itineraries requires a valid owner_id (FK to auth.users).
    // We need to fetch an existing user.
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

    if (userError || !users || users.length === 0) {
        console.error('No users found. Please sign up a user first or check Supabase connection.');
        process.exit(1);
    }

    const user = users[0]; // Use the first user found
    console.log(`Using user: ${user.email} (${user.id})`);

    // 2. Parse Data
    const lines = RAW_DATA.split('\n');
    const items: PlaceData[] = lines.map(line => {
        // Simple CSV split (handling standard csv with no quotes for now as per data)
        const parts = line.split(',');
        return {
            city: parts[0].trim(),
            country: parts[1].trim(),
            day: parseInt(parts[2].trim()),
            time: parts[3].trim(),
            type: parts[4].trim(),
            place_name: parts[5].trim(),
            address: parts[6].trim(),
            notes: parts.slice(7).join(',').trim() // Handle potential commas in notes if split went too far
        };
    });

    // 3. Group by City
    const itinerariesMap: Record<string, PlaceData[]> = {};
    items.forEach(item => {
        if (!itinerariesMap[item.city]) {
            itinerariesMap[item.city] = [];
        }
        itinerariesMap[item.city].push(item);
    });

    // 4. Create Itineraries and Items
    for (const [city, cityItems] of Object.entries(itinerariesMap)) {
        console.log(`Creating itinerary for: ${city}`);
        const country = cityItems[0].country;
        const days = Math.max(...cityItems.map(i => i.day));

        // Create Itinerary
        const { data: itinerary, error: itinError } = await supabase
            .from('itineraries')
            .insert({
                title: `Explore ${country}`, // Or "Explore Giethoorn, Netherlands"
                description: `A ${days}-day adventure in ${city}, ${country}. Enjoy the local culture, history, and sights.`,
                owner_id: user.id,
                public: true,
                slug: `explore-${city.toLowerCase().replace(/\s+/g, '-')}`
            })
            .select()
            .single();

        if (itinError) {
            console.error(`Error creating itinerary for ${city}:`, itinError);
            continue;
        }

        // Process Items
        for (const [index, item] of cityItems.entries()) {
            // Create or Find Place
            // Lat/Lon
            const coords = CITY_COORDS[city] || { lat: 0, lon: 0 };

            // We can insert place. We use upsert on name? Or just insert new one. 
            // Simple insert for now.
            const { data: place, error: placeError } = await supabase
                .from('places')
                .insert({
                    name: item.place_name,
                    city: item.city,
                    country: item.country,
                    lat: coords.lat + (Math.random() * 0.01 - 0.005), // Jitter slightly so markers don't overlap perfectly
                    lon: coords.lon + (Math.random() * 0.01 - 0.005),
                    created_by: user.id
                })
                .select()
                .single();

            if (placeError) {
                console.error(`Error creating place ${item.place_name}:`, placeError);
                continue;
            }

            // Add to Itinerary Items
            const { error: itemError } = await supabase
                .from('itinerary_items')
                .insert({
                    itinerary_id: itinerary.id,
                    place_id: place.id,
                    day_number: item.day,
                    order_in_day: index, // Simplified order based on CSV order
                    notes: item.notes + ` (${item.time})` // Append time to notes for now
                });

            if (itemError) {
                console.error(`Error adding item ${item.place_name}:`, itemError);
            }
        }
    }

    console.log('Seeding complete!');
}

main().catch(console.error);
