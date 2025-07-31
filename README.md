# E-commerce Admin Dashboard

This is a [Next.js](https://nextjs.org) project with Stripe integration for e-commerce functionality and an admin dashboard for product management.

## Features

- **Admin Dashboard**: Create, update, and delete products
- **Product Management**: Upload images, set prices, and manage product details
- **Stripe Integration**: Secure payment processing
- **Authentication**: Protected admin routes with Clerk
- **Image Storage**: Supabase storage for product images

## Getting Started

### Prerequisites

1. **Stripe Account**: Set up a Stripe account and get your API keys
2. **Clerk Account**: Set up Clerk for authentication
3. **Supabase Account**: Set up Supabase for image storage

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### Supabase Setup

1. Create a new Supabase project
2. Create a storage bucket named `products` for image uploads
3. Set the bucket to public for image access
4. Configure CORS policies if needed

### Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Admin Access

Navigate to `/admin` to access the admin dashboard. You'll need to be authenticated with Clerk to access this page.

## Admin Features

- **Create Products**: Add new products with name, description, price, and image
- **Update Products**: Edit existing product details including price updates
- **Delete Products**: Remove products from your store
- **Image Upload**: Upload product images to Supabase storage
- **Real-time Updates**: See changes immediately after operations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
