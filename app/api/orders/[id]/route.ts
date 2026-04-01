import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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
          'unit_price', oi.unit_price,
          'total_price', oi.total_price
        )) as items,
        json_build_object(
          'full_name', sd.full_name,
          'phone', sd.phone,
          'address', sd.address,
          'city', sd.city,
          'postal_code', sd.postal_code
        ) as shipping_details
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN shipping_details sd ON o.id = sd.order_id
       WHERE o.id = $1
       GROUP BY o.id, sd.id`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order: result.rows[0] }, { status: 200 })
  } catch (error) {
    console.error('Get order detail error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
