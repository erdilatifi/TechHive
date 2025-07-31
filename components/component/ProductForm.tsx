'use client'

import { useState, useRef } from 'react'
import { uploadImageClient } from '@/app/actions/supabase-actions'
import { createProductAction } from '@/app/actions/stripe-actions'
import { toast } from 'sonner'

interface ProductFormProps {
  onProductCreated: () => void
}

export default function ProductForm({ onProductCreated }: ProductFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast.error('Please select a product image to continue.')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Creating product...')

    try {
      const imageUrl = await uploadImageClient(file)

      await createProductAction({
        name,
        price: parseFloat(price),
        imageUrl,
        description,
      })

      setName('')
      setPrice('')
      setDescription('')
      setFile(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      onProductCreated()

      toast.success('Product created successfully!', { id: toastId })
    } catch (error) {
      console.error('Create product error:', error)
      if (error instanceof Error) {
        toast.error(`Product creation failed: ${error.message}`, { id: toastId })
      } else {
        toast.error('Product creation failed. Please try again.', { id: toastId })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8 w-full mx-auto mb-10 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Price (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          step="0.01"
          min="0"
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          required
          disabled={loading}
        />
        <textarea
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none h-28"
          required
          disabled={loading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          ref={fileInputRef}
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
        >
          {loading ? 'Creating...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
