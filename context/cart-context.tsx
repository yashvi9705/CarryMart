// 'use client'

// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// interface CartContextType {
//   cart: { [key: string]: number }
//   favorites: { [key: string]: boolean }
//   addToCart: (productId: string, quantity?: number) => void
//   removeFromCart: (productId: string) => void
//   clearCart: () => void
//   addToFavorites: (productId: string) => void
//   removeFromFavorites: (productId: string) => void
// }

// const CartContext = createContext<CartContextType | undefined>(undefined)

// export function CartProvider({ children }: { children: ReactNode }) {

//   const [cart, setCart] = useState<{ [key: string]: number }>({})
//   const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})

//   // ✅ Load cart from localStorage
//   useEffect(() => {
//     const storedCart = localStorage.getItem('cart')
//     const storedFavorites = localStorage.getItem('favorites')

//     if (storedCart) {
//       setCart(JSON.parse(storedCart))
//     }

//     if (storedFavorites) {
//       setFavorites(JSON.parse(storedFavorites))
//     }
//   }, [])

//   // ✅ Save cart when it changes
//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart))
//   }, [cart])

//   useEffect(() => {
//     localStorage.setItem('favorites', JSON.stringify(favorites))
//   }, [favorites])

//   const addToCart = (productId: string, quantity: number = 1) => {
//     setCart(prev => ({
//       ...prev,
//       [productId]: (prev[productId] || 0) + quantity
//     }))
//   }

//   const removeFromCart = (productId: string) => {
//     setCart(prev => {
//       const newCart = { ...prev }

//       if (newCart[productId] > 1) {
//         newCart[productId]--
//       } else {
//         delete newCart[productId]
//       }

//       return newCart
//     })
//   }

//   const clearCart = () => {
//     setCart({})
//   }

//   const addToFavorites = (productId: string) => {
//     setFavorites(prev => ({
//       ...prev,
//       [productId]: true
//     }))
//   }

//   const removeFromFavorites = (productId: string) => {
//     setFavorites(prev => ({
//       ...prev,
//       [productId]: false
//     }))
//   }

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         favorites,
//         addToCart,
//         removeFromCart,
//         clearCart,
//         addToFavorites,
//         removeFromFavorites,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   )
// }

// export function useCart() {
//   const context = useContext(CartContext)

//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider')
//   }

//   return context
// }


'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useAuth } from './auth-context'

interface CartContextType {
  cart: { [key: string]: number }
  favorites: { [key: string]: boolean }
  isLoading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  syncWithServer: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState(false)

  // Load cart and favorites on mount or when user changes
  useEffect(() => {
    if (user?.id) {
      syncWithServer()
    } else {
      // Load from localStorage if not logged in
      const storedCart = localStorage.getItem('cart')
      const storedFavorites = localStorage.getItem('favorites')
      if (storedCart) setCart(JSON.parse(storedCart))
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites))
    }
  }, [user?.id])

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!user?.id) {
      localStorage.setItem('cart', JSON.stringify(cart))
      localStorage.setItem('favorites', JSON.stringify(favorites))
    }
  }, [cart, favorites, user?.id])

  const syncWithServer = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      // Fetch cart
      const cartResponse = await fetch(`/api/cart?userId=${user.id}`)
      if (cartResponse.ok) {
        const { cart: serverCart } = await cartResponse.json()
        setCart(serverCart)
      }

      // Fetch favorites
      const favResponse = await fetch(`/api/favorites?userId=${user.id}`)
      if (favResponse.ok) {
        const { favorites: serverFavorites } = await favResponse.json()
        setFavorites(serverFavorites)
      }
    } catch (error) {
      console.error('Failed to sync with server:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (user?.id) {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId,
            quantity: (cart[productId] || 0) + quantity,
          }),
        })
        setCart(prev => ({
          ...prev,
          [productId]: (prev[productId] || 0) + quantity
        }))
      } catch (error) {
        console.error('Failed to add to cart:', error)
      }
    } else {
      setCart(prev => ({
        ...prev,
        [productId]: (prev[productId] || 0) + quantity
      }))
    }
  }

  const removeFromCart = async (productId: string) => {
    if (user?.id) {
      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId }),
        })
      } catch (error) {
        console.error('Failed to remove from cart:', error)
      }
    }

    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId]--
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const clearCart = async () => {
    if (user?.id) {
      try {
        await fetch('/api/cart/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        })
      } catch (error) {
        console.error('Failed to clear cart:', error)
      }
    }
    setCart({})
  }

  const addToFavorites = async (productId: string) => {
    if (user?.id) {
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId }),
        })
      } catch (error) {
        console.error('Failed to add to favorites:', error)
      }
    }
    setFavorites(prev => ({
      ...prev,
      [productId]: true
    }))
  }

  const removeFromFavorites = async (productId: string) => {
    if (user?.id) {
      try {
        await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId }),
        })
      } catch (error) {
        console.error('Failed to remove from favorites:', error)
      }
    }
    setFavorites(prev => {
      const newFav = { ...prev }
      delete newFav[productId]
      return newFav
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        favorites,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        addToFavorites,
        removeFromFavorites,
        syncWithServer,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
