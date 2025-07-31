import Carousel from '@/components/component/Carousel'
import { Button } from '@/components/ui/button'
import { stripe } from '@/lib/stripe'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const products = await stripe.products.list({
    expand: ['data.default_price'],
    limit: 5,
    active: true,
  })

  return (
    <div className="bg-white text-gray-900 w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-[85vh] flex justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 py-20 relative z-10">
          {/* Left Content */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                TechHive
              </span>
            </h1>

            <p className="text-gray-700 text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed">
              Your one-stop destination for the latest <strong>smartphones, laptops, and accessories.</strong>
              <br />Shop top-tier tech and stay ahead of the curve with unbeatable deals.
            </p>

              <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105">
                <Link href={'/products'}>Browse Products</Link>
              </Button>

          </div>

          {/* Hero Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={products.data[0]?.images[0] || '/placeholder.png'}
              alt="Hero image"
              className="w-full max-w-[550px] rounded-2xl shadow-2xl border border-gray-200 transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="w-full flex justify-center px-4">
        <div className="w-full max-w-7xl pb-20">
          <h2 className="text-3xl md:text-4xl text-center font-bold my-10 text-gray-900">
            Featured Products
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
            Explore our handpicked selection of trending gadgets designed to boost your tech lifestyle.
          </p>
          <div className="bg-white rounded-2xl p-6 md:p-10 shadow-lg border border-gray-100">
            <Carousel products={products.data} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default page
