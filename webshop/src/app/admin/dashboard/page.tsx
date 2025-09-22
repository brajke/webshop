'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

type Stats = {
  users: number
  orders: number
  revenue: number
  totalItems: number
  topProduct: string
  todayRevenue: number
  lastOrderId: number | null
}

export default function AdminDashboard() {
  const { user } = useUser()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])
  

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/admin/stats')
      const data = await res.json()
      setStats(data)
    }

    fetchStats()
  }, [user])

  if (!user || user.role !== 'admin') return null

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Statistika</h1>

      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Korisnici</h2>
            <p className="text-2xl">{stats.users}</p>
          </div>
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Narudžbe</h2>
            <p className="text-2xl">{stats.orders}</p>
          </div>
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Zarada (€)</h2>
            <p className="text-2xl">{stats.revenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Najprodavaniji proizvod</h2>
            <p className="text-base">{stats.topProduct}</p>
          </div>
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Zarada danas (€)</h2>
            <p className="text-2xl">{stats.todayRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow p-4 rounded border">
            <h2 className="text-xl font-semibold">Zadnja narudžba</h2>
            <p className="text-2xl">#{stats.lastOrderId ?? 'N/A'}</p>
          </div>
        </div>
      ) : (
        <p className="text-center">Učitavanje statistike...</p>
      )}
    </div>
  )
}
