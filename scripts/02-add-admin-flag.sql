-- Add is_admin flag to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Create an admin user (email: admin@example.com, password: admin123)
-- Note: The password should be hashed in production. This is just for setup.
-- You can change this after deployment through your admin interface
INSERT INTO users (email, password_hash, name, is_admin, created_at, updated_at)
VALUES ('admin@example.com', '$2b$10$YJbXp8g7RplX6sYYOqUC6eVPi5V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Admin User', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE
SET is_admin = TRUE;


INSERT INTO users (email, password_hash, name, is_admin, created_at, updated_at)
VALUES ('carrymartwholesale@gmail.com', '$2b$10$YJbXp8g7RplX6sYYOqUC6eVPi5V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Admin User', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO UPDATE
SET is_admin = TRUE;

-- username: carrymartwholesale@gmail.com
-- password: carrymartAnant@123


