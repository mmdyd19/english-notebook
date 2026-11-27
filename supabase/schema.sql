-- 내 영어 표현장: Supabase SQL Editor 에서 한 번 실행
-- 원칙: 로그인한 본인 행만 읽기/쓰기 가능 (RLS). 비로그인(anon)은 아무것도 못 함.

create table if not exists public.cards (
  id         uuid primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  expr       text not null check (char_length(expr) between 1 and 2000),
  ctype      text check (char_length(ctype)     <= 2000),
  source     text check (char_length(source)    <= 2000),
  sentence   text check (char_length(sentence)  <= 2000),
  lit        text check (char_length(lit)       <= 2000),
  nat        text check (char_length(nat)       <= 2000),
  meaning    text check (char_length(meaning)   <= 2000),
  formality  text check (char_length(formality) <= 2000),
  mine       text check (char_length(mine)      <= 2000),
  example    text check (char_length(example)   <= 2000),
  created    date not null default current_date,
  due        date not null default current_date,
  level      int  not null default 0 check (level between 0 and 6),
  used       boolean not null default false,
  updated_at timestamptz not null default now()
);

create index if not exists cards_user_idx on public.cards (user_id);

alter table public.cards enable row level security;

drop policy if exists "own rows select" on public.cards;
drop policy if exists "own rows insert" on public.cards;
drop policy if exists "own rows update" on public.cards;
drop policy if exists "own rows delete" on public.cards;

create policy "own rows select" on public.cards
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "own rows insert" on public.cards
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own rows update" on public.cards
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own rows delete" on public.cards
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 비로그인 사용자는 테이블 권한 자체를 없앤다
revoke all on public.cards from anon;
-- TRUNCATE 는 RLS 를 무시하고 표 전체를 지울 수 있으므로 반드시 뺀다
revoke all on public.cards from authenticated;
grant select, insert, update, delete on public.cards to authenticated;
