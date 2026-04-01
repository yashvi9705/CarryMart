'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/auth-context'
import Link from 'next/link'

interface Order {
  id: number
  order_number: string
  total_amount: string
  status: string
  created_at: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${user.id}`)
        if (response.ok) {
          const { orders } = await response.json()
          setOrders(orders)
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to view your orders</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading orders...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Start shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div
            key={order.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold">{order.order_number}</p>
                <p className="text-sm text-gray-600">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="capitalize px-3 py-1 rounded bg-yellow-100 text-yellow-800 text-sm">
                {order.status}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">₹{order.total_amount}</span>
              <Link
                href={`/order-success?orderId=${order.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}