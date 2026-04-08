-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can read own profile" on profiles
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Function: Auto-insert profile when new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Call handle_new_user function after user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

---
--- POLLS TABLES
---

-- Create polls table
create table polls (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  poll_image_url text,
  
  -- Settings that determine storage behavior
  allow_multiple boolean default false,
  share_without_image boolean default false,
  share_without_options boolean default false,
  
  -- Poll status
  is_published boolean default true,
  is_closed boolean default false,
  
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS on polls
alter table polls enable row level security;

-- Policy: Users can read published polls or their own polls
create policy "Users can read polls" on polls
  for select using (
    is_published = true 
    or auth.uid() = user_id
  );

-- Policy: Users can create polls
create policy "Users can create polls" on polls
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own polls
create policy "Users can update own polls" on polls
  for update using (auth.uid() = user_id);

-- Policy: Users can delete their own polls
create policy "Users can delete own polls" on polls
  for delete using (auth.uid() = user_id);

-- Create poll_options table (only used if share_without_image = false)
create table poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  text text not null,
  image_url text,
  "order" integer default 0,
  created_at timestamp default now()
);

-- Enable RLS on poll_options
alter table poll_options enable row level security;

-- Policy: Anyone can read options from published polls
create policy "Anyone can read poll options" on poll_options
  for select using (
    (select is_published from polls where polls.id = poll_options.poll_id)
  );

-- Policy: Poll creator can insert options
create policy "Poll creator can insert options" on poll_options
  for insert with check (
    (select user_id from polls where polls.id = poll_options.poll_id) = auth.uid()
  );

-- Policy: Poll creator can update options
create policy "Poll creator can update options" on poll_options
  for update using (
    (select user_id from polls where polls.id = poll_options.poll_id) = auth.uid()
  );

-- Policy: Poll creator can delete options
create policy "Poll creator can delete options" on poll_options
  for delete using (
    (select user_id from polls where polls.id = poll_options.poll_id) = auth.uid()
  );

-- Create poll_responses table (for tracking votes/feedback)
create table poll_responses (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  
  -- For regular polls
  user_id uuid references auth.users(id) on delete set null,
  selected_option_ids uuid[] default array[]::uuid[],
  
  -- For feedback mode (share_without_options = true - feedback only)
  voter_name text,
  voter_email text,
  feedback_message text,
  
  created_at timestamp default now()
);

-- Enable RLS on poll_responses
alter table poll_responses enable row level security;

-- Policy: Anyone can read responses from published polls
create policy "Anyone can read poll responses" on poll_responses
  for select using (
    (select is_published from polls where polls.id = poll_responses.poll_id)
  );

-- Policy: Authenticated users can create responses
create policy "Authenticated users can create responses" on poll_responses
  for insert with check (true);

-- Index for performance
create index idx_polls_user_id on polls(user_id);
create index idx_polls_created_at on polls(created_at);
create index idx_poll_options_poll_id on poll_options(poll_id);
create index idx_poll_responses_poll_id on poll_responses(poll_id);
