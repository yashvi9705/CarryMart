'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Star, Heart, ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Cart from '@/components/cart'
import Favorites from '@/components/favorites'
import { mockProducts } from '@/lib/mock-data'
import { useCart } from '@/context/cart-context'

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<typeof mockProducts[0] | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const { cart, favorites, addToCart, removeFromCart, clearCart, addToFavorites, removeFromFavorites } = useCart()

  useEffect(() => {
    const id = params.id as string
    const foundProduct = mockProducts.find(p => p.id === id)
    setProduct(foundProduct || null)
  }, [params.id])

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header cartCount={0} onCartClick={() => {}} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">Product not found</p>
            <Link href="/shop" className="text-blue-600 hover:text-blue-700 font-semibold">
              Back to Shop
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  const handleAddItem = (productId: string) => {
    addToCart(productId)
  }

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    if (isFavorite) {
      addToFavorites(productId)
    } else {
      removeFromFavorites(productId)
    }
  }

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 999) {
      setQuantity(value)
    }
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((total, [productId, qty]) => {
    const prod = mockProducts.find(p => p.id === productId)
    return total + (prod ? prod.salePrice * qty : 0)
  }, 0)
  const favoritesCount = Object.values(favorites).filter(Boolean).length
  const savings = product.originalPrice - product.salePrice

  function handleClearCart(): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        favoritesCount={favoritesCount}
        onFavoritesClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
      />

      <main className="flex-1 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/shop"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            ← Back to Shop
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Section */}
            <div>
              <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
                {savings > 0 && (
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-10">
                    <p className="font-bold text-sm">${savings.toFixed(2)} OFF</p>
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Details Section */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(24 reviews)</span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-blue-600">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <p className={`text-sm font-semibold ${product.inStock ? 'text-blue-600' : 'text-red-600'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.longDescription || product.description}
                  </p>
                </div>

                {/* Details */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Unit</p>
                      <p className="font-semibold text-gray-900">{product.unit}</p>
                    </div>
                    {product.sku && (
                      <div>
                        <p className="text-sm text-gray-600">SKU</p>
                        <p className="font-semibold text-gray-900">{product.sku}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-16 text-center border-0 focus:outline-none font-semibold"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={`flex-1 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        isAdded
                          ? 'bg-blue-50 text-blue-600'
                          : product.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          Added to Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleFavoriteChange(product.id, !favorites[product.id])}
                      className={`p-3 rounded-lg border transition-all ${
                        favorites[product.id]
                          ? 'bg-red-50 border-red-300 text-red-600'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${favorites[product.id] ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🚚</span>
                    <div>
                      <p className="font-semibold text-gray-900">Fast Delivery</p>
                      <p className="text-sm text-gray-600">Get your order within 10-30 minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">↩️</span>
                    <div>
                      <p className="font-semibold text-gray-900">Easy Returns</p>
                      <p className="text-sm text-gray-600">Not satisfied? Easy 7-day returns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Quality Guaranteed</p>
                      <p className="text-sm text-gray-600">All products are freshly sourced</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isCartOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Cart 
              cart={cart}
              onRemoveItem={handleRemoveFromCart}
              onAddItem={handleAddItem}
              onClearCart={handleClearCart}
              onClose={() => setIsCartOpen(false)} products={[]}            />
          </aside>
        )}

        {isFavoritesOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Favorites 
              favorites={favorites}
              onRemoveFavorite={(id) => handleFavoriteChange(id, false)}
              onAddToCart={handleAddItem}
              onClose={() => setIsFavoritesOpen(false)} products={[]}            />
          </aside>
        )}
      </main>

      <Footer />
    </div>
  )
}
