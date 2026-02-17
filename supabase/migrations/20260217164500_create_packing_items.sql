-- Create packing_items table
create table public.packing_items (
  id uuid default gen_random_uuid() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  item_name text not null,
  is_checked boolean default false,
  category text default 'General',
  created_at timestamptz default now()
);

alter table public.packing_items enable row level security;

-- Policies
create policy "Packing items viewable by itinerary owner or public." on public.packing_items for select using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = packing_items.itinerary_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

create policy "Packing items manage by itinerary owner." on public.packing_items for all using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = packing_items.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);
