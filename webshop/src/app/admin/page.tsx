'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import ProductManager from '@/components/admin/ProductManager'


export default function AdminPage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/') 
    }
  }, [user, router])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <ProductManager />
    </div>
  )
}
