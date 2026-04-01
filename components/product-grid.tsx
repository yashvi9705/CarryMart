'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'

interface ProductGridProps {
  products: any[]
  cart: { [key: string]: number }
  onAddToCart: (productId: string) => void
  onRemoveFromCart: (productId: string) => void
  favorites?: { [key: string]: boolean }
  onFavoriteChange?: (productId: string, isFavorite: boolean) => void
}

export default function ProductGrid({
  products,
  cart,
  onAddToCart,
  onRemoveFromCart,
  favorites = {},
  onFavoriteChange = () => { },
}: ProductGridProps) {

  const handleAddToCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    onAddToCart(productId)
  }

  const handleRemoveFromCart = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    onRemoveFromCart(productId)
  }

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    onFavoriteChange(productId, !favorites[productId]) // toggle the current state
  }

  return (
    <div>
      {/* <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Top Saver Today</h2>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-700 to-transparent mb-6"></div>
        <p className="text-sm text-gray-600">
          Limited time offers on your favorite products
        </p>
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 6).map(product => {
          const quantitys = cart[product.id] || 0
          // const savings = product.originalPrice - product.salePrice
          const isFavorited = favorites[product.id] || false
          const isInStock = product.inStock;
          console.log('Product:', product.name, 'Product instock :', product.inStock, 'In Stock:', isInStock);

          return (
            <div
              key={product.id}
              className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200"
            >
              {/* Discount Badge */}
              {/* {savings > 0 && (
                <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-sm z-10">
                  ${savings.toFixed(0)} OFF
                </div>
              )} */}

              {/* Product Container */}
              <div className="flex gap-4 p-4 h-full">
                {/* Left Side - Info */}
                <div className="flex-1 flex flex-col">
                  {/* Product Name */}
                  <Link
                    href={`/product/${product.id}`}
                    className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight hover:text-blue-900 transition-colors"
                  >
                    {product.name}
                  </Link>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-blue-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice > product.salePrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Unit */}
                  <p className="text-xs text-gray-500 mb-4">{product.quantity}</p>

                  {/* Stock Status */}
                  <p className={`text-xs font-semibold mb-4 ${isInStock ? 'text-blue-800' : 'text-red-600'}`}>
                    {isInStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-auto" onClick={(e) => e.preventDefault()}>
                    <div className="flex gap-2 items-center">
                      {quantitys === 0 ? (
                        <button
                          onClick={(e) => handleAddToCart(product.id, e)}
                          disabled={!product.inStock}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold ${product.inStock
                              ? 'bg-blue-900 text-white hover:bg-blue-950'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div className="flex-1 bg-blue-950 text-white rounded-lg flex items-center justify-between px-3 py-2">
                          <button
                            onClick={(e) => handleRemoveFromCart(product.id, e)}
                            className="hover:opacity-80 transition-opacity font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="text-sm font-bold min-w-8 text-center">
                            {quantitys}
                          </span>
                          <button
                            onClick={(e) => handleAddToCart(product.id, e)}
                            className="hover:opacity-80 transition-opacity font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className={`p-2 rounded-lg transition-all duration-300 ${isFavorited
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-gray-100 text-gray-600'
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side - Image */}
                <Link href={`/product/${product.id}`} className="relative w-24 h-32 flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
                    sizes="100px"
                  />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found in this category.</p>
        </div>
      )}

    </div>
  )
}
