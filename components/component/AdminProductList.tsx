'use client'

import { useState, useMemo } from 'react'
import { deleteProductAction } from '@/app/actions/stripe-actions'
import { toast } from 'sonner'
import ProductEditForm from './ProductEditForm'
import { Product } from './types'
import { Button } from '../ui/button'

// Import shadcn alert-dialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog' // adjust path if needed

interface AdminProductListProps {
  products: Product[]
  onProductsChanged: () => void
}

export default function AdminProductList({ products, onProductsChanged }: AdminProductListProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 6

  // AlertDialog state
  const [alertOpen, setAlertOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const totalPages = Math.ceil(products.length / productsPerPage)

  // Pagination slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage
    return products.slice(start, start + productsPerPage)
  }, [products, currentPage])

  // Pagination and other handlers...

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    toast.info(`Editing: ${product.name}`)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
  }

  const handleProductUpdated = () => {
    setEditingProduct(null)
    onProductsChanged()
  }

  // Open alert dialog and set product to delete
  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setAlertOpen(true)
  }

  // Confirm delete action
  const confirmDelete = async () => {
    if (!productToDelete) return

    setAlertOpen(false)
    const toastId = toast.loading('Deleting product...')

    try {
      await deleteProductAction(productToDelete.id)
      onProductsChanged()
      toast.success('Product deleted successfully!', { id: toastId })
    } catch (error) {
      console.error('Delete error:', error)
      if (error instanceof Error) {
        toast.error(`Product deletion failed: ${error.message}`, { id: toastId })
      } else {
        toast.error('Product deletion failed. Please try again.', { id: toastId })
      }
    }

    setProductToDelete(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const generatePageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    return pages
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
        Product Inventory
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500 italic">No products yet.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-6" aria-label="Product list">
            {paginatedProducts.map((product) => (
              <li
                key={product.id}
                className="border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                {editingProduct?.id === product.id ? (
                  <div className="w-full">
                    <ProductEditForm
                      product={product}
                      onProductUpdated={handleProductUpdated}
                      onCancel={handleCancelEdit}
                    />
                  </div>
                ) : (
                  <>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full max-w-[100px] h-auto rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="font-semibold text-lg truncate">{product.name}</p>
                      <p className="text-indigo-600 font-semibold mt-1">${product.price.toFixed(2)}</p>
                      {product.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 sm:flex-col sm:justify-center items-center">
                      <Button
                        onClick={() => handleEdit(product)}
                        className="bg-indigo-600 hover:bg-indigo-700 focus:ring-purple-500 sm:w-full "
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(product)}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 sm:w-full"
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-8 flex justify-center gap-3 flex-wrap" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-indigo-100 text-indigo-600 disabled:text-indigo-300 disabled:bg-gray-100"
                aria-label="Previous page"
              >
                Prev
              </button>

              {generatePageNumbers().map((page, idx) =>
                typeof page === 'number' ? (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={`px-3 py-1 rounded ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white'
                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                    }`}
                  >
                    {page}
                  </button>
                ) : (
                  <span
                    key={idx}
                    className="px-3 py-1 text-gray-500 select-none"
                    aria-hidden="true"
                  >
                    {page}
                  </span>
                )
              )}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-indigo-100 text-indigo-600 disabled:text-indigo-300 disabled:bg-gray-100"
                aria-label="Next page"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      {/* AlertDialog */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{productToDelete?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
