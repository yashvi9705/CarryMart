import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyAdminToken } from '@/lib/admin-auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authError = await verifyAdminToken(req)
    if (authError) {
      return authError
    }

    const { id } = await params
    const { status } = await req.json()

    if (!status) {
      return NextResponse.json(
        { message: 'Status is required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      )
    }

    // Update order status
    const result = await query(
      `UPDATE orders SET status = $1 WHERE id = $2
       RETURNING 
        id, order_number, user_id, status, total_amount, created_at`,
      [status, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      order: result.rows[0],
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
