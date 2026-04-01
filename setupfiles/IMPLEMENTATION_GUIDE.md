# CarryMart PostgreSQL Implementation Guide

This guide explains how to integrate the PostgreSQL database with your existing CarryMart application.

## What's Been Created

### 1. Database Files
- **`scripts/01-create-tables.sql`** - SQL schema with all tables
- **`lib/db.ts`** - Database connection pool and query utility
- **`.env.example`** - Environment variables template

### 2. API Routes
- **`app/api/auth/signup/route.ts`** - User registration
- **`app/api/auth/signin/route.ts`** - User login
- **`app/api/cart/route.ts`** - Cart management (GET, POST, DELETE)
- **`app/api/cart/clear/route.ts`** - Clear entire cart
- **`app/api/favorites/route.ts`** - Favorites management (GET, POST, DELETE)
- **`app/api/orders/route.ts`** - Order creation and retrieval
- **`app/api/orders/[id]/route.ts`** - Get order details

### 3. Context Files (Database-Backed)
- **`context/auth-context-db.tsx`** - Authentication with database
- **`context/cart-context-db.tsx`** - Cart & favorites with database sync

## Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up PostgreSQL
Follow the detailed steps in `DATABASE_SETUP.md`:
- Install PostgreSQL
- Create database and user
- Run migration script
- Create `.env.local` file

### 3. Start Your App
```bash
pnpm dev
```

## Feature Overview

### User Authentication
- Sign up with email, password, and name
- Passwords are hashed with bcryptjs
- Sign in and sign out
- User data persists in database

### Cart Persistence
- When user logs in, cart data is loaded from database
- Cart updates are saved to database in real-time
- When user logs out and logs back in, cart is restored
- Guest users can use local cart (doesn't persist)

### Favorites
- Same persistence model as cart
- Per-user favorites stored in database
- Sync on login

### Order Management
- Create orders with multiple items
- Store shipping details
- Track order status
- Full order history per user
- Order items linked to original product info

## Database Schema

### users
```sql
- id (serial primary key)
- email (unique)
- password_hash
- name
- address (optional)
- profile_picture (optional)
- theme (light/dark)
- created_at
- updated_at
```

### cart_items
```sql
- id (serial primary key)
- user_id (foreign key → users)
- product_id
- quantity
- created_at
- updated_at
```

### favorites
```sql
- id (serial primary key)
- user_id (foreign key → users)
- product_id
- created_at
```

### orders
```sql
- id (serial primary key)
- user_id (foreign key → users)
- order_number (unique)
- total_amount
- status (pending, completed, cancelled, etc)
- created_at
- updated_at
```

### order_items
```sql
- id (serial primary key)
- order_id (foreign key → orders)
- product_id
- product_name
- quantity
- unit_price
- total_price
- created_at
```

### shipping_details
```sql
- id (serial primary key)
- order_id (foreign key → orders, unique)
- full_name
- email
- phone
- address
- city
- state
- postal_code
- country
- shipping_method
- estimated_delivery
- created_at
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/signup
Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /api/auth/signin
Sign in user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Cart Endpoints

#### GET /api/cart?userId={userId}
Get user's cart items

**Response:**
```json
{
  "cart": {
    "prod_1": 2,
    "prod_5": 1
  }
}
```

#### POST /api/cart
Add/update cart item

**Request:**
```json
{
  "userId": 1,
  "productId": "prod_1",
  "quantity": 2
}
```

#### DELETE /api/cart
Remove item from cart

**Request:**
```json
{
  "userId": 1,
  "productId": "prod_1"
}
```

#### POST /api/cart/clear
Clear entire cart

**Request:**
```json
{
  "userId": 1
}
```

### Favorites Endpoints

#### GET /api/favorites?userId={userId}
Get user's favorites

**Response:**
```json
{
  "favorites": {
    "prod_1": true,
    "prod_5": true
  }
}
```

#### POST /api/favorites
Add to favorites

**Request:**
```json
{
  "userId": 1,
  "productId": "prod_1"
}
```

#### DELETE /api/favorites
Remove from favorites

**Request:**
```json
{
  "userId": 1,
  "productId": "prod_1"
}
```

### Order Endpoints

#### GET /api/orders?userId={userId}
Get user's orders

**Response:**
```json
{
  "orders": [
    {
      "id": 1,
      "order_number": "ORD-1234567890-ABC123",
      "total_amount": "2999.99",
      "status": "pending",
      "created_at": "2024-01-15T10:30:00Z",
      "items": [
        {
          "product_id": "prod_1",
          "product_name": "Basmati Rice Premium",
          "quantity": 2,
          "unit_price": "399.00"
        }
      ],
      "shipping_details": {
        "full_name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "address": "123 Main St",
        "city": "Delhi",
        "state": "Delhi",
        "postal_code": "110001",
        "country": "India"
      }
    }
  ]
}
```

#### POST /api/orders
Create new order

**Request:**
```json
{
  "userId": 1,
  "items": [
    {
      "product_id": "prod_1",
      "product_name": "Basmati Rice Premium",
      "quantity": 2,
      "unit_price": 399
    }
  ],
  "totalAmount": 798,
  "shippingDetails": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "Delhi",
    "state": "Delhi",
    "postal_code": "110001",
    "country": "India",
    "shipping_method": "standard"
  }
}
```

**Response (201):**
```json
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "order_number": "ORD-1234567890-ABC123",
    "total_amount": 798,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/orders/[id]
Get order details

**Response:**
```json
{
  "order": {
    "id": 1,
    "order_number": "ORD-1234567890-ABC123",
    "total_amount": "798.00",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z",
    "items": [...],
    "shipping_details": {...}
  }
}
```

## Usage Examples

### In React Components

#### Sign Up
```tsx
import { useAuth } from '@/context/auth-context-db'

export function SignUpForm() {
  const { signUp } = useAuth()
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signUp(email, password, name)
      // Redirect to dashboard
    } catch (error) {
      console.error(error.message)
    }
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

#### Use Cart with Database
```tsx
import { useCart } from '@/context/cart-context-db'
import { useAuth } from '@/context/auth-context-db'

export function CartComponent() {
  const { cart, addToCart, removeFromCart } = useCart()
  const { user } = useAuth()
  
  // Cart automatically syncs with database when user is logged in
  const handleAdd = async (productId) => {
    await addToCart(productId, 1)
  }
  
  return (
    <div>
      {user && <p>Cart synced with your account</p>}
      {/* Display cart items */}
    </div>
  )
}
```

#### Create Order
```tsx
const handleCheckout = async () => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: user.id,
      items: cartItems,
      totalAmount: total,
      shippingDetails: shippingData
    })
  })
  
  const { order } = await response.json()
  // Redirect to order confirmation page
  router.push(`/order-success?orderId=${order.id}`)
}
```

## Migration from Old System

If you want to migrate from the old localStorage-based system:

1. **Keep old context files** for reference
2. **Update imports in layout.tsx:**
   ```tsx
   // OLD: import { AuthProvider } from '@/context/auth-context'
   // NEW:
   import { AuthProvider } from '@/context/auth-context-db'
   import { CartProvider } from '@/context/cart-context-db'
   ```

3. **Update component imports** as needed
4. **Test thoroughly** - especially sign in/sign out and cart persistence

## Error Handling

Common errors and solutions:

### "Cannot find module 'pg'"
```bash
pnpm add pg @types/pg
```

### "DATABASE_URL is not defined"
- Check `.env.local` file exists
- Verify DATABASE_URL format
- Restart dev server after adding env var

### "FATAL: password authentication failed"
- Check PostgreSQL user credentials
- Verify user has database access

### "relation 'users' does not exist"
- Run migration: `psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql`

## Performance Tips

1. **Connection Pooling**: The `db.ts` file uses a connection pool - reuse the `query` function
2. **Indexes**: Schema includes indexes on foreign keys for faster queries
3. **Query Optimization**: Complex queries use JSON aggregation for efficiency
4. **Batch Operations**: Combine multiple updates in transactions when possible

## Security Best Practices

1. ✅ Passwords hashed with bcryptjs (10 rounds)
2. ✅ SQL queries use parameterized statements (prevent SQL injection)
3. ✅ Environment variables for sensitive data
4. ✅ UNIQUE constraint on email (prevent duplicates)
5. ⚠️ TODO: Add rate limiting for auth endpoints
6. ⚠️ TODO: Add JWT tokens for session management
7. ⚠️ TODO: Add CORS policies

## Next Steps

1. **Add JWT Authentication**: Replace localStorage with JWT tokens in HTTP-only cookies
2. **Add Email Verification**: Send verification emails on signup
3. **Add User Profile Updates**: Create endpoints for profile changes
4. **Add Order Status Updates**: Admin endpoints to update order status
5. **Add Payment Integration**: Integrate Stripe or similar
6. **Add Analytics**: Track order data and user behavior
7. **Add Notifications**: Email notifications for orders

## Useful SQL Queries

```sql
-- Total sales by month
SELECT DATE_TRUNC('month', created_at) as month, SUM(total_amount) as total
FROM orders
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at);

-- Top products
SELECT product_id, SUM(quantity) as total_sold
FROM order_items
GROUP BY product_id
ORDER BY total_sold DESC;

-- User statistics
SELECT COUNT(*) as total_users, 
       COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_30d
FROM users;

-- Cart abandonment
SELECT u.id, u.email, COUNT(ci.id) as items_in_cart
FROM users u
LEFT JOIN cart_items ci ON u.id = ci.user_id
WHERE ci.id IS NOT NULL
GROUP BY u.id;
```

## Support

For issues or questions:
1. Check DATABASE_SETUP.md for troubleshooting
2. Review API endpoint documentation
3. Check PostgreSQL logs: `/var/log/postgresql/`
4. Review app logs in terminal
