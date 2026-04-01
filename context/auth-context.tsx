// 'use client'

// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

// export interface User {
//   id: string
//   email: string
//   name: string
//   address?: string
//   profilePicture?: string // base64 encoded image
//   theme?: 'light' | 'dark'
// }

// interface AuthContextType {
//   user: User | null
//   isLoading: boolean
//   signUp: (email: string, password: string, name: string) => Promise<void>
//   signIn: (email: string, password: string) => Promise<void>
//   signOut: () => void
//   updateUserProfile: (updates: Partial<User>) => Promise<void>
//   changePassword: (oldPassword: string, newPassword: string) => Promise<void>
//   changeEmail: (newEmail: string, password: string) => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   // Load user from localStorage on mount
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('carrymart-user')
//       if (storedUser) {
//         setUser(JSON.parse(storedUser))
//       }
//     } catch (error) {
//       console.error('Failed to load user from localStorage:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   const signUp = async (email: string, password: string, name: string) => {
//     // Validate inputs
//     if (!email || !password || !name) {
//       throw new Error('All fields are required')
//     }
//     if (password.length < 6) {
//       throw new Error('Password must be at least 6 characters')
//     }
//     if (!email.includes('@')) {
//       throw new Error('Please enter a valid email')
//     }

//     // Check if user already exists
//     const existingUsers = localStorage.getItem('carrymart-users')
//     const users = existingUsers ? JSON.parse(existingUsers) : []
//     if (users.some((u: any) => u.email === email)) {
//       throw new Error('Email already registered')
//     }

//     // Hash password (simple for demo - in production use proper hashing)
//     const hashedPassword = btoa(password)

//     // Create new user
//     const newUser = {
//       id: Date.now().toString(),
//       email,
//       name,
//       password: hashedPassword,
//     }

//     // Store user
//     users.push(newUser)
//     localStorage.setItem('carrymart-users', JSON.stringify(users))

//     // Set current user
//     const { password: _, ...userWithoutPassword } = newUser
//     setUser(userWithoutPassword)
//     localStorage.setItem('carrymart-user', JSON.stringify(userWithoutPassword))
//   }

//   const signIn = async (email: string, password: string) => {
//     // Validate inputs
//     if (!email || !password) {
//       throw new Error('Email and password are required')
//     }

//     // Find user
//     const existingUsers = localStorage.getItem('carrymart-users')
//     const users = existingUsers ? JSON.parse(existingUsers) : []
//     const foundUser = users.find((u: any) => u.email === email && u.password === btoa(password))

//     if (!foundUser) {
//       throw new Error('Invalid email or password')
//     }

//     // Set current user
//     const { password: _, ...userWithoutPassword } = foundUser
//     setUser(userWithoutPassword)
//     localStorage.setItem('carrymart-user', JSON.stringify(userWithoutPassword))
//   }

//   const signOut = () => {
//     setUser(null)
//     localStorage.removeItem('carrymart-user')
//   }

//   const updateUserProfile = async (updates: Partial<User>) => {
//     if (!user) throw new Error('No user logged in')

//     // Get all users and find current user
//     const existingUsers = localStorage.getItem('carrymart-users')
//     const users = existingUsers ? JSON.parse(existingUsers) : []
//     const userIndex = users.findIndex((u: any) => u.id === user.id)

//     if (userIndex === -1) throw new Error('User not found')

//     // Update user
//     const updatedUser = { ...users[userIndex], ...updates }
//     users[userIndex] = updatedUser

//     // Save to localStorage
//     localStorage.setItem('carrymart-users', JSON.stringify(users))
//     const { password: _, ...userWithoutPassword } = updatedUser
//     setUser(userWithoutPassword)
//     localStorage.setItem('carrymart-user', JSON.stringify(userWithoutPassword))
//   }

//   const changePassword = async (oldPassword: string, newPassword: string) => {
//     if (!user) throw new Error('No user logged in')
//     if (newPassword.length < 6) {
//       throw new Error('New password must be at least 6 characters')
//     }

//     // Get all users and find current user
//     const existingUsers = localStorage.getItem('carrymart-users')
//     const users = existingUsers ? JSON.parse(existingUsers) : []
//     const foundUser = users.find((u: any) => u.id === user.id)

//     if (!foundUser || foundUser.password !== btoa(oldPassword)) {
//       throw new Error('Current password is incorrect')
//     }

//     // Update password
//     foundUser.password = btoa(newPassword)
//     const userIndex = users.findIndex((u: any) => u.id === user.id)
//     users[userIndex] = foundUser

//     // Save to localStorage
//     localStorage.setItem('carrymart-users', JSON.stringify(users))
//   }

//   const changeEmail = async (newEmail: string, password: string) => {
//     if (!user) throw new Error('No user logged in')
//     if (!newEmail.includes('@')) throw new Error('Please enter a valid email')

//     // Get all users and find current user
//     const existingUsers = localStorage.getItem('carrymart-users')
//     const users = existingUsers ? JSON.parse(existingUsers) : []
//     const foundUser = users.find((u: any) => u.id === user.id)

//     if (!foundUser || foundUser.password !== btoa(password)) {
//       throw new Error('Password is incorrect')
//     }

//     // Check if new email already exists
//     if (users.some((u: any) => u.email === newEmail && u.id !== user.id)) {
//       throw new Error('Email already in use')
//     }

//     // Update email
//     foundUser.email = newEmail
//     const userIndex = users.findIndex((u: any) => u.id === user.id)
//     users[userIndex] = foundUser

//     // Save to localStorage
//     localStorage.setItem('carrymart-users', JSON.stringify(users))
//     const { password: _, ...userWithoutPassword } = foundUser
//     setUser(userWithoutPassword)
//     localStorage.setItem('carrymart-user', JSON.stringify(userWithoutPassword))
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         signUp,
//         signIn,
//         signOut,
//         updateUserProfile,
//         changePassword,
//         changeEmail,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }
//   return context
// }


'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface User {
  id: number
  email: string
  name: string
  address?: string
  profilePicture?: string
  theme?: 'light' | 'dark'
  is_admin?: boolean 
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  updateUserProfile: (updates: Partial<User>) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
  changeEmail: (newEmail: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('carrymart-user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error('All fields are required')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }
    if (!email.includes('@')) {
      throw new Error('Please enter a valid email')
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign up failed')
    }

    const data = await response.json()
    setUser(data.user)
    localStorage.setItem('carrymart-user', JSON.stringify(data.user))
  }

  const signIn = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Sign in failed')
    }

    const data = await response.json()
    setUser(data.user)
    localStorage.setItem('carrymart-user', JSON.stringify(data.user))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('carrymart-user')
  }

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in')
    // Implement profile update endpoint
    throw new Error('Not implemented')
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) throw new Error('No user logged in')
    // Implement password change endpoint
    throw new Error('Not implemented')
  }

  const changeEmail = async (newEmail: string, password: string) => {
    if (!user) throw new Error('No user logged in')
    // Implement email change endpoint
    throw new Error('Not implemented')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signUp,
        signIn,
        signOut,
        updateUserProfile,
        changePassword,
        changeEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

