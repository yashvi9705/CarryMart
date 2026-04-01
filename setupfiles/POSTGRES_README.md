# PostgreSQL Database Integration for CarryMart

Complete PostgreSQL setup with cart, favorites, and order management persistence.

## 📋 What's Included

### Database
- ✅ PostgreSQL schema with 6 tables (users, cart_items, favorites, orders, order_items, shipping_details)
- ✅ Indexes for optimal performance
- ✅ Referential integrity with foreign keys
- ✅ Automatic timestamp tracking

### Backend APIs
- ✅ Authentication (signup, signin)
- ✅ Cart management (add, remove, clear, sync)
- ✅ Favorites management (add, remove, sync)
- ✅ Order creation and retrieval
- ✅ Order details and history

### Frontend Integration
- ✅ Database-backed auth context (`auth-context-db.tsx`)
- ✅ Database-backed cart context (`cart-context-db.tsx`)
- ✅ Automatic data syncing on login
- ✅ Fallback to localStorage for guest users
- ✅ Example checkout integration

### Features
- 🔐 Secure password hashing (bcryptjs)
- 📊 Complete order tracking
- 🛒 Cart persistence per user
- ❤️ Favorites persistence per user
- 📦 Shipping details storage
- 🔄 Real-time database sync

## 🚀 Quick Start

### 1. Install PostgreSQL
See `DATABASE_SETUP.md` for detailed instructions per OS.

### 2. Create Database
```bash
psql -U postgres
```

```sql
CREATE DATABASE carrymart_db;
CREATE USER carrymart_user WITH PASSWORD 'your_secure_password';
ALTER ROLE carrymart_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE carrymart_db TO carrymart_user;
```

### 3. Create Tables
```bash
psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql
```

### 4. Install Dependencies
```bash
pnpm install
pnpm add pg bcryptjs
pnpm add --save-dev @types/pg @types/bcryptjs
```

### 5. Set Environment Variables
Create `.env.local`:
```env
DATABASE_URL=postgresql://carrymart_user:your_password@localhost:5432/carrymart_db
NODE_ENV=development
```

### 6. Update App Context
In your `app/layout.tsx`:
```tsx
import { AuthProvider } from '@/context/auth-context-db'
import { CartProvider } from '@/context/cart-context-db'
```

### 7. Start Development
```bash
pnpm dev
```

## 📁 File Structure

```
scripts/
├── 01-create-tables.sql       # Database schema

app/api/
├── auth/
│   ├── signup/route.ts         # User registration
│   └── signin/route.ts         # User login
├── cart/
│   ├── route.ts                # Cart CRUD operations
│   └── clear/route.ts          # Clear cart
├── favorites/
│   └── route.ts                # Favorites CRUD
└── orders/
    ├── route.ts                # Create/list orders
    └── [id]/route.ts           # Get order details

context/
├── auth-context-db.tsx         # NEW: Database auth context
└── cart-context-db.tsx         # NEW: Database cart context

lib/
├── db.ts                        # NEW: Database connection

docs/
├── DATABASE_SETUP.md           # Setup instructions
├── IMPLEMENTATION_GUIDE.md     # Complete API docs
├── CHECKOUT_INTEGRATION.md     # Checkout examples
└── POSTGRES_README.md          # This file
```

## 🔑 Key Features

### 1. User Authentication
```tsx
const { signUp, signIn, signOut, user } = useAuth()

// Sign up
await signUp('user@example.com', 'password123', 'John Doe')

// Sign in
await signIn('user@example.com', 'password123')

// User data
console.log(user) // { id: 1, email, name, ... }
```

### 2. Cart with Persistence
```tsx
const { cart, addToCart, removeFromCart, clearCart } = useCart()

// Add to cart (syncs to DB if logged in)
await addToCart('prod_1', 2)

// Cart object: { 'prod_1': 2, 'prod_5': 1 }
// Automatically persists to database for authenticated users
```

### 3. Favorites with Persistence
```tsx
const { favorites, addToFavorites, removeFromFavorites } = useCart()

// Add to favorites
await addToFavorites('prod_1')

// Favorites object: { 'prod_1': true, 'prod_5': true }
```

### 4. Order Creation
```tsx
// Create order
const response = await fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    items: [{
      product_id: 'prod_1',
      product_name: 'Basmati Rice',
      quantity: 2,
      unit_price: 399
    }],
    totalAmount: 798,
    shippingDetails: {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      address: '123 Main St',
      city: 'Delhi',
      state: 'Delhi',
      postal_code: '110001',
      country: 'India',
      shipping_method: 'standard'
    }
  })
})

const { order } = await response.json()
```

### 5. Order History
```tsx
// Get user's orders
const response = await fetch(`/api/orders?userId=${user.id}`)
const { orders } = await response.json()

// Each order includes items and shipping details
orders.forEach(order => {
  console.log(order.order_number)  // ORD-1234567890-ABC123
  console.log(order.total_amount)  // 798.00
  console.log(order.items)         // array of products ordered
  console.log(order.shipping_details) // full address info
})
```

## 📊 Database Schema

### users
Stores user accounts with hashed passwords

### cart_items
Per-user cart with product IDs and quantities

### favorites
Per-user list of favorite products

### orders
Order summary with total amount and status

### order_items
Individual items in each order (preserves product info at time of purchase)

### shipping_details
Complete shipping information for each order

## 🔒 Security

✅ Password hashing with bcryptjs (10 rounds)  
✅ SQL parameterized queries (prevents SQL injection)  
✅ Environment variables for credentials  
✅ Unique email constraint  
✅ Database-level constraints and indexes  

⚠️ TODO: Add JWT token authentication  
⚠️ TODO: Add CORS policies  
⚠️ TODO: Add rate limiting  
⚠️ TODO: Add input validation middleware  

## 🐛 Troubleshooting

### Connection Errors
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- PostgreSQL not running: `brew services start postgresql`
- Wrong credentials: Check DATABASE_URL
- Database not created: Run setup commands above

### Table Not Found
```
Error: relation "users" does not exist
```
- Run migration: `psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql`

### Permission Denied
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO carrymart_user;
```

## 📚 Documentation

1. **DATABASE_SETUP.md** - Step-by-step setup guide
2. **IMPLEMENTATION_GUIDE.md** - Complete API reference
3. **CHECKOUT_INTEGRATION.md** - Checkout flow examples

## 🧪 Testing APIs

### Using curl

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get cart
curl "http://localhost:3000/api/cart?userId=1"

# Add to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":"prod_1","quantity":2}'

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## 📈 Next Steps

1. **Implement JWT Auth** - Secure session tokens
2. **Add Email Service** - Confirmation & notification emails
3. **Add Payment** - Stripe/Razorpay integration
4. **Add Admin Panel** - Order management
5. **Add Analytics** - Track sales & user behavior
6. **Add Notifications** - Real-time order updates
7. **Add Reviews** - Product ratings & comments
8. **Add Refunds** - Return & refund process

## 📞 Support

For issues:
1. Check **DATABASE_SETUP.md** for troubleshooting
2. Review **IMPLEMENTATION_GUIDE.md** for API details
3. Check PostgreSQL logs
4. Verify .env.local configuration

## 📝 License

This code is part of the CarryMart e-commerce application.

---

**Ready to start?** Follow the Quick Start section above or read DATABASE_SETUP.md for detailed instructions!
