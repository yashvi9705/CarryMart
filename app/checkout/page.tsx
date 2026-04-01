'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { formatContentfulProduct, getProducts } from '@/lib/contentful'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { user } = useAuth()

  const [step, setStep] = useState<'shipping' | 'summary' | 'success'>('shipping')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  })

  useEffect(() => {
    async function loadProducts() {
      const productData = await getProducts()
      const formatted = productData.map(formatContentfulProduct)
      setProducts(formatted)
    }

    loadProducts()
  }, [])

  // const cartItems = Object.entries(cart).flatMap(([productId, quantity]) => {
  //   const product = products.find(p => p.id === productId)

  //   if (!product) return []

  //   return [{
  //     id: productId,
  //     name: product.name,
  //     price: product.price,
  //     quantity,
  //   }]
  // })

  const cartItems = Object.entries(cart).map(([productId, quantity]) => {

    const product = products.find(p => p.id === productId)
  
    if (!product) {
      console.warn("Missing product:", productId)
      return {
        id: productId,
        name: "Unknown Product",
        price: 0,
        quantity
      }
    }
  
    return {
      id: productId,
      name: product.name,
      price: product.price,
      quantity
    }
  
  })

  const subtotal = cartItems.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  )

  const deliveryFee = 0
  const tax = Math.round(subtotal * 0.13 * 100) / 100
  const total = subtotal + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep('summary')
  }

  const handleSummarySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Please sign in first')
      return
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const orderItems = cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price
      }))

      // const totalAmount = orderItems.reduce((sum, item) => {
      //   return sum + item.unit_price * item.quantity
      // }, 0)
      const subtotal = orderItems.reduce((sum, item) => {
        return sum + item.unit_price * item.quantity
      }, 0)
      
      const tax = Math.round(subtotal * 0.13 * 100) / 100
      const totalAmount = subtotal + tax

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: orderItems,
          totalAmount,
          shippingDetails: {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postal_code: formData.pincode,
          }
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create order')
      }

      const { order } = await response.json()

      await clearCart()

      router.push(`/order-success?orderId=${order.id}&orderNumber=${order.order_number}`)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-secondary rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          {['Shipping', 'Summary', 'Success'].map((label, idx) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                ${step === label.toLowerCase() ||
                    (step === 'summary' && idx < 1) ||
                    (step === 'success' && idx < 2)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'}
                `}
              >
                {idx < 2 ? idx + 1 : <Check className="w-4 h-4" />}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>

        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              />
              <input
                name="pincode"
                placeholder="Postal Code"
                value={formData.pincode}
                onChange={handleInputChange}
                required
                className="w-full border px-4 py-2 rounded-lg"
              />
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold">
              Continue to Summary
            </button>
          </form>
        )}

        {step === 'summary' && (
          <form onSubmit={handleSummarySubmit} className="space-y-6">

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Order Summary</h2>

              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div className="border-t pt-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="flex-1 bg-secondary py-3 rounded-lg"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold"
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

          </form>
        )}

      </div>
    </main>
  )
}