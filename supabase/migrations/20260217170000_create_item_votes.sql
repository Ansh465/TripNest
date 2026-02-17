-- Create itinerary_item_votes table
create table public.itinerary_item_votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  itinerary_item_id uuid references public.itinerary_items(id) on delete cascade not null,
  vote_type int not null check (vote_type in (1, -1)),
  created_at timestamptz default now(),
  unique(user_id, itinerary_item_id)
);

-- Enable RLS
alter table public.itinerary_item_votes enable row level security;

-- Policies

-- 1. View votes
-- Visible if the item (and thus itinerary) is visible
create policy "Votes are viewable if item is viewable." on public.itinerary_item_votes for select using (
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = itinerary_item_votes.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

-- 2. Create/Update/Delete votes
-- Users can vote if they can view the itinerary (collaborative voting usually implies public or shared, let's allow public voting for now or restricted?
-- The prompt said "Collaborative Voting". Usually means invited users.
-- But currently we only have "Public" or "Private".
-- Let's allow voting on PUBLIC itineraries by ANY authenticated user, and on PRIVATE itineraries only by OWNER (which is moot but consistent).
create policy "Authenticated users can vote on visible items." on public.itinerary_item_votes for insert with check (
  auth.role() = 'authenticated' and
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = itinerary_item_votes.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

create policy "Users can update own votes." on public.itinerary_item_votes for update using (
  auth.uid() = user_id
);

create policy "Users can delete own votes." on public.itinerary_item_votes for delete using (
  auth.uid() = user_id
);
