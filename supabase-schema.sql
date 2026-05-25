-- PrintFlow Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  shipping_method VARCHAR(50) NOT NULL,
  tracking_number VARCHAR(100),
  estimated_delivery VARCHAR(50),
  payment_intent_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Design files table
CREATE TABLE IF NOT EXISTS design_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  notes TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Order history/status changes table
CREATE TABLE IF NOT EXISTS order_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL,
  note TEXT,
  created_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product reviews table (optional)
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(100) NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  product_id VARCHAR(100),
  quantity INTEGER,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  quoted_amount DECIMAL(10, 2),
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_design_files_order_id ON design_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Customers: Can only view their own data
CREATE POLICY "Customers can view own data" ON customers
  FOR SELECT
  USING (email = current_setting('request.jwt.claim.email', true));

-- Orders: Customers can view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT
  USING (customer_email = current_setting('request.jwt.claim.email', true));

-- Allow service role to do everything (for API routes)
CREATE POLICY "Service role has full access to customers" ON customers
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE POLICY "Service role has full access to orders" ON orders
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE POLICY "Service role has full access to design_files" ON design_files
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE POLICY "Service role has full access to order_history" ON order_history
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE POLICY "Service role has full access to product_reviews" ON product_reviews
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

CREATE POLICY "Service role has full access to quote_requests" ON quote_requests
  FOR ALL
  USING (current_setting('request.jwt.claim.role', true) = 'service_role');

-- Create storage bucket for design files
INSERT INTO storage.buckets (id, name, public)
VALUES ('design-files', 'design-files', false)
ON CONFLICT DO NOTHING;

-- Storage policies for design files
CREATE POLICY "Anyone can upload design files" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'design-files');

CREATE POLICY "Anyone can view design files" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'design-files');

CREATE POLICY "Service role can manage design files" ON storage.objects
  FOR ALL
  USING (bucket_id = 'design-files' AND current_setting('request.jwt.claim.role', true) = 'service_role');
