-- Create users table (public profile)
create table public.users (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
create policy "Public profiles are viewable by everyone." on public.users for select using (true);
create policy "Users can update their own profile." on public.users for update using (auth.uid() = id);

-- Create places table
create table public.places (
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
create policy "Places are viewable by everyone." on public.places for select using (true);
create policy "Authenticated users can create places." on public.places for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own places." on public.places for update using (auth.uid() = created_by);

-- Create itineraries table
create table public.itineraries (
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
create policy "Public itineraries are viewable by everyone." on public.itineraries for select using (public = true);
create policy "Users can view own itineraries." on public.itineraries for select using (auth.uid() = owner_id);
create policy "Users can insert own itineraries." on public.itineraries for insert with check (auth.uid() = owner_id);
create policy "Users can update own itineraries." on public.itineraries for update using (auth.uid() = owner_id);
create policy "Users can delete own itineraries." on public.itineraries for delete using (auth.uid() = owner_id);

-- Create itinerary_items table
create table public.itinerary_items (
  id uuid default gen_random_uuid() primary key,
  itinerary_id uuid references public.itineraries(id) on delete cascade not null,
  place_id uuid references public.places(id) on delete cascade not null,
  day_number int not null,
  order_in_day int not null,
  notes text,
  created_at timestamptz default now()
);

alter table public.itinerary_items enable row level security;
-- Items are viewable if the itinerary is viewable.
create policy "Itinerary items are viewable if itinerary is viewable." on public.itinerary_items for select using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_items.itinerary_id
    and (public = true or owner_id = auth.uid())
  )
);
-- Items are insertable/updatable if user owns the itinerary.
create policy "Users can insert items to own itineraries." on public.itinerary_items for insert with check (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);
create policy "Users can update items in own itineraries." on public.itinerary_items for update using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);
create policy "Users can delete items from own itineraries." on public.itinerary_items for delete using (
  exists (
    select 1 from public.itineraries
    where id = itinerary_id
    and owner_id = auth.uid()
  )
);

-- Config function to handle updated_at
create extension if not exists moddatetime schema extensions;

create trigger handle_updated_at before update on public.itineraries
  for each row execute procedure moddatetime (updated_at);

-- Handle user creation via trigger (optional but recommended)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
