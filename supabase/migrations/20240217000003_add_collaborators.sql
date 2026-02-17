-- Create itinerary_collaborators table
CREATE TABLE IF NOT EXISTS itinerary_collaborators (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    itinerary_id uuid REFERENCES itineraries(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    role text DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
    created_at timestamptz DEFAULT now(),
    UNIQUE(itinerary_id, user_id)
);

-- RLS Policies
ALTER TABLE itinerary_collaborators ENABLE ROW LEVEL SECURITY;

-- Owner can manage collaborators
CREATE POLICY "Owners can manage collaborators" ON itinerary_collaborators
    USING (
        exists (
            select 1 from itineraries 
            where id = itinerary_collaborators.itinerary_id 
            and owner_id = auth.uid()
        )
    );

-- Collaborators can view themselves
CREATE POLICY "Collaborators can view list" ON itinerary_collaborators
    FOR SELECT USING (
        user_id = auth.uid() OR
        exists (
            select 1 from itineraries 
            where id = itinerary_collaborators.itinerary_id 
            and owner_id = auth.uid()
        )
    );

-- Update Itinerary policies to allow collaborators to edit
-- Note: This requires updating existing policies on 'itineraries' and 'itinerary_items'
-- We'll assume standard RLS where we add an OR condition

CREATE POLICY "Collaborators can view itineraries" ON itineraries
    FOR SELECT USING (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itineraries.id 
            and user_id = auth.uid()
        )
    );

CREATE POLICY "Collaborators can update itineraries" ON itineraries
    FOR UPDATE USING (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itineraries.id 
            and user_id = auth.uid()
            and role = 'editor'
        )
    );

-- Same for items
CREATE POLICY "Collaborators can view items" ON itinerary_items
    FOR SELECT USING (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itinerary_items.itinerary_id 
            and user_id = auth.uid()
        )
    );

CREATE POLICY "Collaborators can insert items" ON itinerary_items
    FOR INSERT WITH CHECK (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itinerary_items.itinerary_id 
            and user_id = auth.uid()
            and role = 'editor'
        )
    );

CREATE POLICY "Collaborators can update items" ON itinerary_items
    FOR UPDATE USING (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itinerary_items.itinerary_id 
            and user_id = auth.uid()
            and role = 'editor'
        )
    );

CREATE POLICY "Collaborators can delete items" ON itinerary_items
    FOR DELETE USING (
        exists (
            select 1 from itinerary_collaborators 
            where itinerary_id = itinerary_items.itinerary_id 
            and user_id = auth.uid()
            and role = 'editor'
        )
    );
