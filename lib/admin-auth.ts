import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

interface JWTPayload {
  userId: string
  email: string
  isAdmin: boolean
  iat?: number
  exp?: number
}

export async function verifyAdminToken(req: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized: No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.slice(7) // Remove "Bearer " prefix
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
      
      if (!decoded.isAdmin) {
        return NextResponse.json(
          { message: 'Forbidden: Admin access required' },
          { status: 403 }
        )
      }
      
      return null // Token is valid
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json(
          { message: 'Unauthorized: Token expired' },
          { status: 401 }
        )
      }
      throw error
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { message: 'Unauthorized: Invalid token' },
      { status: 401 }
    )
  }
}

export function getAdminFromToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded.isAdmin ? decoded : null
  } catch {
    return null
  }
}
