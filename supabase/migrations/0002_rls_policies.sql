-- Amalina Market — row level security (applied)

alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.profiles    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy categories_read  on public.categories for select using (true);
create policy categories_admin on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy products_read_active on public.products for select
  using (active or public.is_admin());
create policy products_admin on public.products for all
  using (public.is_admin()) with check (public.is_admin());

create policy profiles_read on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy orders_insert on public.orders for insert
  with check (user_id is null or user_id = auth.uid());
create policy orders_read on public.orders for select
  using (user_id = auth.uid() or public.is_admin());
create policy orders_update on public.orders for update
  using (public.is_admin()) with check (public.is_admin());

create policy order_items_insert on public.order_items for insert with check (true);
create policy order_items_read on public.order_items for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
create policy order_items_admin on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());
