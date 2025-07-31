"use client";

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useCartStore } from "@/store/zustandStore";
import { FaOpencart } from "react-icons/fa6";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();

  const { items , clearCart} = useCartStore();
  const qunatity = items.reduce((acc, item) => item.quantity + acc, 0);

  const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
  const isAdmin = isLoaded && user?.id === ADMIN_USER_ID;


 useEffect(() => {
    if (isLoaded && !user) {
      clearCart();
    }
  }, [user, isLoaded, clearCart]);

  
  if (!isLoaded) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <img src="/logo.png" alt="Logo" style={{ height: "100px" }} />
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-7">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/checkout"
              className="relative text-gray-700 hover:text-gray-900 flex gap-2 items-center justify-center"
            >
              Checkout <FaOpencart />
              {qunatity > 0 && (
                <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {qunatity}
                </span>
              )}
            </Link>
                  <Link
            href="/profile"
            className="text-gray-700 hover:text-gray-900"
          >
            Profile
          </Link>
            {isAdmin && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Admin
              </Link>
            )}
          </div>

          {/* Auth buttons desktop */}
          <div className="hidden md:flex md:items-center gap-2">
            <SignedIn>
              <SignOutButton >
                <Button variant="outline">Sign Out</Button>
              </SignOutButton>

            </SignedIn>
            <SignedOut>
              <Button>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              
            </SignedOut>
            
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              {!menuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
          <Link
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Products
          </Link>
          <Link
            href="/checkout"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Checkout
          </Link>
                  <Link
            href="/profile"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Admin
            </Link>
          )}

          <SignedIn>
            <SignOutButton>
              <Button className="w-full mt-2" variant="outline">
                Sign Out
              </Button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Button className="w-full mt-2">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
