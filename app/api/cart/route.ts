import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET cart items for user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const result = await query(
      'SELECT product_id, quantity FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )

    // Convert to object format
    const cart: { [key: string]: number } = {}
    result.rows.forEach(row => {
      cart[row.product_id] = row.quantity
    })

    return NextResponse.json({ cart }, { status: 200 })
  } catch (error) {
    console.error('Get cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add or update cart item
export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity } = await req.json()

    if (!userId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Delete if quantity is 0 or less
      await query(
        'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      )
    } else {
      // Upsert cart item
      await query(
        `INSERT INTO cart_items (user_id, product_id, quantity) 
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, product_id) 
         DO UPDATE SET quantity = $3, updated_at = CURRENT_TIMESTAMP`,
        [userId, productId, quantity]
      )
    }

    return NextResponse.json(
      { message: 'Cart updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update cart error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart
export async function DELETE(req: NextRequest) {
  try {
    const { userId, productId } = await req.json()

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await query(
      'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete cart item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
