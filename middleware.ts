import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',  
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/products(.*)',
])

const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID 

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth()

  // Admin route protection
  if (req.nextUrl.pathname.startsWith('/admin')) {
    await auth.protect()

    if (userId !== ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/', req.url)) 
    }
  }

  // All other private routes (including checkout) require authentication
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
