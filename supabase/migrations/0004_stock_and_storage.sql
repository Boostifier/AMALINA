-- Amalina Market — optional enhancements.
-- NOT yet applied to the live DB (Supabase MCP was offline when written).
-- Apply via the Supabase SQL editor or `supabase db push`. The app works without it.

-- 1. Decrement product stock automatically when an order line is created.
create or replace function public.decrement_stock()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.products
    set stock = greatest(0, stock - new.qty)
    where slug = new.product_slug;
  return new;
end;
$$;

drop trigger if exists order_items_decrement_stock on public.order_items;
create trigger order_items_decrement_stock
  after insert on public.order_items
  for each row execute function public.decrement_stock();

-- 2. Public bucket for admin-uploaded product images.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are public"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admins manage product images"
  on storage.objects for all
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());
