import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authError = await verifyAdminToken(req)
    if (authError) {
      return authError
    }

    // Fetch all orders with customer and shipping details
    const result = await query(`
      SELECT 
    o.id,
    o.order_number,
    o.user_id,
    sd.full_name as user_name,
    u.email as user_email,
    sd.phone as user_phone,
    o.status,
    o.total_amount,
    o.created_at,
    sd.address as shipping_address,
    sd.city as shipping_city,
    sd.postal_code as shipping_zip,

    -- 👇 AGGREGATE ITEMS
    COALESCE(
      json_agg(
        json_build_object(
          'product_name', oi.product_name,
          'quantity', oi.quantity,
          'price', oi.unit_price
        )
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'
    ) as items

  FROM orders o
  JOIN users u ON o.user_id = u.id
  LEFT JOIN shipping_details sd ON o.id = sd.order_id

  -- 👇 NEW JOINS
  LEFT JOIN order_items oi ON o.id = oi.order_id
  LEFT JOIN products p ON oi.product_id = p.id

  GROUP BY 
    o.id, u.email, sd.full_name, sd.phone, sd.address, sd.city, sd.postal_code

  ORDER BY o.created_at DESC
    `)

    return NextResponse.json({
      orders: result.rows,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
