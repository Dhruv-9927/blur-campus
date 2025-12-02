-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  grad_year int,
  major text,
  gender text,
  interested_in text,
  blur_level int default 100,
  profile_pic_url text,
  prompts jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create matches table
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  user_a uuid references public.users(id) not null,
  user_b uuid references public.users(id) not null,
  match_score float,
  status text default 'active' check (status in ('active', 'unmatched', 'revealed')),
  message_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) not null,
  sender_id uuid references public.users(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
  )
);

create policy "Users can insert messages in their matches" on public.messages for insert with check (
  exists (
    select 1 from public.matches
    where matches.id = match_id
    and (matches.user_a = auth.uid() or matches.user_b = auth.uid())
  )
);

-- Trigger for message count
create or replace function public.increment_message_count()
returns trigger as $$
begin
  update public.matches
  set message_count = message_count + 1
  where id = new.match_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_message_sent
  after insert on public.messages
  for each row execute procedure public.increment_message_count();

-- Create Storage Bucket for Profiles
insert into storage.buckets (id, name, public) 
values ('profiles', 'profiles', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'profiles' );

  on storage.objects for insert
  with check ( bucket_id = 'profiles' );

-- Missing RLS Policies for Users
create policy "Users can update their own profile" 
  on public.users for update 
  using (auth.uid() = id);

create policy "Users can insert their own profile" 
  on public.users for insert 
  with check (auth.uid() = id);

-- Trigger to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
