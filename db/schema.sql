create table if not exists profiles (
  id uuid primary key,
  email text unique not null,
  name text not null,
  role text not null default 'employee',
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_number text,
  city text,
  segment text,
  email text,
  hot boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  contact text not null,
  segment text not null,
  status text not null default 'Ny',
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  supplier text not null,
  text text not null,
  status text not null default 'Utkast',
  created_at timestamptz not null default now()
);

create table if not exists quote_drafts (
  id uuid primary key default gen_random_uuid(),
  customer text not null,
  title text not null,
  text text not null,
  status text not null default 'Utkast',
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  due_date date,
  owner text,
  status text not null default 'Öppen',
  created_at timestamptz not null default now()
);

create table if not exists call_notes (
  id uuid primary key default gen_random_uuid(),
  phone text,
  customer_name text,
  note text,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists sync_queue (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  field text not null,
  old_value text,
  new_value text,
  status text not null default 'Pending',
  created_at timestamptz not null default now()
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  created_at timestamptz not null default now()
);
