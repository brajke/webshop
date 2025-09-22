'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import CheckoutForm, { CheckoutFormRef } from '@/components/CheckoutForm'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CheckoutPage() {
  const { cartItems, refreshCart } = useCart()
  const { user } = useUser()
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    payment: 'pouzece',
  })

  const [settings, setSettings] = useState({
    tax_rate: 0,
    shipping_cost: 0,
    free_shipping_min: 0,
  })

  const [message, setMessage] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const formRef = useRef<CheckoutFormRef>(null)

  useEffect(() => {
    refreshCart()
    const fetchSettings = async () => {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
    }
    fetchSettings()
  }, [])

  const subtotal = cartItems.reduce((sum, item) => {
    const price = parseFloat(
      (typeof item.price === 'string' ? item.price : String(item.price || '0'))
        .replace(/[^\d.-]/g, '')
        .replace(',', '.')
    )
    return sum + price * item.quantity
  }, 0)

  const freeLimit = parseFloat(String(settings.free_shipping_min ?? '0'))
  const shippingCost = parseFloat(String(settings.shipping_cost ?? '0'))
  const taxRate = parseFloat(String(settings.tax_rate ?? '0'))

  const shipping = subtotal >= freeLimit ? 0 : shippingCost
  const tax = subtotal * (taxRate / 100)
  const grandTotal = subtotal + shipping

  useEffect(() => {
    const createIntent = async () => {
      if (form.payment === 'kartica') {
        const res = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(grandTotal * 100) }),
        })

        const { clientSecret, error } = await res.json()

        if (!clientSecret || error) {
          setMessage(`Stripe greška: ${error || 'Greška pri kreiranju plaćanja'}`)
          return
        }

        setClientSecret(clientSecret)
      } else {
        setClientSecret('')
      }
    }

    createIntent()
  }, [form.payment, grandTotal])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setIsProcessing(true)

    if (form.payment === 'kartica') {
      const success = await formRef.current?.handleCardPayment()
      if (!success) {
        setIsProcessing(false)
        return
      }
    }

    const orderRes = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        name: form.name,
        address: form.address,
        email: form.email,
        payment: form.payment,
        cartItems,
      }),
    })

    const data = await orderRes.json()

    if (orderRes.ok) {
      refreshCart()
      alert(`Narudžba poslana! ID: ${data.orderId}`)
      router.push('/my-orders')
    } else {
      setMessage(`Greška: ${data.message}`)
    }

    setIsProcessing(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Potvrdi narudžbu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Ime i prezime"
          className="w-full border px-4 py-2 rounded"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Adresa"
          className="w-full border px-4 py-2 rounded"
          value={form.address}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded"
          value={form.email}
          onChange={handleChange}
          required
        />
        <select
          name="payment"
          value={form.payment}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="pouzece">Plaćanje pouzećem</option>
          <option value="kartica">Kartica</option>
        </select>

        {form.payment === 'kartica' && clientSecret && (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              ref={formRef}
              clientSecret={clientSecret}
              onError={(msg) => setMessage(msg)}
            />
          </Elements>
        )}

        <div className="border-t pt-4 text-sm space-y-1">
          <p>Međuzbroj: €{subtotal.toFixed(2)}</p>
          <p>Dostava: €{shipping.toFixed(2)}</p>
          <p>PDV ({taxRate}%): €{tax.toFixed(2)}</p>
          <hr />
          <p className="text-right font-bold text-lg">
            Ukupno za platiti: €{grandTotal.toFixed(2)}
          </p>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {isProcessing ? 'Obrađujem...' : 'Potvrdi narudžbu'}
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
      </form>
    </div>
  )
}
