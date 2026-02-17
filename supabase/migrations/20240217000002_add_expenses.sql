-- Add budget column to itineraries
ALTER TABLE itineraries ADD COLUMN IF NOT EXISTS budget numeric DEFAULT 0;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    itinerary_id uuid REFERENCES itineraries(id) ON DELETE CASCADE NOT NULL,
    amount numeric NOT NULL,
    category text NOT NULL,
    description text,
    date timestamptz DEFAULT now() NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- RLS Policies for expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view expenses for their itineraries" ON expenses
    FOR SELECT USING (
        exists (
            select 1 from itineraries 
            where id = expenses.itinerary_id 
            and owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expenses for their itineraries" ON expenses
    FOR INSERT WITH CHECK (
        exists (
            select 1 from itineraries 
            where id = expenses.itinerary_id 
            and owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expenses for their itineraries" ON expenses
    FOR UPDATE USING (
        exists (
            select 1 from itineraries 
            where id = expenses.itinerary_id 
            and owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expenses for their itineraries" ON expenses
    FOR DELETE USING (
        exists (
            select 1 from itineraries 
            where id = expenses.itinerary_id 
            and owner_id = auth.uid()
        )
    );
