'use server'

import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

export async function createProductAction(product: {
  name: string
  price: number
  imageUrl: string
  description?: string
}) {
  try {
    // Create a product in Stripe
    const stripeProduct = await stripe.products.create({
      name: product.name,
      images: [product.imageUrl],
      description: product.description,
    })

    // Create a price for the product
    const price = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(product.price * 100), // Convert to cents
      currency: 'usd',
    })

    // Set this price as the default price for the product
    await stripe.products.update(stripeProduct.id, {
      default_price: price.id,
    })

    return { 
      success: true, 
      productId: stripeProduct.id,
      priceId: price.id 
    }
  } catch (error) {
    console.error('Failed to create product:', error)
    throw new Error('Failed to create product')
  }
}

export async function fetchProductsAction() {
  try {
    // Fetch all active products from Stripe
    const products = await stripe.products.list({
      limit: 100,
      active: true,
      expand: ['data.default_price'],
    })

    // Map products to our format
    const productsWithPrices = products.data.map(product => {
      const defaultPrice = product.default_price as Stripe.Price | null
      
      return {
        id: product.id,
        name: product.name,
        price: defaultPrice?.unit_amount ? defaultPrice.unit_amount / 100 : 0, // Convert from cents
        imageUrl: product.images[0] || '',
        priceId: defaultPrice?.id,
        description: product.description || undefined,
        active: product.active,
      }
    })

    return productsWithPrices
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw new Error('Failed to fetch products')
  }
}

export async function deleteProductAction(id: string) {
  try {
    console.log('Starting deletion process for product:', id)
    
    // First, get the product to find the image URL and check default_price
    const product = await stripe.products.retrieve(id)
    console.log('Retrieved product:', product.name)
    console.log('Product default_price:', product.default_price)
    
    // Try to delete the image from Supabase bucket if it exists
    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0]
      console.log('Image URL to delete:', imageUrl)
      
      // Extract filename from URL - handle different URL formats
      let filename = ''
      try {
        const url = new URL(imageUrl)
        filename = url.pathname.split('/').pop() || ''
      } catch {
        // Fallback: try to extract from the last part of the URL
        filename = imageUrl.split('/').pop() || ''
      }
      
      console.log('Extracted filename:', filename)
      
      if (filename) {
        try {
          const { error } = await supabase.storage
            .from('products')
            .remove([filename])
          
          if (error) {
            console.error('Failed to delete image from bucket:', error)
            // Continue with deletion even if image deletion fails
          } else {
            console.log('Successfully deleted image from bucket')
          }
        } catch (bucketError) {
          console.error('Error deleting from bucket:', bucketError)
          // Continue with deletion even if image deletion fails
        }
      }
    } else {
      console.log('No images found for this product')
    }

    // NEW APPROACH: Instead of trying to delete, let's just archive the product
    // This is actually the recommended Stripe approach for "deleting" products
    console.log('Archiving product in Stripe (this is the recommended approach)...')
    
    // Update the product to be inactive instead of trying to delete it
    await stripe.products.update(id, {
      active: false,
      default_price: undefined
    })
    
    console.log('Successfully archived product')
    
    return { success: true }
  } catch (error) {
    console.error('Failed to delete product:', error)
    // Return more specific error information
    if (error instanceof Error) {
      throw new Error(`Failed to delete product: ${error.message}`)
    } else if (typeof error === 'object' && error !== null && 'message' in error) {
      throw new Error(`Failed to delete product: ${(error as any).message}`)
    } else {
      throw new Error('Failed to delete product: Unknown error')
    }
  }
}

export async function updateProductAction(id: string, updates: {
  name?: string
  price?: number
  imageUrl?: string
  description?: string
}) {
  try {
    const updateData: any = {}
    
    if (updates.name) updateData.name = updates.name
    if (updates.description) updateData.description = updates.description
    if (updates.imageUrl) updateData.images = [updates.imageUrl]

    // Update the product
    await stripe.products.update(id, updateData)

    // If price is being updated, create a new price and set it as default
    if (updates.price !== undefined) {
      const newPrice = await stripe.prices.create({
        product: id,
        unit_amount: Math.round(updates.price * 100),
        currency: 'usd',
      })

      // Set the new price as default
      await stripe.products.update(id, {
        default_price: newPrice.id,
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to update product:', error)
    throw new Error('Failed to update product')
  }
}
