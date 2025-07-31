import { stripe } from '@/lib/stripe'
import ProductList from '@/components/component/ProductList'

const Page = async () => {
  const products = await stripe.products.list({
    expand: ['data.default_price'],
    active: true,
  })

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ProductList products={products.data} />
    </div>
  )
}

export default Page
