import React from 'react'
import Stripe from 'stripe'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import Link from 'next/link'

interface ProductProps {
  product: Stripe.Product
}

const Product = ({ product }: ProductProps) => {
  const price = product.default_price as Stripe.Price | null

  return (
    <Card className="flex w-[370px] flex-col hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        <img
          src={product.images[0] || '/placeholder.png'}
          alt={product.name || 'product image'}
          className="w-full h-64  p-4  object-cover object-center "
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 gap-2">
        <h2 className="text-lg font-semibold text-gray-900 truncate w-full">
          {product.name}
        </h2>
        <p className="text-indigo-600 font-bold text-md">
          ${price?.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A'}
        </p>
        <Button className="self-stretch mt-2 text-white font-semibold  rounded-md py-2">
          <Link href={`products/${product.id}`} className="w-full text-center">
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Product
