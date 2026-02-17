-- Add budget to itineraries
alter table public.itineraries 
add column budget numeric default 0,
add column currency text default 'USD';

-- Create expenses table
create table public.expenses (
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

-- Policies
create policy "Expenses viewable by itinerary owner or public." on public.expenses for select using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and (itineraries.public = true or itineraries.owner_id = auth.uid())
  )
);

create policy "Expenses insertable by itinerary owner." on public.expenses for insert with check (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

create policy "Expenses updatable by itinerary owner." on public.expenses for update using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);

create policy "Expenses deletable by itinerary owner." on public.expenses for delete using (
  exists (
    select 1 from public.itineraries
    where itineraries.id = expenses.itinerary_id
    and itineraries.owner_id = auth.uid()
  )
);
