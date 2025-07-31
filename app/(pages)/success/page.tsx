'use client'
import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/store/zustandStore'

const SuccessPage = () => {

    const {clearCart} = useCartStore();

    useEffect(()=>{
        clearCart();
    },[])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 w-full px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been successfully placed, and we’ll send you a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-3">
          <Link href="/products">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
