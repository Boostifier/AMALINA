// Hand-maintained database types for the Amalina Market schema.
// (Supabase type generation was offline; keep in sync with supabase/migrations.)
//
// NOTE: these are `type` aliases, not `interface`s, on purpose — supabase-js
// requires each Row/Insert/Update to be assignable to `Record<string, unknown>`,
// which interfaces are not (they have no implicit index signature).

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  sort_order: number;
  created_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_slug: string;
  price: number;
  short_description: string;
  description: string;
  details: string[];
  image: string;
  bestseller: boolean;
  stock: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProfileRow = {
  id: string;
  full_name: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
};

export type OrderRow = {
  id: string;
  order_number: number;
  user_id: string | null;
  status: OrderStatus;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  notes: string;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_slug: string;
  product_name: string;
  unit_price: number;
  qty: number;
  line_total: number;
};

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      categories: Table<CategoryRow>;
      products: Table<ProductRow>;
      profiles: Table<ProfileRow>;
      orders: Table<OrderRow>;
      order_items: Table<OrderItemRow>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
