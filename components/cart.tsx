'use client'

import { Product } from '@/lib/mock-data'
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import Image from 'next/image'



interface CartProps {
  cart: { [key: string]: number }
  products: Product[]
  onRemoveItem: (productId: string) => void
  onAddItem: (productId: string) => void
  onClearCart: () => void
  onClose: () => void
}

export default function Cart({
  cart,
  products,
  onRemoveItem,
  onAddItem,
  onClearCart,
  onClose,
}: CartProps) {
  const cartItems = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId)
    return { product, quantity, productId }
  })

  const subtotal = cartItems.reduce((sum, { product, quantity }) => {
    return sum + (product?.price || 0) * quantity
  }, 0)

  const deliveryFee = 0
  const tax = Math.round(subtotal * 0.13 * 100) / 100 
  const total = subtotal + tax

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    window.location.href = '/checkout'
  }

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-col h-full bg-background">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b">
        <div>
          <h2 className="text-xl font-semibold">Shopping Cart</h2>
          <p className="text-sm text-muted-foreground">{totalItems} items</p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>


      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {cartItems.length === 0 ? (

          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">
              Add items to start shopping
            </p>
          </div>

        ) : (

          cartItems.map(({ product, quantity, productId }) => (

            <div
              key={productId}
              className="flex items-center gap-4 border rounded-xl p-4 bg-secondary/40"
            >

              {/* Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={product?.image || '/placeholder.png'}
                  alt={product?.name || 'Product'}
                  fill
                  className="object-cover"
                />
              </div>


              {/* Info */}
              <div className="flex-1 min-w-0">

                <div className="flex-1 min-w-0">

                  {/* FULL NAME */}
                  <h4 className="text-sm font-semibold text-foreground leading-snug">
                    {product?.name}
                  </h4>

                  <p className="text-xs text-muted-foreground mt-1">
                    {product?.unit}
                  </p>

                </div>



                <p className="text-sm font-semibold text-blue-900 mt-4">
                  ${product?.price.toFixed(2)}
                </p>

              </div>


              {/* Quantity */}
              <div className="flex items-center gap-2 border rounded-lg px-1 py-1">

                <button
                  onClick={() => onRemoveItem(productId)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-6 text-center text-sm font-semibold">
                  {quantity}
                </span>

                <button
                  onClick={() => onAddItem(productId)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>

              </div>


              {/* Remove */}
              <button
                onClick={() => onRemoveItem(productId)}
                className="p-2 hover:bg-red-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>

            </div>

          ))

        )}

      </div>



      {/* Summary */}
      {cartItems.length > 0 && (

        <div className="border-t px-6 py-5 bg-secondary/30 space-y-3">

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee}`}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-blue-900 text-lg">${total.toFixed(2)}</span>
          </div>


          <button
            onClick={handleCheckout}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-950 transition"
          >
            Checkout
          </button>

          <button
            onClick={onClearCart}
            className="w-full border py-2 rounded-lg text-sm hover:bg-secondary"
          >
            Clear Cart
          </button>

        </div>

      )}

    </div>
  )
}
