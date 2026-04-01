----------------------------------------------------------------------------------------------------
-- Users table
----------------------------------------------------------------------------------------------------

DROP Table shipping_details 

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  profile_picture TEXT,
  theme VARCHAR(10) DEFAULT 'light',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sql to add the admin part
-- Add the column
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

----------------------------------------------------------------------------------------------------
-- Cart items table (per user)
----------------------------------------------------------------------------------------------------

CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

--------------------------------------------------------------------------------------------------------------
-- Favorites table (per user)
----------------------------------------------------------------------------------------------------

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

--------------------------------------------------------------------------------------------------------------
-- Orders table
----------------------------------------------------------------------------------------------------

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(255) UNIQUE NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Create indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

--------------------------------------------------------------------------------------------------------------
-- Order items table (items in each order)
----------------------------------------------------------------------------------------------------

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--------------------------------------------------------------------------------------------------------------
-- Shipping details table
----------------------------------------------------------------------------------------------------

CREATE TABLE shipping_details (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'Canada',
  postal_code VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE shipping_details 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN country VARCHAR(100) DEFAULT 'Canada';


--------------------------------------------------------------------------------------------------------------
-- Products table
----------------------------------------------------------------------------------------------------
CREATE TABLE products (
 id VARCHAR(255) PRIMARY KEY, 
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category VARCHAR(100),
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--------------------------------------------------------------------------------------------------------------
-- Create indexes for better query performance
----------------------------------------------------------------------------------------------------

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
------------------------------------------------------------------------
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
------------------------------------------------------------------------
CREATE INDEX idx_shipping_details_order_id ON shipping_details(order_id);
CREATE INDEX idx_shipping_order_id ON shipping_details(order_id);
------------------------------------------------------------------------
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin);  -- REQUIRED for admin queries
------------------------------------------------------------------------
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);



------------------------------------------------------------------------
------------------------------------------------------------------------
------------------------------------------------------------------------
------------------------------------------------------------------------
------------------------------------------------------------------------
------------------------------------------------------------------------
------------------------------------------------------------------------


--------------------------------------------------------------------------------------------------------------
-- MY QUERIES  FOR TESTING PURPOSES
----------------------------------------------------------------------------------------------------

Select * from users
select * from cart_items where user_id = 1
select * from favorites where user_id = 1
select * from orders where user_id = 1
select * from order_items where order_id = 1
select * from shipping_details


INSERT INTO users (email, name, password_hash, is_admin, created_at, updated_at)
VALUES (
  'admin@example.com',
  'Admin User',
  '$2b$10$n9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DuP3uG',  -- admin123 hash
  TRUE,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET is_admin = TRUE, password_hash = EXCLUDED.password_hash;

--- Customization
--- Change Admin Email
UPDATE users SET email = 'newemail@example.com' WHERE id = 'admin-user-id';


--- Change Admin Password
-- First generate hash: node scripts/generate-admin-hash.js
UPDATE users SET password_hash = '[NEW_HASH]' 
WHERE email = 'admin@example.com' AND is_admin = TRUE;

--- Make User an Admin
UPDATE users SET is_admin = TRUE WHERE email = 'user@example.com';

--- Remove Admin Privileges
UPDATE users SET is_admin = FALSE WHERE email = 'user@example.com';

