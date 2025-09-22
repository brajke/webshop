'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

type Order = {
  id: number
  created_at: string
  total: string
  status: string
  items: {
    title: string
    quantity: number
    price: string
  }[]
}

export default function MyOrdersPage() {
  const { user } = useUser()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      const res = await fetch(`/api/user/my-orders?userId=${user.id}`)
      const data = await res.json()
      setOrders(data.orders)
    }

    fetchOrders()
  }, [user])

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Moje narudžbe</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Nema narudžbi za prikaz.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded bg-white shadow">
              <h3 className="text-lg font-semibold mb-2">
                Narudžba #{order.id} – {new Date(order.created_at).toLocaleDateString()} – 
                <span className="italic text-gray-600">{order.status}</span>
              </h3>
              <p className="mb-2 text-sm text-gray-600">Ukupno: €{order.total}</p>
              <ul className="space-y-1 text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.title} – {item.quantity} kom × €{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
