import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// GET favorites for user
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
      'SELECT product_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )

    // Convert to object format
    const favorites: { [key: string]: boolean } = {}
    result.rows.forEach(row => {
      favorites[row.product_id] = true
    })

    return NextResponse.json({ favorites }, { status: 200 })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add to favorites
export async function POST(req: NextRequest) {
  try {
    const { userId, productId } = await req.json()

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO favorites (user_id, product_id) VALUES ($1, $2)
       ON CONFLICT (user_id, product_id) DO NOTHING`,
      [userId, productId]
    )

    return NextResponse.json(
      { message: 'Added to favorites' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Add to favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove from favorites
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
      'DELETE FROM favorites WHERE user_id = $1 AND product_id = $2',
      [userId, productId]
    )

    return NextResponse.json(
      { message: 'Removed from favorites' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove from favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
