"use client";
import React from "react";
import Stripe from "stripe";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/zustandStore";
import Link from "next/link";

interface ProductProps {
  product: Stripe.Product;
}

const ProductDetail = ({ product }: ProductProps) => {
  const price = product.default_price as Stripe.Price | null;
  const { addItem, removeItem, items } = useCartStore();

  const quantity = items.find((p) => p.id === product.id)?.quantity || 0;

  const handleAddItem = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price?.unit_amount ? price.unit_amount / 100 : 0,
      image: product.images[0] || null,
      quantity: 1,
    });
  };

  return (
    <div className="max-w-[1200px] w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-10">
      {/* Left: Product Image */}
      <div className="flex-1 max-h-[500px] flex items-center justify-center">
        <img
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-cover rounded-xl border border-gray-100 shadow-sm"
        />
      </div>

      {/* Right: Product Details */}
      <div className="flex-1 flex flex-col gap-6 justify-start pt-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {product.name}
        </h1>

        <h4 className="text-2xl text-indigo-600 font-semibold">
          ${price?.unit_amount ? (price.unit_amount / 100).toFixed(2) : 'N/A'}
        </h4>

        <p className="text-gray-600 leading-relaxed">
          {product.description || "No description available for this product."}
        </p>

        <div className="flex items-center gap-4 mt-4">
          <Button
            onClick={() => removeItem(product.id)}
            className="bg-blue-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            -
          </Button>

          <span className="text-lg font-semibold">{quantity}</span>

          <Button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            +
          </Button>

          <Button variant="outline" className="px-6 py-2 rounded-lg ml-4">
            <Link href={"/products"}>Back to Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
