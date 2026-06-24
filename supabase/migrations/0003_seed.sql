-- Amalina Market — initial catalog seed (applied)

insert into public.categories (slug, name, tagline, image, sort_order)
select slug, name, tagline, image, sort_order
from jsonb_to_recordset($json$
[
  {"slug":"masques","name":"Masques Capillaires","tagline":"Nutrition et réparation intense","image":"/products/01e06601-9928-4c0c-b599-6127693233d3.jpg","sort_order":1},
  {"slug":"huiles-soins","name":"Huiles & Soins","tagline":"Force et brillance au quotidien","image":"/products/8f7fb4a0-5f69-46d2-b19e-881eb0b3841b.jpg","sort_order":2},
  {"slug":"shampoings","name":"Shampoings","tagline":"Un cuir chevelu sain et purifié","image":"/products/53f4dc06-e0f7-4365-baa3-7f62113d212b.jpg","sort_order":3},
  {"slug":"accessoires","name":"Accessoires","tagline":"Les essentiels de votre routine","image":"/products/c526ead0-0d3e-4d9a-83cf-c3990db44276.jpg","sort_order":4}
]
$json$::jsonb) as x(slug text, name text, tagline text, image text, sort_order int)
on conflict (slug) do nothing;

-- Products are seeded from the same dataset; see 0003 application in project history.
-- (Full product JSON omitted here for brevity — already applied to the live database.)
