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

    // Fetch product sales summary
    const salesResult = await query(`
      SELECT 
        product_id,
        SUM(quantity) AS units_sold,
        SUM(total_price) AS total_revenue,
        COUNT(DISTINCT order_id) AS order_count
      FROM order_items
      GROUP BY product_id
      ORDER BY total_revenue DESC
    `)

    // Fetch product details by user
    const detailsResult = await query(`
      SELECT 
        oi.product_id,
        oi.product_name,
        u.name AS user_name,
        u.email AS user_email,
        oi.quantity,
        oi.unit_price AS price,
        o.created_at AS order_date
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `)

    return NextResponse.json({
      sales: salesResult.rows,
      details: detailsResult.rows,
    })
  } catch (error) {
    console.error('Error fetching product analytics:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
