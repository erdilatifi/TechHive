'use client'

import { useState, useEffect } from 'react'
import { fetchProductsAction } from '@/app/actions/stripe-actions'
import { toast } from 'sonner'
import ProductForm from '@/components/component/ProductForm'
import AdminProductList from '@/components/component/AdminProductList'
import { Product } from '@/components/component/types'

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      const data = await fetchProductsAction()
      setProducts(data)
    } catch (error) {
      console.error(error)
      toast.error('Unable to load products. Please try again.')
    }
  }

  return (
    <div className="p-4 sm:p-6 w-[90%] max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
        Admin Dashboard
      </h2>

      <ProductForm onProductCreated={loadProducts} />
      <AdminProductList products={products} onProductsChanged={loadProducts} />
    </div>
  )
}
