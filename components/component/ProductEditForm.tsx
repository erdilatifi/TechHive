'use client'

import { useState, useRef } from 'react'
import { uploadImageClient } from '@/app/actions/supabase-actions'
import { updateProductAction } from '@/app/actions/stripe-actions'
import { toast } from 'sonner'
import { Product } from './types'

interface ProductEditFormProps {
  product: Product
  onProductUpdated: () => void
  onCancel: () => void
}

export default function ProductEditForm({ product, onProductUpdated, onCancel }: ProductEditFormProps) {
  const [editName, setEditName] = useState(product.name)
  const [editPrice, setEditPrice] = useState(product.price.toString())
  const [editDescription, setEditDescription] = useState(product.description || '')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    const toastId = toast.loading('Updating product...')
    
    try {
      let imageUrl = product.imageUrl

      if (editFile) {
        imageUrl = await uploadImageClient(editFile)
      }

      await updateProductAction(product.id, {
        name: editName,
        price: parseFloat(editPrice),
        imageUrl,
        description: editDescription,
      })

      setEditFile(null)
      
      // Reset the edit file input element
      if (editFileInputRef.current) {
        editFileInputRef.current.value = ''
      }
      
      onProductUpdated()

      toast.success('Product updated successfully!', { id: toastId })
    } catch (error) {
      console.error('Update product error:', error)
      if (error instanceof Error) {
        toast.error(`Product update failed: ${error.message}`, { id: toastId })
      } else {
        toast.error('Product update failed. Please try again.', { id: toastId })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditFile(null)
    
    // Reset the edit file input element
    if (editFileInputRef.current) {
      editFileInputRef.current.value = ''
    }
    
    onCancel()
    toast.info('Edit mode cancelled')
  }

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price (USD)"
          value={editPrice}
          onChange={(e) => setEditPrice(e.target.value)}
          className="border p-2 rounded"
          step="0.01"
          required
        />
      </div>
      <textarea
        placeholder="Product Description"
        value={editDescription}
        onChange={(e) => setEditDescription(e.target.value)}
        className="border p-2 rounded w-full h-24 resize-none"
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setEditFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-full"
        ref={editFileInputRef}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleCancelEdit}
          className="bg-gray-500 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
} 