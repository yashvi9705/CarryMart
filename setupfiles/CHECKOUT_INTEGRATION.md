# Checkout & Order Integration Guide

This guide shows how to integrate the order creation with your checkout process.

## Checkout Flow

```
1. User adds items to cart
2. User proceeds to checkout
3. User enters shipping details
4. System calculates totals
5. Order is created in database
6. Cart is cleared
7. Order confirmation page is shown
```

## Example Checkout Component Integration

### Step 1: Update Checkout Page

```tsx
// app/checkout/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cart-context-db'
import { useAuth } from '@/context/auth-context-db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    shippingMethod: 'standard',
  })

  // Calculate totals (you'll need to fetch actual product prices)
  const calculateTotal = () => {
    // TODO: Fetch product details and calculate actual total
    return 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('Please sign in first')
      return
    }

    if (Object.keys(cart).length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Convert cart to order items format
      const orderItems = Object.entries(cart).map(([productId, quantity]) => {
        // TODO: Fetch actual product details
        return {
          product_id: productId,
          product_name: 'Product Name', // Fetch from product data
          quantity: quantity,
          unit_price: 100, // Fetch from product data
        }
      })

      const totalAmount = orderItems.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity)
      }, 0)

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: orderItems,
          totalAmount: totalAmount,
          shippingDetails: {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postalCode,
            country: formData.country,
            shipping_method: formData.shippingMethod,
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await response.json()

      // Clear cart after successful order
      await clearCart()

      // Redirect to success page
      router.push(`/order-success?orderId=${order.id}&orderNumber=${order.order_number}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Shipping Details */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleInputChange}
              required
            />
            <Input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={formData.postalCode}
              onChange={handleInputChange}
              required
            />
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="border rounded px-3 py-2"
            >
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
            </select>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === 'standard'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <span>Standard (5-7 business days) - Free</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === 'express'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <span>Express (2-3 business days) - ₹99</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="overnight"
                checked={formData.shippingMethod === 'overnight'}
                onChange={handleInputChange}
                className="mr-3"
              />
              <span>Overnight - ₹199</span>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-lg p-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{calculateTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formData.shippingMethod === 'standard' ? 'Free' : `₹${formData.shippingMethod === 'express' ? '99' : '199'}`}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>₹{calculateTotal()}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || !user}
          className="w-full py-3 text-lg"
        >
          {isLoading ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </div>
  )
}
```

### Step 2: Update Order Success Page

```tsx
// app/order-success/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context-db'
import Link from 'next/link'

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  created_at: string
  items: Array<{
    product_id: string
    product_name: string
    quantity: number
    unit_price: string
  }>
  shipping_details: {
    full_name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postal_code: string
    country: string
  }
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const orderId = searchParams.get('orderId')
  const orderNumber = searchParams.get('orderNumber')

  useEffect(() => {
    if (!orderId || !user) return

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`)
        if (response.ok) {
          const { order } = await response.json()
          setOrder(order)
        }
      } catch (error) {
        console.error('Failed to fetch order:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, user])

  if (isLoading) {
    return <div className="text-center py-12">Loading order details...</div>
  }

  if (!order) {
    return <div className="text-center py-12">Order not found</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Success Message */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order has been confirmed.
        </p>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Order Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="capitalize bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-semibold text-lg">₹{order.total_amount}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping To</h2>
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{order.shipping_details.full_name}</p>
            <p>{order.shipping_details.address}</p>
            <p>
              {order.shipping_details.city}, {order.shipping_details.state}{' '}
              {order.shipping_details.postal_code}
            </p>
            <p>{order.shipping_details.country}</p>
            <p className="mt-2">{order.shipping_details.phone}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items && order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">{item.product_name}</p>
                <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold">
                ₹{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Order confirmation email sent to {order.shipping_details.email}</li>
          <li>✓ We'll notify you when your order ships</li>
          <li>✓ Track your order in your account</li>
          <li>✓ Estimated delivery: 5-7 business days</li>
        </ul>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-4 justify-center">
        <Link
          href="/shop"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
        <Link
          href="/orders"
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          View All Orders
        </Link>
      </div>
    </div>
  )
}
```

### Step 3: Create Orders History Page

```tsx
// app/orders/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context-db'
import Link from 'next/link'

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  created_at: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${user.id}`)
        if (response.ok) {
          const { orders } = await response.json()
          setOrders(orders)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to view your orders</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Start shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">{order.order_number}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="capitalize px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">₹{order.total_amount}</span>
              <Link
                href={`/order-success?orderId=${order.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Key Points

1. **Cart to Order Conversion**: Extract cart items and convert to order items with product details
2. **Shipping Details Collection**: Get all required shipping information from user
3. **Order Creation**: Call `/api/orders` with formatted data
4. **Cart Clearing**: Clear cart after successful order creation
5. **Success Redirect**: Navigate to order confirmation page
6. **Order History**: Display past orders from database

## Testing Checklist

- [ ] Checkout form validates all required fields
- [ ] Order is created in database with correct total
- [ ] Shipping details are saved correctly
- [ ] Cart is cleared after order
- [ ] Success page displays correct order info
- [ ] Orders page shows all user's orders
- [ ] Order details page loads correctly
- [ ] Timestamps are correct

## Next Steps

1. Add payment processing (Stripe/Razorpay integration)
2. Add order status updates
3. Add email notifications
4. Add order cancellation functionality
5. Add return/refund processing
6. Add order tracking
