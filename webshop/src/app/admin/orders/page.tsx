'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'


type Order = {
  id: number
  name: string
  email: string
  address: string
  payment_method: string
  total: number
  created_at: string
  status: string
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])

  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOrders()
    }
  }, [user])
  

  const fetchOrders = async () => {
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data)
    setLoading(false)
  }

  const fetchItems = async (orderId: number) => {
    setSelectedOrderId(orderId)
    const res = await fetch(`/api/admin/order-items?orderId=${orderId}`)
    const data = await res.json()
    setOrderItems(data)
  }

  const updateStatus = async (orderId: number, status: string) => {
    await fetch('/api/admin/update-status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    })
    fetchOrders()
  }

  if (!user || user.role !== 'admin') return null


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Narudžbe</h1>

      {loading ? (
        <p>Učitavanje...</p>
      ) : orders.length === 0 ? (
        <p>Nema narudžbi.</p>
      ) : (
        <>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-2 px-3">#</th>
                <th className="text-left py-2 px-3">Ime</th>
                <th className="text-left py-2 px-3">Email</th>
                <th className="text-left py-2 px-3">Plaćanje</th>
                <th className="text-left py-2 px-3">Ukupno</th>
                <th className="text-left py-2 px-3">Datum</th>
                <th className="text-left py-2 px-3">Status</th>
                <th className="text-left py-2 px-3">Promjena</th>
                <th className="text-left py-2 px-3">Artikli</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{o.id}</td>
                  <td className="py-2 px-3">{o.name}</td>
                  <td className="py-2 px-3">{o.email}</td>
                  <td className="py-2 px-3">{o.payment_method}</td>
                  <td className="py-2 px-3">€{Number(o.total).toFixed(2)}</td>
                  <td className="py-2 px-3">{new Date(o.created_at).toLocaleString()}</td>
                  <td className="py-2 px-3 italic text-gray-600">{o.status}</td>
                  <td className="py-2 px-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="placeno">Plaćeno</option>
                      <option value="u obradi">U obradi</option>
                      <option value="poslano">Poslano</option>
                      <option value="otkazano">Otkazano</option>
                    </select>
                  </td>
                  <td className="py-2 px-3">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Pregledaj
                  </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedOrderId && (
            <div className="mt-6">
              <h2 className="text-lg font-bold mb-2">
                Stavke narudžbe #{selectedOrderId}
              </h2>

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
                  {orderItems.map((item, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 px-3">
                        {item.title ?? (
                          <span className="text-red-500 italic">
                            Proizvod nije pronađen
                          </span>
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
            </div>
          )}
        </>
      )}
    </div>
  )
}
