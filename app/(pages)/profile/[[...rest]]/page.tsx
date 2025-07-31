'use client'

import { UserProfile } from '@clerk/nextjs'

export default function ProfilePage() {
  return (
    <div className=" p-6 flex items-center justify-center">
      <UserProfile routing="hash" />
    </div>
  )
}
