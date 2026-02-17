create table public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  itinerary_item_id uuid references public.itinerary_items(id) on delete cascade not null,
  user_id uuid references public.users(id) not null,
  content text,
  photo_url text, -- We will store the URL (e.g. from Unsplash or Supabase Storage)
  created_at timestamptz default now()
);

alter table public.journal_entries enable row level security;

create policy "Journal entries are viewable if itinerary is public or owner." on public.journal_entries for select using (
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = journal_entries.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

create policy "Users can populate own journal entries." on public.journal_entries for insert with check (
  auth.uid() = user_id
);

create policy "Users can update own journal entries." on public.journal_entries for update using (
  auth.uid() = user_id
);

create policy "Users can delete own journal entries." on public.journal_entries for delete using (
  auth.uid() = user_id
);
