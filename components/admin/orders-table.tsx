'use client'
import { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react'
import { jsPDF } from 'jspdf'
import { RefreshCw, AlertCircle, Check } from 'lucide-react'

interface Order {
  items: any
  id: string
  order_number: string
  user_id: string
  user_name: string
  user_email: string
  user_phone: string
  status: 'pending' | 'delivered'
  total_amount: number
  created_at: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_zip: string
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // NEW
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'delivered'>('all')
  const [search, setSearch] = useState('')

  // ✅ ADD FUNCTION HERE
  const downloadPDF = (order: Order) => {
    const doc = new jsPDF()

    doc.setFontSize(18)
    doc.text('Order Invoice', 14, 20)

    doc.setFontSize(11)
    doc.text(`Order #: ${order.order_number}`, 14, 30)

    let y = 50

    order.items.forEach((item: { product_name: any; quantity: any }) => {
      doc.text(`${item.product_name} x ${item.quantity}`, 14, y)
      y += 10
    })

    doc.text(`Total: $${order.total_amount}`, 14, y + 10)

    doc.save(`order-${order.order_number}.pdf`)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingId(orderId)
    setSuccessMessage('')
    try {
      const token = localStorage.getItem('admin-token')
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      )

      setSuccessMessage(`Order #${orderId} updated to ${newStatus}`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // FILTERED DATA
  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter

    const matchesSearch =
      order.user_name.toLowerCase().includes(search.toLowerCase()) ||
      order.user_email.toLowerCase().includes(search.toLowerCase())

    return matchesStatus && matchesSearch
  })

  // MONTHLY REVENUE
  const monthlyRevenue = orders.reduce((acc, order) => {
    const month = new Date(order.created_at).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    })

    acc[month] = (acc[month] || 0) + Number(order.total_amount)
    return acc
  }, {} as Record<string, number>)

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">All Orders</h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-700 text-white rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Search name/email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-lg w-64"
        />
      </div>

      {/* SUCCESS */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* MONTHLY REVENUE */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Monthly Revenue</h3>
        {Object.entries(monthlyRevenue).map(([month, total]) => (
          <div key={month} className="flex justify-between text-sm">
            <span>{month}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-slate-600">
            No orders found
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold">Order</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Address</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold w-[250px]">Items</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold">Date</th>
                {/* <th className="px-6 py-3 text-left text-xs font-semibold">Download</th> */}
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-sm">
                    {order.order_number.slice(0, 8)}
                  </td>

                  <td className="px-6 py-4 text-sm">{order.user_name}</td>

                  <td className="px-6 py-4 text-sm">{order.user_email}</td>

                  <td className="px-6 py-4 text-sm">{order.user_phone}</td>

                  <td className="px-6 py-4 text-sm max-w-xs w-[250px]">
                    <div className="whitespace-normal break-words">
                      {order.shipping_address}, {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-semibold">
                    ${Number(order.total_amount).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm align-top w-[250px]">
                    <div className="space-y-1">
                      {order.items?.map((item: { product_name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; quantity: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, i: Key | null | undefined) => (
                        <div key={i} className="flex justify-between gap-1">
                         <span className="truncate max-w-[160px] block">
                            {item.product_name}
                          </span>
                          <span className="font-medium whitespace-nowrap">
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>


                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as Order['status'])
                      }
                      disabled={updatingId === order.id}
                      className={`px-2 py-1 rounded ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 text-sm w-[1000px]">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>

                  {/* <td className="px-6 py-4">
  <button
    onClick={() => downloadPDF(order)}
    className="text-blue-600 hover:underline text-sm"
  >
    Download PDF
  </button>
</td> */}

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}