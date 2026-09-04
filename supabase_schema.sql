-- ==============================================================================
-- СХЕМА БАЗЫ ДАННЫХ ДЛЯ БЕСПЛАТНОГО ТАРИФА SUPABASE (Free Tier)
-- Проект: AITU Prepod (Рейтинг преподавателей Astana IT University)
-- 
-- Инструкция:
-- 1. Перейдите на https://supabase.com и создайте новый бесплатный проект (Free tier).
-- 2. В боковом меню откройте "SQL Editor" -> "New query".
-- 3. Вставьте весь этот скрипт и нажмите "Run".
-- 4. Перейдите в "Project Settings" -> "API" и скопируйте:
--    - Project URL (например: https://xyzcompany.supabase.co)
--    - anon / public key (публичный ключ доступа)
-- 5. Вставьте их в окно "Облако Supabase" на сайте AITU Prepod.
-- ==============================================================================

-- 1. Таблица отзывов от студентов
create table if not exists public.reviews (
    id text primary key,
    professor_id text not null,
    author text not null default 'Студент AITU',
    rating numeric not null check (rating >= 1 and rating <= 5),
    proctoring numeric not null check (proctoring >= 1 and proctoring <= 5),
    discipline text not null default 'Общая дисциплина',
    grade text not null default 'A',
    tags text[] not null default array[]::text[],
    text text not null check (length(text) >= 2 and length(text) <= 4000),
    likes integer not null default 1,
    created_at timestamp with time zone not null default now()
);

-- Индексы для сверхбыстрой выборки на бесплатном тарифе (индексы экономят CPU и память)
create index if not exists idx_reviews_professor_id on public.reviews (professor_id);
create index if not exists idx_reviews_created_at on public.reviews (created_at desc);

-- 2. Таблица преподавателей, добавленных студентами
create table if not exists public.suggested_professors (
    id text primary key,
    name text not null check (length(name) >= 3),
    department text not null,
    disciplines text[] not null default array[]::text[],
    initials text not null,
    avatar_bg text not null default '#E11D48',
    suggested_by text not null default 'Студент AITU',
    created_at timestamp with time zone not null default now()
);

create index if not exists idx_suggested_professors_created_at on public.suggested_professors (created_at desc);

-- 3. Политики безопасности (Row Level Security - RLS)
-- Бесплатный тариф Supabase позволяет использовать публичные RLS-политики для анонимных пользователей
alter table public.reviews enable row level security;
alter table public.suggested_professors enable row level security;

-- Разрешить всем чтение отзывов
drop policy if exists "Public reviews are readable by everyone" on public.reviews;
create policy "Public reviews are readable by everyone" 
on public.reviews 
for select 
using (true);

-- Разрешить анонимным студентам добавлять отзывы
drop policy if exists "Anyone can insert reviews" on public.reviews;
create policy "Anyone can insert reviews" 
on public.reviews 
for insert 
with check (
    length(text) >= 2 and 
    length(text) <= 4000 and 
    rating >= 1 and 
    rating <= 5
);

-- Разрешить ставить лайки отзывам
drop policy if exists "Anyone can update likes" on public.reviews;
create policy "Anyone can update likes" 
on public.reviews 
for update 
using (true)
with check (true);

-- Разрешить чтение предложенных преподавателей
drop policy if exists "Public suggested professors are readable by everyone" on public.suggested_professors;
create policy "Public suggested professors are readable by everyone" 
on public.suggested_professors 
for select 
using (true);

-- Разрешить добавление предложенных преподавателей
drop policy if exists "Anyone can suggest a professor" on public.suggested_professors;
create policy "Anyone can suggest a professor" 
on public.suggested_professors 
for insert 
with check (length(name) >= 3);

-- 4. Включение Realtime (мгновенные обновления между всеми открытыми вкладками студентов)
-- Включаем таблицу reviews и suggested_professors в публикацию Realtime
do $$
begin
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
        alter publication supabase_realtime add table public.reviews;
        alter publication supabase_realtime add table public.suggested_professors;
    end if;
exception
    when duplicate_object then null;
end $$;

-- 5. Пример тестового отзыва для проверки подключения
insert into public.reviews (id, professor_id, author, rating, proctoring, discipline, grade, tags, text, likes, created_at)
values (
    'rev-welcome-aitu',
    'prof-1',
    'AITU Supabase Bot',
    5,
    3,
    'System Integration',
    'A',
    array['+swag +rep', 'Chill vibes'],
    'Синхронизация с Supabase Free Tier успешно активирована! Отзывы теперь обновляются в реальном времени у всех студентов.',
    7,
    now()
) on conflict (id) do nothing;
