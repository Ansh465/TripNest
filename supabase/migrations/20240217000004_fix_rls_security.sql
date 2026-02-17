-- Fix RLS Performance Issues (auth.uid() re-evaluation)

-- 1. Optimizing USERS policies
DROP POLICY IF EXISTS "Users can update their own profile." ON public.users;
CREATE POLICY "Users can update their own profile." ON public.users FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.users;
CREATE POLICY "Users can insert their own profile." ON public.users FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- 2. Optimizing PLACES policies
-- Note: 'Authenticated users can create places' uses auth.role(), which might not need optimization, but 'Users can update their own places' does.
DROP POLICY IF EXISTS "Users can update their own places." ON public.places;
CREATE POLICY "Users can update their own places." ON public.places FOR UPDATE USING ((select auth.uid()) = created_by);

-- 3. Optimizing ITINERARIES policies (Consolidating permissive policies)
-- Drop existing individual policies
DROP POLICY IF EXISTS "Public itineraries are viewable by everyone." ON public.itineraries;
DROP POLICY IF EXISTS "Users can view own itineraries." ON public.itineraries;
DROP POLICY IF EXISTS "Collaborators can view itineraries" ON public.itineraries;

-- Combine into one optimized SELECT policy
CREATE POLICY "View itineraries (Public, Own, or Collaborator)" ON public.itineraries FOR SELECT USING (
    public = true 
    OR 
    owner_id = (select auth.uid())
    OR
    exists (
        select 1 from itinerary_collaborators 
        where itinerary_id = itineraries.id 
        and user_id = (select auth.uid())
    )
);

-- Optimize modification policies
DROP POLICY IF EXISTS "Users can insert own itineraries." ON public.itineraries;
CREATE POLICY "Users can insert own itineraries." ON public.itineraries FOR INSERT WITH CHECK ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Users can update own itineraries." ON public.itineraries;
CREATE POLICY "Users can update own itineraries." ON public.itineraries FOR UPDATE USING ((select auth.uid()) = owner_id);

DROP POLICY IF EXISTS "Collaborators can update itineraries" ON public.itineraries;
CREATE POLICY "Collaborators can update itineraries" ON public.itineraries FOR UPDATE USING (
    exists (
        select 1 from itinerary_collaborators 
        where itinerary_id = itineraries.id 
        and user_id = (select auth.uid())
        and role = 'editor'
    )
);

DROP POLICY IF EXISTS "Users can delete own itineraries." ON public.itineraries;
CREATE POLICY "Users can delete own itineraries." ON public.itineraries FOR DELETE USING ((select auth.uid()) = owner_id);


-- 4. Optimizing ITINERARY_ITEMS policies
-- Drop old policies
DROP POLICY IF EXISTS "Itinerary items are viewable if itinerary is viewable." ON public.itinerary_items;
DROP POLICY IF EXISTS "Collaborators can view items" ON public.itinerary_items;

-- Recreate optimized SELECT policy
CREATE POLICY "View items (Itinerary Access)" ON public.itinerary_items FOR SELECT USING (
    exists (
        select 1 from public.itineraries
        where id = itinerary_items.itinerary_id
        and (
            public = true 
            or owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
            )
        )
    )
);

-- Optimize modification policies (Owner OR Editor)
DROP POLICY IF EXISTS "Users can insert items to own itineraries." ON public.itinerary_items;
DROP POLICY IF EXISTS "Collaborators can insert items" ON public.itinerary_items;

CREATE POLICY "Insert items (Owner or Editor)" ON public.itinerary_items FOR INSERT WITH CHECK (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

DROP POLICY IF EXISTS "Users can update items in own itineraries." ON public.itinerary_items;
DROP POLICY IF EXISTS "Collaborators can update items" ON public.itinerary_items;

CREATE POLICY "Update items (Owner or Editor)" ON public.itinerary_items FOR UPDATE USING (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

DROP POLICY IF EXISTS "Users can delete items from own itineraries." ON public.itinerary_items;
DROP POLICY IF EXISTS "Collaborators can delete items" ON public.itinerary_items;

CREATE POLICY "Delete items (Owner or Editor)" ON public.itinerary_items FOR DELETE USING (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

-- 5. Optimizing EXPENSES policies
-- (Assuming standard Owner/Public logic similar to items)
DROP POLICY IF EXISTS "Expenses viewable by itinerary owner or public." ON public.expenses;
CREATE POLICY "View expenses (Itinerary Access)" ON public.expenses FOR SELECT USING (
    exists (
        select 1 from public.itineraries
        where id = expenses.itinerary_id
        and (
            public = true 
            or owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
            )
        )
    )
);

DROP POLICY IF EXISTS "Expenses insertable by itinerary owner." ON public.expenses;
CREATE POLICY "Insert expenses (Owner or Editor)" ON public.expenses FOR INSERT WITH CHECK (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

DROP POLICY IF EXISTS "Expenses updatable by itinerary owner." ON public.expenses;
CREATE POLICY "Update expenses (Owner or Editor)" ON public.expenses FOR UPDATE USING (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

DROP POLICY IF EXISTS "Expenses deletable by itinerary owner." ON public.expenses;
CREATE POLICY "Delete expenses (Owner or Editor)" ON public.expenses FOR DELETE USING (
    exists (
        select 1 from public.itineraries
        where id = itinerary_id
        and (
            owner_id = (select auth.uid())
            or exists (
                select 1 from itinerary_collaborators 
                where itinerary_id = itineraries.id 
                and user_id = (select auth.uid())
                and role = 'editor'
            )
        )
    )
);

-- 6. Optimizing ITINERARY COLLABORATORS policies
DROP POLICY IF EXISTS "Owners can manage collaborators" ON itinerary_collaborators;
CREATE POLICY "Owners can manage collaborators" ON itinerary_collaborators USING (
    exists (
        select 1 from itineraries 
        where id = itinerary_collaborators.itinerary_id 
        and owner_id = (select auth.uid())
    )
);

DROP POLICY IF EXISTS "Collaborators can view list" ON itinerary_collaborators;
CREATE POLICY "Collaborators can view list" ON itinerary_collaborators FOR SELECT USING (
    user_id = (select auth.uid()) OR
    exists (
        select 1 from itineraries 
        where id = itinerary_collaborators.itinerary_id 
        and owner_id = (select auth.uid())
    )
);
