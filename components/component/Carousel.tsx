'use client'

import React, { useEffect, useState } from 'react'
import Stripe from 'stripe'

interface ProductStripe {
  products: Stripe.Product[]
}

const Carousel = ({ products }: ProductStripe) => {
  const [current, setCurrent] = useState<number>(0)

  useEffect(() => {
    if (products.length === 0) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [products.length])

  if (products.length === 0) {
    return <div className="text-gray-500">No products available</div>
  }

  const product = products[current]
  const price = product.default_price as Stripe.Price | null
  const priceDisplay = price?.unit_amount 
    ? (price.unit_amount / 100).toFixed(2)
    : 'N/A'

  return (
    <div className="w-full flex justify-center ">
      <div className="relative w-full h-[400px]">
        {/* Product Image */}
        <img
          src={product?.images?.[0] || '/placeholder.png'}
          alt={product?.name || 'Product Image'}
          className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-200"
        />

        <div className="absolute top-0 left-0 w-full   p-4 bg-gradient-to-b from-black/70 to-transparent rounded-t-xl">
          <h3 className="text-white  text-lg font-semibold truncate">
            {product.name}
          </h3>
          <p className="text-blue-400 font-bold text-sm">${priceDisplay}</p>
        </div>
      </div>
    </div>
  )
}

export default Carousel
