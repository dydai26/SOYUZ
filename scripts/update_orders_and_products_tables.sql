
-- Add email column to orders table if it doesn't exist
ALTER TABLE orders ADD COLUMN IF NOT EXISTS email TEXT;

-- Add article_number column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS article_number TEXT;

-- Copy existing user_email data to email column if it exists
UPDATE orders
SET email = user_email
WHERE user_email IS NOT NULL AND email IS NULL;

-- Create an index on email column for faster searches
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Create an index on article_number for faster searches
CREATE INDEX IF NOT EXISTS idx_products_article_number ON products(article_number);

-- Ensure RLS is enabled for orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Ensure policies exist for the updated tables
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Make sure user_email column exists for backward compatibility
-- This allows us to handle both new and old data structures
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Ensure email data is synchronized between columns
UPDATE orders
SET user_email = email
WHERE email IS NOT NULL AND user_email IS NULL;

-- Add a trigger to sync email and user_email columns
CREATE OR REPLACE FUNCTION sync_email_columns()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NULL AND NEW.user_email IS NOT NULL THEN
    NEW.email := NEW.user_email;
  ELSIF NEW.user_email IS NULL AND NEW.email IS NOT NULL THEN
    NEW.user_email := NEW.email;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_sync_trigger ON orders;
CREATE TRIGGER email_sync_trigger
BEFORE INSERT OR UPDATE ON orders
FOR EACH ROW EXECUTE PROCEDURE sync_email_columns();
