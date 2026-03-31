-- Consolidated Migration Script for Itero

-- 1. Initial Schema (Users, Places, Itineraries, Items)
-- Create users table (public profile)
create table if not exists public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
drop policy if exists "Public profiles are viewable by everyone." on public.users;
create policy "Public profiles are viewable by everyone." on public.users for select using (true);

drop policy if exists "Users can update their own profile." on public.users;
create policy "Users can update their own profile." on public.users for update using (auth.uid() = id);

-- Create places table
create table if not exists public.places (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  lat float not null,
  lon float not null,
  country text,
  city text,
  description text,
  image_url text,
  source text,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

alter table public.places enable row level security;
drop policy if exists "Places are viewable by everyone." on public.places;
create policy "Places are viewable by everyone." on public.places for select using (true);

drop policy if exists "Authenticated users can create places." on public.places;
create policy "Authenticated users can create places." on public.places for insert with check (auth.role() = 'authenticated');

drop policy if exists "Users can update their own places." on public.places;
create policy "Users can update their own places." on public.places for update using (auth.uid() = created_by);

-- Create itineraries table
create table if not exists public.itineraries (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique,
  description text,
  public boolean default false,
  owner_id uuid references public.users(id) not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  upvotes int default 0
);

alter table public.itineraries enable row level security;
drop policy if exists "Public itineraries are viewable by everyone." on public.itineraries;
create policy "Public itineraries are viewable by everyone." on public.itineraries for select using (public = true);

drop policy if exists "Users can view own itineraries." on public.itineraries;
create policy "Users can view own itineraries." on public.itineraries for select using (auth.uid() = owner_id);

drop policy if exists "Users can insert own itineraries." on public.itineraries;
create policy "Users can insert own itineraries." on public.itineraries for insert with check (auth.uid() = owner_id);

drop policy if exists "Users can update own itineraries." on public.itineraries;
create policy "Users can update own itineraries." on public.itineraries for update using (auth.uid() = owner_id);

drop policy if exists "Users can delete own itineraries." on public.itineraries;
create policy "Users can delete own itineraries." on public.itineraries for delete using (auth.uid() = owner_id);

-- Create itinerary_items table
create table if not exists public.itinerary_items (
  id uuid default gen_random_uuid() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  place_id uuid references public.places(id) on delete cascade not null,
  day_number int not null,
  order_in_day int not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.itinerary_items enable row level security;

drop policy if exists "Itinerary items are viewable if itinerary is viewable." on public.itinerary_items;
create policy "Itinerary items are viewable if itinerary is viewable." on public.itinerary_items for select using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_items.itinerary_id
    and (public = true or owner_id = auth.uid())
  )
);

drop policy if exists "Users can insert items to own itineraries." on public.itinerary_items;
create policy "Users can insert items to own itineraries." on public.itinerary_items for insert with check (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);

drop policy if exists "Users can update items in own itineraries." on public.itinerary_items;
create policy "Users can update items in own itineraries." on public.itinerary_items for update using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);

drop policy if exists "Users can delete items from own itineraries." on public.itinerary_items;
create policy "Users can delete items from own itineraries." on public.itinerary_items for delete using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);

-- Config function to handle updated_at
create extension if not exists moddatetime schema extensions;

drop trigger if exists handle_updated_at on public.itineraries;
create trigger handle_updated_at before update on public.itineraries
  for each row execute procedure moddatetime (updated_at);

-- Handle user creation via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Fix Users RLS
drop policy if exists "Users can insert their own profile." on public.users;
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);

-- 3. Add Users columns
alter table public.users add column if not exists updated_at timestamptz default now();
alter table public.users add column if not exists bio text;

-- 4. Journal Entries
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  itinerary_item_id uuid references public.itinerary_items(id) on delete cascade not null,
  user_id uuid references public.users(id) not null,
  content text,
  photo_url text, 
  created_at timestamptz default now()
);

alter table public.journal_entries enable row level security;

drop policy if exists "Journal entries are viewable if itinerary is public or owner." on public.journal_entries;
create policy "Journal entries are viewable if itinerary is public or owner." on public.journal_entries for select using (
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = journal_entries.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

drop policy if exists "Users can populate own journal entries." on public.journal_entries;
create policy "Users can populate own journal entries." on public.journal_entries for insert with check (
  auth.uid() = user_id
);

drop policy if exists "Users can update own journal entries." on public.journal_entries;
create policy "Users can update own journal entries." on public.journal_entries for update using (
  auth.uid() = user_id
);

drop policy if exists "Users can delete own journal entries." on public.journal_entries;
create policy "Users can delete own journal entries." on public.journal_entries for delete using (
  auth.uid() = user_id
);

-- 5. Expenses
alter table public.itineraries add column if not exists budget numeric default 0;
alter table public.itineraries add column if not exists currency text default 'USD';

create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  itinerary_item_id uuid references public.itinerary_items(id) on delete set null,
  amount numeric not null,
  category text not null check (category in ('Accommodation', 'Food', 'Transport', 'Activity', 'Other')),
  description text,
  date date default CURRENT_DATE,
  created_at timestamptz default now()
);

alter table public.expenses enable row level security;

drop policy if exists "Expenses viewable by itinerary owner or public." on public.expenses;
create policy "Expenses viewable by itinerary owner or public." on public.expenses for select using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

drop policy if exists "Expenses insertable by itinerary owner." on public.expenses;
create policy "Expenses insertable by itinerary owner." on public.expenses for insert with check (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

drop policy if exists "Expenses updatable by itinerary owner." on public.expenses;
create policy "Expenses updatable by itinerary owner." on public.expenses for update using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

drop policy if exists "Expenses deletable by itinerary owner." on public.expenses;
create policy "Expenses deletable by itinerary owner." on public.expenses for delete using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

-- 6. Packing Items
create table if not exists public.packing_items (
  id uuid default gen_random_uuid() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  item_name text not null,
  is_checked boolean default false,
  category text default 'General',
  created_at timestamptz default now()
);

alter table public.packing_items enable row level security;

drop policy if exists "Packing items viewable by itinerary owner or public." on public.packing_items;
create policy "Packing items viewable by itinerary owner or public." on public.packing_items for select using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = packing_items.itinerary_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

drop policy if exists "Packing items manage by itinerary owner." on public.packing_items;
create policy "Packing items manage by itinerary owner." on public.packing_items for all using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = packing_items.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

-- 7. Item Votes
create table if not exists public.itinerary_item_votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  itinerary_item_id uuid references public.itinerary_items(id) on delete cascade not null,
  vote_type int not null check (vote_type in (1, -1)),
  created_at timestamptz default now(),
  unique(user_id, itinerary_item_id)
);

alter table public.itinerary_item_votes enable row level security;

drop policy if exists "Votes are viewable if item is viewable." on public.itinerary_item_votes;
create policy "Votes are viewable if item is viewable." on public.itinerary_item_votes for select using (
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = itinerary_item_votes.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

drop policy if exists "Authenticated users can vote on visible items." on public.itinerary_item_votes;
create policy "Authenticated users can vote on visible items." on public.itinerary_item_votes for insert with check (
  auth.role() = 'authenticated' and
  exists (
    select 1 from public.itinerary_items
    join public.itineraries on itinerary_items.itinerary_id = itineraries.id
    where itinerary_items.id = itinerary_item_votes.itinerary_item_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

drop policy if exists "Users can update own votes." on public.itinerary_item_votes;
create policy "Users can update own votes." on public.itinerary_item_votes for update using (
  auth.uid() = user_id
);

drop policy if exists "Users can delete own votes." on public.itinerary_item_votes;
create policy "Users can delete own votes." on public.itinerary_item_votes for delete using (
  auth.uid() = user_id
);
