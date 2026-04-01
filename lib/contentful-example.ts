/**
 * CONTENTFUL INTEGRATION TEMPLATE
 * 
 * This file shows you exactly how to fetch and transform data from Contentful.
 * Copy the functions you need and adapt them to your setup.
 * 
 * Replace the mock data imports in your components with these functions.
 */

import { Product } from "./mock-data"

// import { Product } from './mock-data'

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || ''
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || ''
const baseUrl = 'https://cdn.contentful.com'

// TypeScript interfaces for Contentful responses
interface ContentfulFile {
  url: string
  fileName: string
  contentType: string
  details?: {
    size: number
    image?: {
      width: number
      height: number
    }
  }
}

interface ContentfulAsset {
  fields: {
    file: ContentfulFile
    title: string
  }
}

interface ContentfulImage {
  sys: { id: string; type: string }
  fields: ContentfulAsset['fields']
}

interface ContentfulProductFields {
  id: string
  name: string
  category: string
  description: string
  originalPrice: number
  salePrice: number
  unit: string
  discount: number
  image: ContentfulImage
  inStock: boolean
}

interface ContentfulProductEntry {
  sys: { id: string; type: string }
  fields: ContentfulProductFields
}

interface ContentfulResponse<T> {
  sys: { type: string }
  total: number
  skip: number
  limit: number
  items: T[]
}

/**
 * EXAMPLE 1: Fetch all products from Contentful
 * 
 * Usage:
 * ```
 * const products = await fetchProductsFromContentful()
 * ```
 */
export async function fetchProductsFromContentful(): Promise<Product[]> {
  try {
    const url = new URL(`${baseUrl}/spaces/${space}/entries`)
    url.searchParams.append('content_type', 'product')
    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('include', '1') // Include linked assets

    const response = await fetch(url.toString())
    const data: ContentfulResponse<ContentfulProductEntry> = await response.json()

    if (!response.ok) {
      throw new Error(`Contentful API error: ${data}`)
    }

    // Transform Contentful data to Product interface
    return data.items.map(item => transformProduct(item))
  } catch (error) {
    console.error('Error fetching products from Contentful:', error)
    // Return empty array on error (could also return mock data as fallback)
    return []
  }
}

/**
 * EXAMPLE 2: Fetch products by category
 * 
 * Usage:
 * ```
 * const groceries = await fetchProductsByCategory('groceries')
 * ```
 */
export async function fetchProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  try {
    const url = new URL(`${baseUrl}/spaces/${space}/entries`)
    url.searchParams.append('content_type', 'product')
    url.searchParams.append('fields.category', categoryId)
    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('include', '1')

    const response = await fetch(url.toString())
    const data: ContentfulResponse<ContentfulProductEntry> = await response.json()

    if (!response.ok) {
      throw new Error(`Contentful API error: ${data}`)
    }

    return data.items.map(item => transformProduct(item))
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error)
    return []
  }
}

/**
 * EXAMPLE 3: Search products by name
 * 
 * Usage:
 * ```
 * const results = await searchProducts('rice')
 * ```
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const url = new URL(`${baseUrl}/spaces/${space}/entries`)
    url.searchParams.append('content_type', 'product')
    url.searchParams.append('fields.name[match]', query) // Case-insensitive search
    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('include', '1')

    const response = await fetch(url.toString())
    const data: ContentfulResponse<ContentfulProductEntry> = await response.json()

    if (!response.ok) {
      throw new Error(`Contentful API error: ${data}`)
    }

    return data.items.map(item => transformProduct(item))
  } catch (error) {
    console.error(`Error searching for "${query}":`, error)
    return []
  }
}

/**
 * EXAMPLE 4: Fetch single product by ID
 * 
 * Usage:
 * ```
 * const product = await fetchProductById('prod_1')
 * ```
 */
export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const url = new URL(`${baseUrl}/spaces/${space}/entries`)
    url.searchParams.append('content_type', 'product')
    url.searchParams.append('fields.id', productId)
    url.searchParams.append('access_token', accessToken)
    url.searchParams.append('include', '1')

    const response = await fetch(url.toString())
    const data: ContentfulResponse<ContentfulProductEntry> = await response.json()

    if (!response.ok || data.items.length === 0) {
      return null
    }

    return transformProduct(data.items[0])
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error)
    return null
  }
}

/**
 * EXAMPLE 5: Fetch categories
 * 
 * Usage:
 * ```
 * const categories = await fetchCategories()
 * ```
 */
interface ContentfulCategoryFields {
  id: string
  label: string
  icon?: string
}

interface ContentfulCategoryEntry {
  sys: { id: string; type: string }
  fields: ContentfulCategoryFields
}

export async function fetchCategories() {
  try {
    const url = new URL(`${baseUrl}/spaces/${space}/entries`)
    url.searchParams.append('content_type', 'category')
    url.searchParams.append('access_token', accessToken)

    const response = await fetch(url.toString())
    const data: ContentfulResponse<ContentfulCategoryEntry> = await response.json()

    if (!response.ok) {
      throw new Error(`Contentful API error: ${data}`)
    }

    return data.items.map(item => ({
      id: item.fields.id,
      label: item.fields.label,
      icon: item.fields.icon || '📦',
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Helper: Transform Contentful product entry to Product interface
 */
function transformProduct(entry: ContentfulProductEntry): Product {
  const fields = entry.fields

  // Handle image URL - Contentful CDN URLs start with //
  let imageUrl = '/placeholder.png'
  if (fields.image?.fields?.file?.url) {
    imageUrl = fields.image.fields.file.url.startsWith('//')
      ? `https:${fields.image.fields.file.url}`
      : fields.image.fields.file.url
  }

  return {
    id: fields.id,
    name: fields.name,
    category: fields.category,
    description: fields.description || '',
    image: imageUrl,
    originalPrice: fields.originalPrice,
    salePrice: fields.salePrice,
    price: fields.salePrice, // Adding price property
    unit: fields.unit || '',
    discount: Math.round(((fields.originalPrice - fields.salePrice) / fields.originalPrice) * 100),
    inStock: fields.inStock ?? true,
  }
}