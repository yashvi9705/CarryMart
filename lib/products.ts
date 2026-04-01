// Product utilities for cart and order operations
import { mockProducts } from './mock-data'

export interface ProductForOrder {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

/**
 * Convert cart object to order items format
 * @param cart Cart object: { 'prod_1': 2, 'prod_5': 1 }
 * @returns Array of order items with product details
 */
export function convertCartToOrderItems(cart: { [key: string]: number }): ProductForOrder[] {
  return Object.entries(cart).map(([productId, quantity]) => {
    // Find product in mock data
    const product = mockProducts.find(p => p.id === productId)
    
    if (!product) {
      throw new Error(`Product not found: ${productId}`)
    }

    return {
      product_id: productId,
      product_name: product.name,
      quantity,
      unit_price: product.salePrice,
    }
  })
}

/**
 * Calculate total amount for order
 * @param items Order items array
 * @returns Total amount
 */
export function calculateOrderTotal(items: ProductForOrder[]): number {
  return items.reduce((total, item) => {
    return total + (item.unit_price * item.quantity)
  }, 0)
}

/**
 * Get product details by ID
 * @param productId Product ID to look up
 * @returns Product details or undefined
 */
export function getProductById(productId: string) {
  return mockProducts.find(p => p.id === productId)
}

/**
 * Get multiple products by IDs
 * @param productIds Array of product IDs
 * @returns Array of product details
 */
export function getProductsByIds(productIds: string[]) {
  return productIds.map(id => getProductById(id)).filter(Boolean)
}

/**
 * Format price for display
 * @param price Price in rupees
 * @returns Formatted price string
 */
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return `₹${numPrice.toFixed(2)}`
}

/**
 * Get discount percentage
 * @param originalPrice Original price
 * @param salePrice Sale price
 * @returns Discount percentage
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Validate order data before submission
 * @param formData Order form data
 * @returns Error message or null if valid
 */
export function validateOrderData(formData: any): string | null {
  if (!formData.fullName?.trim()) {
    return 'Full name is required'
  }
  
  if (!formData.email?.includes('@')) {
    return 'Valid email is required'
  }
  
  if (!formData.phone?.trim()) {
    return 'Phone number is required'
  }
  
  if (!formData.address?.trim()) {
    return 'Address is required'
  }
  
  if (!formData.city?.trim()) {
    return 'City is required'
  }
  
  if (!formData.state?.trim()) {
    return 'State is required'
  }
  
  if (!formData.postalCode?.trim()) {
    return 'Postal code is required'
  }
  
  if (!formData.country) {
    return 'Country is required'
  }
  
  return null
}

/**
 * Format order number for display
 * @param orderNumber Order number from database
 * @returns Formatted order number
 */
export function formatOrderNumber(orderNumber: string): string {
  return orderNumber.replace(/^ORD-/, 'Order #')
}

/**
 * Get shipping cost based on method
 * @param method Shipping method
 * @returns Shipping cost in rupees
 */
export function getShippingCost(method: string): number {
  switch (method) {
    case 'standard':
      return 0
    case 'express':
      return 99
    case 'overnight':
      return 199
    default:
      return 0
  }
}

/**
 * Get estimated delivery days
 * @param method Shipping method
 * @returns Number of days
 */
export function getEstimatedDays(method: string): number {
  switch (method) {
    case 'standard':
      return 5
    case 'express':
      return 2
    case 'overnight':
      return 1
    default:
      return 5
  }
}

/**
 * Format date for display
 * @param dateString ISO date string
 * @returns Formatted date
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get order status badge color
 * @param status Order status
 * @returns CSS classes for badge
 */
export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

/**
 * Get order status message
 * @param status Order status
 * @returns Human-readable status message
 */
export function getStatusMessage(status: string): string {
  switch (status) {
    case 'pending':
      return 'Waiting for confirmation'
    case 'confirmed':
      return 'Order confirmed, being prepared'
    case 'shipped':
      return 'On the way to you'
    case 'delivered':
      return 'Successfully delivered'
    case 'cancelled':
      return 'Order cancelled'
    default:
      return 'Unknown status'
  }
}
