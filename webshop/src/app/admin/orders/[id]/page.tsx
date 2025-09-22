'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = params!.id
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])
  

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch(`/api/admin/order-items?orderId=${orderId}`)
      const data = await res.json()
      setItems(data)
      setLoading(false)
    }

    if (user && user.role === 'admin') {
      fetchItems()
    }
  }, [orderId, user])

  if (!user || user.role !== 'admin') return null


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Narudžba #{orderId}</h1>

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-2 px-3">Proizvod</th>
              <th className="text-left py-2 px-3">Količina</th>
              <th className="text-left py-2 px-3">Cijena</th>
              <th className="text-left py-2 px-3">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2 px-3">
                  {item.title ?? (
                    <span className="text-red-500 italic">Proizvod nije pronađen</span>
                  )}
                </td>
                <td className="py-2 px-3">{item.quantity}</td>
                <td className="py-2 px-3">€{Number(item.price).toFixed(2)}</td>
                <td className="py-2 px-3">
                  €{(Number(item.price) * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
