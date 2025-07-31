import ProductDetail from '@/components/component/ProductDetail'
import { stripe } from '@/lib/stripe'
import React from 'react'

interface PageProps {
  params: {
    id: string
  }
}

const page = async ({ params }: PageProps) => {
  const product = await stripe.products.retrieve(params.id, {
    expand: ['default_price'],
  })

  const setProduct = JSON.parse(JSON.stringify(product))

  return (
    <div className="w-full min-h-screen flex justify-center py-10">
      <ProductDetail product={setProduct} />
    </div>
  )
}

export default page
