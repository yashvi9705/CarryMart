# 🚀 Quick Start - PostgreSQL Setup (Copy & Paste)

Follow these exact commands. Copy one section at a time.

## 1️⃣ Install PostgreSQL

### macOS
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
Download: https://www.postgresql.org/download/windows/

---

## 2️⃣ Create Database & User (Run These SQL Commands)

```bash
psql -U postgres
```

Then paste in the terminal:
```sql
CREATE DATABASE carrymart_db;
CREATE USER carrymart_user WITH PASSWORD 'change_this_password_123';
ALTER ROLE carrymart_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE carrymart_db TO carrymart_user;
\c carrymart_db
GRANT ALL PRIVILEGES ON SCHEMA public TO carrymart_user;
\q
```

---

## 3️⃣ Create Tables

Replace `change_this_password_123` with your actual password:

```bash
psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql
```

Verify it worked:
```bash
psql -U carrymart_user -d carrymart_db
\dt
\q
```

Should show 6 tables: users, cart_items, favorites, orders, order_items, shipping_details

---

## 4️⃣ Install Dependencies

```bash
pnpm install
```

---

## 5️⃣ Create .env.local File

In project root, create `.env.local`:

```env
DATABASE_URL=postgresql://carrymart_user:change_this_password_123@localhost:5432/carrymart_db
NODE_ENV=development
```

⚠️ Replace `change_this_password_123` with your actual password from Step 2

---

## 6️⃣ Update app/layout.tsx

Find these lines:
```tsx
// OLD (remove or comment out):
// import { AuthProvider } from '@/context/auth-context'
// import { CartProvider } from '@/context/cart-context'
```

Replace with:
```tsx
// NEW:
import { AuthProvider } from '@/context/auth-context-db'
import { CartProvider } from '@/context/cart-context-db'
```

---

## 7️⃣ Start Development Server

```bash
pnpm dev
```

Visit: http://localhost:3000

---

## ✅ Test It

1. **Sign Up**
   - Go to /signup
   - Enter email, password, name
   - Click signup
   - Should see welcome message

2. **Check Database**
   ```bash
   psql -U carrymart_user -d carrymart_db
   SELECT * FROM users;
   \q
   ```

3. **Test Cart Persistence**
   - Add item to cart
   - Sign out
   - Sign back in
   - Cart items should still be there

4. **Test Checkout** (when you implement it)
   - Add items
   - Go to checkout
   - Fill shipping details
   - Create order
   - Check database: `SELECT * FROM orders;`

---

## 🔐 Security Reminder

⚠️ **In .env.local file:** Don't commit this file! It has your password.

In `.gitignore`, make sure you have:
```
.env.local
.env*.local
```

---

## 🐛 Troubleshooting

### "Error: connect ECONNREFUSED"
PostgreSQL not running:
```bash
# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql
```

### "password authentication failed"
Wrong password in `.env.local`. Check it matches Step 2.

### "relation 'users' does not exist"
Tables not created. Run Step 3 again:
```bash
psql -U carrymart_user -d carrymart_db -f scripts/01-create-tables.sql
```

### "Cannot find module 'pg'"
Dependencies not installed:
```bash
pnpm install
```

---

## 📚 Full Documentation

For detailed information, read:
- `COMPLETE_SETUP_SUMMARY.md` - Full overview
- `DATABASE_SETUP.md` - Detailed PostgreSQL setup
- `IMPLEMENTATION_GUIDE.md` - Complete API reference
- `CHECKOUT_INTEGRATION.md` - Checkout examples
- `DOCUMENTATION_INDEX.md` - All documentation

---

## 🎯 What You Now Have

✅ **User Registration** - Secure password hashing  
✅ **Cart Persistence** - Saved per user in database  
✅ **Favorites** - Saved per user in database  
✅ **Orders** - Complete order history with shipping  
✅ **API Routes** - Ready to use endpoints  
✅ **Authentication** - Sign up/sign in with database  

---

## 🚀 Next Steps

1. Read `IMPLEMENTATION_GUIDE.md` for all API details
2. Check `CHECKOUT_INTEGRATION.md` for checkout code
3. Review `lib/products.ts` for utility functions
4. Start building features!

---

## 💡 Pro Tips

### Connect to database anytime:
```bash
psql -U carrymart_user -d carrymart_db
```

### View all users:
```sql
SELECT id, email, name, created_at FROM users;
```

### View all orders:
```sql
SELECT id, order_number, total_amount, status FROM orders;
```

### View specific user's cart:
```sql
SELECT * FROM cart_items WHERE user_id = 1;
```

### Exit database:
```sql
\q
```

---

## ⏱️ Time to Complete

- PostgreSQL install: 5 minutes
- Database setup: 5 minutes
- Code setup: 5 minutes
- **Total: ~15 minutes**

---

## 🎉 You're Ready!

Your CarryMart app now has:
- Real user accounts with secure authentication
- Persistent shopping cart per user
- Persistent favorites per user
- Complete order history with shipping details

**Go build something amazing!** 🚀

---

**Stuck?** Check the troubleshooting section above or read `COMPLETE_SETUP_SUMMARY.md`
