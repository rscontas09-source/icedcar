CREATE SEQUENCE public.order_number_seq START 21010001;
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE DEFAULT ('PEDIDO' || nextval('public.order_number_seq')::text),
  payment_id text NOT NULL UNIQUE,
  method text NOT NULL,
  amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_cpf text NOT NULL,
  city text, state text,
  items jsonb NOT NULL DEFAULT '[]',
  utms jsonb NOT NULL DEFAULT '{}',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.orders TO service_role;
GRANT USAGE ON SEQUENCE public.order_number_seq TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE INDEX orders_cpf_idx ON public.orders (customer_cpf);