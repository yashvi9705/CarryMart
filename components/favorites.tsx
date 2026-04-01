'use client'

import { X, Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface FavoritesProps {
  products: any[]
  favorites: { [key: string]: boolean }
  onRemoveFavorite: (productId: string) => void
  onAddToCart: (productId: string) => void
  onClose: () => void
}

export default function Favorites({
  favorites,
  products,
  onRemoveFavorite,
  onAddToCart,
  onClose,
}: FavoritesProps) {
  const favoriteItems = Object.entries(favorites)
    .filter(([_, isFavorite]) => isFavorite)
    .map(([productId]) => {
      const product = products.find(p => p.id === productId)
      return { product, productId }
    })
    .filter(item => item.product)

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">My Favorites</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-5">
        {favoriteItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Heart className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No favorites yet</p>
            <p className="text-sm text-gray-500 mb-6">
              Add items to your favorites to save them for later
            </p>
            <Link
              href="/shop"
              className="text-blue-800 hover:text-blue-700 font-semibold text-sm"
            >
              Continue Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteItems.map(({ product, productId }) => (
              <div
                key={productId}
                className="flex gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product!.image}
                    alt={product!.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/product/${productId}`}
                      className="font-semibold text-gray-900 text-sm hover:text-blue-900 transition-colors line-clamp-2"
                    >
                      {product!.name}
                    </Link>
                    <p className="text-xs text-gray-600 mt-1">${product!.price.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAddToCart(productId)}
                      className="flex-1 bg-blue-900 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFavorite(productId)}
                      className="p-1 text-red-900 hover:bg-red-50 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
