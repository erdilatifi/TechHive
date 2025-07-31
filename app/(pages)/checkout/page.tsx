'use client'
import { checkoutAction } from '@/app/actions/stripe-checkout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useCartStore } from '@/store/zustandStore'
import Link from 'next/link'
import { FaOpencart } from "react-icons/fa6";
import React from 'react'

const Page = () => {
  const { items, clearCart } = useCartStore()

  const stringifiedItems = JSON.stringify(items)
  const total = items.reduce((acc, pr) => acc + pr.price * pr.quantity, 0)

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-50">
      <Card className="w-[90%] max-w-2xl rounded-2xl shadow-lg p-6">
        <CardContent className="space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <FaOpencart className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-lg text-gray-500 mb-4">Your cart is empty</p>
              <Link href="/products">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            items.map((pr) => (
              <div
                key={pr.id}
                className="flex items-center gap-5 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition border border-gray-200"
              >
                <div className="w-[80px] h-[80px] flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <img
                    src={pr.image || '/placeholder.png'}
                    alt={pr.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{pr.name}</p>
                  <p className="text-sm text-gray-500">${pr.price.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">x {pr.quantity}</p>
                </div>
              </div>
            ))
          )}

          {items.length > 0 && (
            <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          )}
        </CardContent>

        {items.length > 0 && (
          <CardFooter className="flex justify-between pt-4">
            <Button
              onClick={clearCart}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Clear Cart
            </Button>
            <form action={checkoutAction}>
              <input type="hidden" name="items" value={stringifiedItems} />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Proceed to Payment
              </Button>
            </form>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

export default Page
