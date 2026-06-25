create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  source text,
  status text default 'Novo',
  score int default 0,
  property_interest text,
  notes text,
  created_at timestamp default now()
);

create table properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  neighborhood text,
  city text default 'São Paulo',
  price numeric,
  area numeric,
  description text,
  created_at timestamp default now()
);
