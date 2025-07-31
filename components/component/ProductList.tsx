'use client'

import React, { useState, useMemo } from 'react'
import Product from './Product'
import Stripe from 'stripe'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface ProductListProps {
  products: Stripe.Product[]
}

const ProductList = ({ products }: ProductListProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Filter products based on searchTerm
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term)
    )
  }, [searchTerm, products])

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage)

  // Smooth scroll on page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Create pagination with ellipsis
  const generatePageNumbers = () => {
    const pages = []
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
    <div className="flex flex-col items-center justify-center mt-10">
      {/* Search */}
      <Input
        type="text"
        placeholder="Search by name or description..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setCurrentPage(1) // Reset page when searching
        }}
        className="max-w-lg mb-8 p-2 border border-gray-300 rounded"
      />

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <div>No products found.</div>
      ) : (
        <>
          <div className="max-w-[1400px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {paginatedProducts.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            {generatePageNumbers().map((page, index) =>
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={page === currentPage ? 'default' : 'outline'}
                  className={`px-4 ${page === currentPage ? ' text-white' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span key={index} className="px-2 text-gray-500">
                  {page}
                </span>
              )
            )}

            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductList
