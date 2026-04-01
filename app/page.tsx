'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Cart from '@/components/cart'
import Favorites from '@/components/favorites'
import { getCategories, formatContentfulCategory } from '@/lib/contentful'
import Footer from '@/components/footer'
import { useCart } from '@/context/cart-context'
import {ArrowRight } from 'lucide-react'
import { getProducts, formatContentfulProduct } from '@/lib/contentful'

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<
  { id: string; name: string; image?: string | null }[]
>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const { cart, favorites, addToCart, removeFromCart, clearCart, addToFavorites, removeFromFavorites } = useCart()

  // useEffect(() => {
  //   fetchProducts().then(setProducts)
  // }, [])
  useEffect(() => {
    async function loadData() {
      // Fetch and format products
      const productData = await getProducts()
      const formattedProducts = productData.map(formatContentfulProduct)
      setProducts(formattedProducts)

      // Fetch and format categories
      const categoryData = await getCategories()
      const formattedCategories = categoryData.map(formatContentfulCategory)
      setCategories(formattedCategories)
    }

    loadData()
  }, [])


  const handleAddToCart = (productId: string) => {
    addToCart(productId)
  }

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    if (isFavorite) {
      addToFavorites(productId)
    } else {
      removeFromFavorites(productId)
    }
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((total, [productId, quantity]) => {
    const product = products.find(p => p.id === productId)
    total += (product ? product.price * quantity : 0)
    const subtotal = total
    const tax = Math.round(subtotal * 0.13 * 100) / 100 
    return total + tax
  }, 0)
  const favoritesCount = Object.values(favorites).filter(Boolean).length
  const featuredProducts = products.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        cartCount={cartCount}
        cartTotal={cartTotal}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        favoritesCount={favoritesCount}
        onFavoritesClick={() => setIsFavoritesOpen(!isFavoritesOpen)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-96 md:h-[800px] overflow-hidden">
          <Image
            src="/coverpage.png"
            alt="CarryMart Product Showcase - Premium Beverages, Snacks & Electronics"
            fill
            loading="eager"
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/50 to-transparent"></div>

          <div className="relative h-full flex items-center justify-start px-4 md:px-12 lg:px-16">
            <div className="text-left max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 text-balance">
                <span className="text-yellow-300">CarryMart</span>
              </h1>
              <div className="h-1 w-20 bg-yellow-300 mb-6 rounded-full"></div>
              <p className="text-xl md:text-2xl text-yellow-300 mb-6 font-bold">
                Wholesale & Distribution
              </p>
              <p className="text-base md:text-lg text-white mb-8 leading-relaxed max-w-xl text-pretty drop-shadow-lg" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                Premium bulk products, energy drinks, snacks, and essentials. Unbeatable prices, fast delivery, and cash on delivery convenience.
              </p>
              <button onClick={() => window.location.href = "/shop"} className="bg-yellow-300 hover:bg-yellow-400 text-blue-900 font-bold px-8 py-3 rounded-lg transition-colors flex items-center gap-2 group">
                Start Shopping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>  
        </section>

        {/* About Us Snippet */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="relative h-64 md:h-80">
                <Image
                  src="/coverpage.png"
                  alt="About CarryMart"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About CarryMart</h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                CarryMart is your trusted partner for fast, reliable grocery delivery. We bring the freshest products from local farmers and premium suppliers directly to your home.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  With a commitment to quality, speed, and affordability, we've revolutionized how people shop for groceries. Our mission is simple: make quality food accessible to everyone.
                </p>
                <Link
                  href="/about"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2"
                >
                  Learn More About Us →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose CarryMart Section */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-blue-900 text-balance">
            Why Choose CarryMart?
          </h2>
          <p className="text-center text-gray-600 mb-16 text-lg">
            We bring wholesale simplicity to your doorstep
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Best Prices */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-yellow-300 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-blue-900">Best Prices</h3>
              </div>
              <p className="text-gray-600 text-lg">Wholesale rates on bulk purchases. Maximize your margins with our competitive pricing.</p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-yellow-300 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-blue-900">Fast Delivery</h3>
              </div>
              <p className="text-gray-600 text-lg">Quick and reliable delivery across the region. Fresh products guaranteed, every time.</p>
            </div>

            {/* Cash Payment */}
            <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-yellow-300 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold text-blue-900">Cash Payment</h3>
              </div>
              <p className="text-gray-600 text-lg">Simple cash on delivery. No online payment hassles. Easy transactions, flexible terms.</p>
            </div>
          </div>
        </div>
      </section>

        {/* What We Have Section */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">What We Have</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Explore our wide selection of fresh products, from fruits and vegetables to dairy and pantry staples. Everything you need in one place.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              {/* Category Cards */}
              {categories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
                <div className="relative h-40 w-full">
                  <Image
                    src={category.image || '/coverpage.png'}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-blue-900 font-semibold text-base">{category.name}</p>
                </div>
              </div>
              ))}
            </div>


            <div className="text-center">
              <Link
                href="/shop"
                className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-950 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {/* <section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Featured Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{product.unit}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section> */}

        {isCartOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Cart cart={cart} products={products} onRemoveItem={removeFromCart} onAddItem={addToCart} onClearCart={clearCart} onClose={() => setIsCartOpen(false)} />
          </aside>
        )}

        {isFavoritesOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Favorites
              favorites={favorites}
              onRemoveFavorite={(id) => handleFavoriteChange(id, false)}
              onAddToCart={addToCart}
              onClose={() => setIsFavoritesOpen(false)} products={[]}            />
          </aside>
        )}
      </main>

      <Footer />
    </div>
  )
}
