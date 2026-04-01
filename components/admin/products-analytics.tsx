'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { getProducts, formatContentfulProduct, getCategories } from '@/lib/contentful'

interface DBSales {
  product_id: string
  units_sold: number
}

interface Product {
  id: string
  name: string
  category: string
  stock_quantity: number
}

interface Category {
  id: string
  label: string
}

export default function AdminProducts() {

  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<DBSales[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {

    setIsLoading(true)
    setError('')

    try {

      const token = localStorage.getItem('admin-token')

      // SALES DATA FROM DATABASE
      const salesRes = await fetch('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const salesData = await salesRes.json()

      // PRODUCTS FROM CONTENTFUL
      const contentfulProducts = await getProducts()
      const formatted = contentfulProducts.map(formatContentfulProduct)

      const productList = formatted.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category || 'uncategorized',
        stock_quantity: Number(p.unit) || 0
      }))

      setProducts(productList)

      // CATEGORIES FROM CONTENTFUL
      const contentfulCategories = await getCategories()

      const categoryList = contentfulCategories.map((c: any) => ({
        id: c.sys.id,
        label: c.fields.label
      }))

      setCategories(categoryList)

      setSales(salesData.sales || [])

    } catch (err) {

      console.error(err)
      setError('Failed to load analytics')

    } finally {

      setIsLoading(false)

    }

  }

  // Convert category ID → category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.label : 'Uncategorized'
  }

  // Merge sales with products
  const mergedProducts = products.map(product => {

    const sale = sales.find(s => s.product_id === product.id)

    const unitsSold = sale?.units_sold || 0

    return {
      ...product,
      unitsSold,
      remaining: product.stock_quantity - unitsSold
    }

  })

  // Group by category
  const grouped = mergedProducts.reduce((acc: any, product) => {

    if (!acc[product.category]) {
      acc[product.category] = []
    }

    acc[product.category].push(product)

    return acc

  }, {})

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        Loading products...
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h2 className="text-xl font-bold">
          Product Inventory
        </h2>

        <button
          onClick={loadData}
          className="flex gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg"
        >
          <RefreshCw className="w-4 h-4"/>
          Refresh
        </button>

      </div>

      {error && (

        <div className="p-4 bg-red-50 border border-red-200 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600"/>
          {error}
        </div>

      )}

      {/* CATEGORY TABLES */}

      {Object.keys(grouped).map(categoryId => (

        <div key={categoryId} className="bg-white rounded-lg shadow">

          <div className="p-6 border-b">

            <h3 className="text-lg font-semibold">
              {getCategoryName(categoryId)}
            </h3>

          </div>

          <table className="w-full">

            <thead className="bg-slate-50 border-b">

              <tr>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Product
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Stock
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Units Sold
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                  Remaining
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {grouped[categoryId].map((product: any) => (

                <tr key={product.id} className="hover:bg-slate-50">

                  <td className="px-6 py-4 text-sm font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {product.stock_quantity}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {product.unitsSold}
                  </td>

                  <td
                    className={`px-6 py-4 text-sm font-semibold ${
                      product.remaining <= 5
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}
                  >
                    {product.remaining}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
  
      ))}

    </div>
  )
}