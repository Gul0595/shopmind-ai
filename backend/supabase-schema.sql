-- ============================================================
-- ShopMind.ai v2 — Supabase Schema
-- Paste this ENTIRE file in: Supabase → SQL Editor → Run
-- ============================================================

create extension if not exists "uuid-ossp";

create table organizations (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  widget_key      uuid not null default uuid_generate_v4(),
  plan            text not null default 'free',
  chat_count      int not null default 0,
  chat_limit      int not null default 500,
  chat_reset_at   timestamptz default (now() + interval '30 days'),
  onboarding_step int not null default 1,
  created_at      timestamptz default now()
);

create table users (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  password_hash text not null,
  org_id        uuid not null references organizations(id) on delete cascade,
  role          text not null default 'owner',
  created_at    timestamptz default now()
);

create table products (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  category    text default 'General',
  price       numeric(10,2) default 0,
  description text,
  tags        text[] default '{}',
  emoji       text default '📦',
  in_stock    boolean default true,
  created_at  timestamptz default now()
);

create table analytics_events (
  id              uuid primary key default uuid_generate_v4(),
  org_id          uuid not null references organizations(id) on delete cascade,
  query           text,
  matched         boolean default false,
  used_web_search boolean default false,
  highlight_count int default 0,
  created_at      timestamptz default now()
);

create index idx_products_org_id on products(org_id);
create index idx_analytics_org_id on analytics_events(org_id);
create index idx_analytics_created_at on analytics_events(created_at);
create index idx_users_email on users(email);
create index idx_users_org_id on users(org_id);
