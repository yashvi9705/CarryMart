import { NextRequest, NextResponse } from 'next/server'
import { query, getClient } from '@/lib/db'

// GET orders for user
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
      `SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.created_at,
        json_agg(json_build_object(
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price
        )) as items,
        json_build_object(
          'full_name', sd.full_name,
          'phone', sd.phone,
          'address', sd.address,
          'city', sd.city,
          'postal_code', sd.postal_code,
        ) as shipping_details
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN shipping_details sd ON o.id = sd.order_id
       WHERE o.user_id = $1
       GROUP BY o.id, sd.id
       ORDER BY o.created_at DESC`,
      [userId]
    )

    return NextResponse.json({ orders: result.rows }, { status: 200 })
  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(req: NextRequest) {
  const client = await getClient()
  
  try {
    await client.query('BEGIN')

    const { userId, items, totalAmount, shippingDetails } = await req.json()

    if (!userId || !items || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, order_number, total_amount, status) 
       VALUES ($1, $2, $3, 'pending') 
       RETURNING id, order_number, total_amount, created_at`,
      [userId, orderNumber, totalAmount]
    )

    const orderId = orderResult.rows[0].id

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          item.product_id,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.quantity * item.unit_price
        ]
      )
    }

    // Insert shipping details
    if (shippingDetails) {
      await client.query(
        `INSERT INTO shipping_details (
          order_id, full_name, phone, address, city, postal_code
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          orderId,
          shippingDetails.full_name,
          shippingDetails.phone,
          shippingDetails.address,
          shippingDetails.city,
          shippingDetails.postal_code
        ]
      )
    }

    await client.query('COMMIT')

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: {
          id: orderId,
          order_number: orderResult.rows[0].order_number,
          total_amount: orderResult.rows[0].total_amount,
          created_at: orderResult.rows[0].created_at
        }
      },
      { status: 201 }
    )
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}
