// 'use client'

// import { useSearchParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import { useAuth } from '@/context/auth-context'
// import Link from 'next/link'
// import html2canvas from 'html2canvas'
// import jsPDF from 'jspdf'
// import { useRef } from 'react'
// import { Download } from "lucide-react";

// interface Order {
//   id: number
//   order_number: string
//   total_amount: string
//   status: string
//   created_at: string
//   items: Array<{
//     product_id: string
//     product_name: string
//     quantity: number
//     unit_price: string
//   }>
//   shipping_details: {
//     full_name: string
//     email: string
//     phone: string
//     address: string
//     city: string
//     state: string
//     postal_code: string
//     country: string
//   }
// }

// export default function OrderSuccessPage() {
//   const invoiceRef = useRef<HTMLDivElement>(null)
//   const searchParams = useSearchParams()
//   const { user } = useAuth()
//   const [order, setOrder] = useState<Order | null>(null)
//   const [isLoading, setIsLoading] = useState(true)

//   const orderId = searchParams.get('orderId')
//   const orderNumber = searchParams.get('orderNumber')



//   // const downloadInvoice = async () => {
//   //   if (!invoiceRef.current) return
//   //   const canvas = await html2canvas(invoiceRef.current!, {
//   //     backgroundColor: "#ffffff",
//   //     useCORS: true,
//   //     scale: 2
//   //   })
  
//   //   const imgData = canvas.toDataURL('image/png')
  
//   //   const pdf = new jsPDF('p', 'mm', 'a4')
  
//   //   const imgWidth = 210
//   //   const imgHeight = (canvas.height * imgWidth) / canvas.width
  
//   //   pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
  
//   //   pdf.save(`order-${order?.order_number}.pdf`)
//   // }

//   useEffect(() => {
//     if (!orderId || !user) return

//     const fetchOrder = async () => {
//       try {
//         const response = await fetch(`/api/orders/${orderId}`)
//         if (response.ok) {
//           const { order } = await response.json()
//           setOrder(order)
//         }
//       } catch (error) {
//         console.error('Failed to fetch order:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchOrder()
//   }, [orderId, user])

//   if (isLoading) {
//     return <div className="text-center py-12">Loading order details...</div>
//   }

//   if (!order) {
//     return <div className="text-center py-12">Order not found</div>
//   }

//   return (
    
// <div
//   ref={invoiceRef}
//   style={{
//     backgroundColor: "#ffffff",
//     color: "#000000",
//     padding: "24px",
//     maxWidth: "800px",
//     margin: "0 auto"
//   }}
// >    <div className="flex justify-end">
//   {/* <button
//     onClick={downloadInvoice}
//     className="flex items-center gap-2 px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
//   >
//     <Download size={18} />
//     Download Invoice
//   </button> */}
// </div>

//       <div className="text-center mb-8">
//         <div className="text-6xl mb-4">✓</div>
//         <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
//         <p className="text-gray-600">
//           Thank you for your purchase. Your order has been confirmed.
//         </p>
//       </div>

//       {/* Order Details */}
//       <div className="grid grid-cols-2 gap-6 mb-8">
//         <div className="border rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Order Information</h2>
//           <div className="space-y-2">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Order Number:</span>
//               <span className="font-semibold">{order.order_number}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Order Date:</span>
//               <span>{new Date(order.created_at).toLocaleDateString()}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Status:</span>
//               <span className="capitalize bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
//                 {order.status}
//               </span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Total Amount:</span>
//               <span className="font-semibold text-lg">₹{order.total_amount}</span>
//             </div>
//           </div>
//         </div>

//         <div className="border rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Shipping To</h2>
//           <div className="space-y-1 text-sm">
//             <p className="font-semibold">{order.shipping_details.full_name}</p>
//             <p>{order.shipping_details.address}</p>
//             <p>
//               {order.shipping_details.city}, {order.shipping_details.state}{' '}
//               {order.shipping_details.postal_code}
//             </p>
//             <p>{order.shipping_details.country}</p>
//             <p className="mt-2">{order.shipping_details.phone}</p>
//           </div>
//         </div>
//       </div>

//       {/* Order Items */}
//       <div className="border rounded-lg p-6 mb-8">
//         <h2 className="text-lg font-semibold mb-4">Order Items</h2>
//         <div className="space-y-3">
//           {order.items && order.items.map((item, index) => (
//             <div key={index} className="flex justify-between items-center border-b pb-3">
//               <div>
//                 <p className="font-medium">{item.product_name}</p>
//                 <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
//               </div>
//               <span className="font-semibold">
//                 ₹{(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Next Steps */}
//       {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
//         <h3 className="font-semibold mb-3">What's Next?</h3>
//         <ul className="space-y-2 text-sm"> */}
//           {/* <li>✓ Order confirmation email sent to {order.shipping_details.email}</li> */}
//           {/* <li>✓ We'll notify you when your order ships</li> */}
//           {/* <li>✓ Download your invoice</li>
//           <li>✓ Estimated delivery: 1-2 business days</li>
//         </ul>
//       </div> */}

//       {/* CTA Buttons */}
//       <div className="flex gap-4 justify-center">
//         <Link
//           href="/shop"
//           className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
//         >
//           Continue Shopping
//         </Link>
//         {/* <Link
//           href="/orders"
//           className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
//         >
//           View All Orders
//         </Link> */}
//       </div>
//     </div>
//   )
// }

import { Suspense } from "react";
import OrderSuccessContent from "./OrderSuccessContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}