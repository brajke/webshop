'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const [taxRate, setTaxRate] = useState('')
  const [shippingCost, setShippingCost] = useState('')
  const [freeShippingMin, setFreeShippingMin] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/')
    }
  }, [user, router])


  useEffect(() => {
    const fetchSettings = async () => {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setTaxRate(data.tax_rate)
      setShippingCost(data.shipping_cost)
      setFreeShippingMin(data.free_shipping_min)
    }

    fetchSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tax_rate: parseFloat(taxRate),
        shipping_cost: parseFloat(shippingCost),
        free_shipping_min: parseFloat(freeShippingMin)
      }),
    })

    const data = await res.json()
    setMessage(data.message || 'Nešto je pošlo po zlu.')
  }
  if (!user || user.role !== 'admin') return null

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Postavke sustava</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 font-medium">PDV (%)</label>
          <input
            type="number"
            step="0.01"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Dostava (€)</label>
          <input
            type="number"
            step="0.01"
            value={shippingCost}
            onChange={(e) => setShippingCost(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 font-medium">Besplatna dostava od (€)</label>
          <input
            type="number"
            step="0.01"
            value={freeShippingMin}
            onChange={(e) => setFreeShippingMin(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Spremi postavke
        </button>

        {message && <p className="text-sm mt-2 text-center text-blue-600">{message}</p>}
      </form>
    </div>
  )
}
