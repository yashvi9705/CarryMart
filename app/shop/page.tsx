'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Cart from '@/components/cart'
import Favorites from '@/components/favorites'
import CategoryNav from '@/components/category-nav'
import ProductGrid from '@/components/product-grid'
import { useCart } from '@/context/cart-context'
import { formatContentfulCategory, formatContentfulProduct, getCategories, getProducts } from '@/lib/contentful'

export default function ShopPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cart, favorites, addToCart, removeFromCart, clearCart, addToFavorites, removeFromFavorites } = useCart()

  useEffect(() => {
    async function loadData() {

      const productData = await getProducts()
      const formattedProducts = productData.map(formatContentfulProduct)
      setProducts(formattedProducts)


      const categoryData = await getCategories()
      const formattedCategories = categoryData.map(formatContentfulCategory)
      setCategories(formattedCategories)
    }

    loadData()
  }, [])

  const filteredProducts =
    !selectedCategory
      ? products
      : products.filter((p) => p.category === selectedCategory)

      const searchedProducts = searchQuery.trim()
      ? filteredProducts.filter(p =>
          (p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : filteredProducts;

  const handleFavoriteChange = (productId: string, isFavorite: boolean) => {
    if (favorites[productId]) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(productId)
    }
  }
  

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)
  const cartTotal = Object.entries(cart).reduce((total, [productId, quantity]) => {
    const product = products.find(p => p.id === productId)
    const price = product ? product.price * quantity : 0
    const tax = Math.round(price * 0.13 * 100) / 100 
    return total + price + tax
  }, 0)
  const favoritesCount = Object.values(favorites).filter(Boolean).length

  const handleAddItem = (productId: string) => {
    addToCart(productId)
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
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
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          {/* Page Header */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Shop All Products</h1>
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-6900 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

         

          {/* Products Section */}
          <section className="mb-8">
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{searchedProducts.length}</span> {searchedProducts.length === 1 ? 'product' : 'products'}
                </p>
                {searchQuery && (
                  <p className="text-sm text-gray-500 mt-1">
                    Search results for "<span className="font-semibold">{searchQuery}</span>"
                  </p>
                )}
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-900 hover:text-blue-900 font-semibold text-sm px-4 py-2 hover:bg-green-50 rounded transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
            <ProductGrid
              products={searchedProducts}
              cart={cart}
              onAddToCart={handleAddItem}
              onRemoveFromCart={handleRemoveItem}
              favorites={favorites}
              onFavoriteChange={handleFavoriteChange}
            />
          </section>
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Cart
              cart={cart}
              products={products}
              onRemoveItem={handleRemoveItem}
              onAddItem={handleAddItem}
              onClearCart={clearCart}
              onClose={() => setIsCartOpen(false)} />
          </aside>
        )}

        {/* Favorites Sidebar */}
        {isFavoritesOpen && (
          <aside className="fixed right-0 top-0 w-full sm:w-96 h-screen bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-lg">
            <Favorites
               products={products}
              favorites={favorites}
              onRemoveFavorite={(id) => handleFavoriteChange(id, false)}
              onAddToCart={handleAddItem}
              onClose={() => setIsFavoritesOpen(false)}
            />
          </aside>
        )}


         {/* Categories Section */}
         <section className="mb-12 md:mb-16">
            <CategoryNav categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
          </section>
      </main>

      <Footer />
    </div>
  )
}
