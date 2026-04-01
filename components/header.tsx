import { ShoppingCart, Heart, LogIn, LogOut, User, Settings } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context'
// import AuthPopup from './auth-popup'

interface HeaderProps {
  cartCount: number
  cartTotal?: number
  onCartClick: () => void
  favoritesCount?: number
  onFavoritesClick?: () => void
}

export default function Header({ cartCount, cartTotal = 0, onCartClick, favoritesCount = 0, onFavoritesClick = () => {} }: HeaderProps) {
  const [showAuthPopup, setShowAuthPopup] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { user, signOut } = useAuth()
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold">
              <span className="text-blue-900">Cash</span><span className="text-yellow-400">Carry</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1 mx-8">
            <Link href="/" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">HOME</Link>
            <Link href="/shop" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">SHOP</Link>
            <Link href="/about" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">ABOUT</Link>
            <Link href="/contact" className="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">CONTACT</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-900 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded border border-gray-200 dark:border-gray-700 hover:border-blue-900 dark:hover:border-blue-400 text-sm font-semibold"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
                
                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                    </div>
                    {/* <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center gap-2 font-medium border-b border-gray-200 dark:border-gray-700"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link> */}
                    <button
                      onClick={() => {
                        signOut()
                        setShowProfileMenu(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors px-3 py-2 rounded border border-gray-200 dark:border-gray-700 hover:border-green-600 dark:hover:border-green-400 text-sm font-semibold">
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
            
            {/* Favorites Button */}
            <button 
              onClick={onFavoritesClick}
              className="relative p-2 hover:bg-gray-100 rounded transition-colors group"
            >
              <Heart className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Favorites ({favoritesCount})
              </span>
            </button>

            {/* Cart Button */}
            {cartCount > 0 ? (
              <button
                onClick={onCartClick}
                className="bg-blue-900 hover:bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </button>
            ) : (
              <button
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-blue-800 transition-colors" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Cart
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* <AuthPopup 
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        message="Sign in or create an account to continue"
      /> */}
    </header>
  )
}
