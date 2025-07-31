// app/lib/uploadImageClient.ts
'use client'

import { supabase } from '@/lib/supabase'

export async function uploadImageClient(file: File) {
  const fileName = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file, {
      contentType: file.type,
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw new Error('Failed to upload image')
  }

  const { data: publicUrl } = supabase.storage
    .from('products')
    .getPublicUrl(fileName)

  return publicUrl.publicUrl
}
