-- Allow users to insert their own profile if it doesn't exist
create policy "Users can insert their own profile." on public.users for insert with check (auth.uid() = id);
