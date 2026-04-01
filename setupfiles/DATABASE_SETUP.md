# PostgreSQL Database Setup Guide for CarryMart

Follow these steps to set up the PostgreSQL database for your e-commerce application.

## Prerequisites

- PostgreSQL 12 or higher installed on your machine
- psql command-line tool
- Node.js and pnpm

## Step 1: Install PostgreSQL

### macOS (using Homebrew)
```bash
brew install postgresql
brew services start postgresql
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Windows
Download and install from: https://www.postgresql.org/download/windows/

## Step 2: Create Database and User

Open psql and run:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE carrymart_db;

-- Create user (use a strong password in production!)
CREATE USER carrymart_user WITH PASSWORD 'yashvi@123';

-- Grant privileges
ALTER ROLE carrymart_user SET client_encoding TO 'utf8';
ALTER ROLE carrymart_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE carrymart_user SET default_transaction_deferrable TO on;
ALTER ROLE carrymart_user SET default_transaction_read_ahead TO on;
GRANT ALL PRIVILEGES ON DATABASE carrymart_db TO carrymart_user;

-- Connect to the new database
\c carrymart_db

-- Grant schema privileges
GRANT ALL PRIVILEGES ON SCHEMA public TO carrymart_user;

-- Exit psql
\q
```

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in the project root (copy from `.env.example`)
2. Update with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://carrymart_user:your_secure_password@localhost:5432/carrymart_db
NODE_ENV=development
```

## Step 4: Install pg Package

The database code requires the `pg` package for Node.js:

```bash
pnpm add pg
pnpm add --save-dev @types/pg
```

Also install bcryptjs for password hashing:

```bash
pnpm add bcryptjs
pnpm add --save-dev @types/bcryptjs
```

## Step 5: Run Database Migration

Execute the SQL schema file to create all tables:

```bash
psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql
```

Or manually run the commands from `scripts/01-create-tables.sql` in pgAdmin or psql.

## Step 6: Verify Tables

Connect to the database and verify all tables were created:

```bash
psql -U carrymart_user -d carrymart_db

-- List all tables
\dt

-- Describe a table
\d users

-- Exit
\q
```

## Step 7: Update Auth Context in Your App

Replace the old context imports with the new database-backed versions:

In your `app/layout.tsx` or main app file:

```tsx
// OLD:
// import { AuthProvider } from '@/context/auth-context'
// import { CartProvider } from '@/context/cart-context'

// NEW:
import { AuthProvider } from '@/context/auth-context-db'
import { CartProvider } from '@/context/cart-context-db'
```

## Database Schema Overview

### Users Table
- Stores user account information with hashed passwords
- Email is unique to prevent duplicates

### Cart Items Table
- Stores cart items per user
- Maintains quantity for each product
- Automatically deleted when user is deleted

### Favorites Table
- Stores user's favorite products
- One-to-many relationship with users

### Orders Table
- Stores order summary information
- Links to order items and shipping details
- Maintains order status and timestamps

### Order Items Table
- Stores individual items in each order
- Captures product details at time of purchase

### Shipping Details Table
- Stores complete shipping information for each order
- Includes delivery estimates

## Common Commands

### Connect to database
```bash
psql -U carrymart_user -d carrymart_db
```

### View all data in a table
```sql
SELECT * FROM users;
SELECT * FROM orders;
SELECT * FROM cart_items WHERE user_id = 1;
```

### Reset database (WARNING: Deletes all data)
```bash
psql -U postgres -d carrymart_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql
```

### Backup database
```bash
pg_dump -U carrymart_user -d carrymart_db > backup.sql
```

### Restore database
```bash
psql -U carrymart_user -d carrymart_db < backup.sql
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user

### Cart
- `GET /api/cart?userId={userId}` - Get user's cart
- `POST /api/cart` - Add/update cart item
- `DELETE /api/cart` - Remove cart item
- `POST /api/cart/clear` - Clear entire cart

### Favorites
- `GET /api/favorites?userId={userId}` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites` - Remove from favorites

### Orders
- `GET /api/orders?userId={userId}` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL service is running
- Check DATABASE_URL format
- Verify credentials

### Port Already in Use
```bash
# macOS/Linux - kill process on port 5432
lsof -ti:5432 | xargs kill -9

# Then restart PostgreSQL
pg_ctl -D /usr/local/var/postgres start
```

### Permission Denied
```bash
# Grant all privileges to user
psql -U postgres -d carrymart_db -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO carrymart_user;"
```

## Production Considerations

1. **Use Strong Passwords**: Generate secure passwords for production
2. **SSL Connections**: Enable SSL for remote databases
3. **Backups**: Set up automated database backups
4. **Monitoring**: Monitor database performance and resource usage
5. **Connection Pooling**: Use PgBouncer or similar for production
6. **Environment Variables**: Never commit sensitive credentials
7. **Data Validation**: Validate all input on both frontend and backend

## Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- pgAdmin: https://www.pgadmin.org/
- DBeaver: https://dbeaver.io/
- pg npm package: https://node-postgres.com/
