'use client'

import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext'
import { useEffect } from 'react'
import Link from 'next/link'

export default function CartPage() {
  const { cartItems, refreshCart } = useCart()
  const { user } = useUser()

  useEffect(() => {
    refreshCart()
  }, [user])

  const total = cartItems.reduce((sum, item) => {
    const raw = typeof item.price === 'string' ? item.price : String(item.price || '0')
    const price = parseFloat(raw.replace(/[^\d.-]/g, '').replace(',', '.'))
    return sum + price * item.quantity
  }, 0)

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tvoja košarica</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Košarica je prazna.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item,index) => {
          const price = parseFloat(
            (typeof item.price === 'string' ? item.price : String(item.price || '0'))
              .replace(/[^\d.-]/g, '')
              .replace(',', '.')
          )
  const lineTotal = price * item.quantity

  const increase = async () => {
    if (!user) return
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        productId: item.product_id,
        image: item.image,
        selectedGram: item.selected_gram,
        color: item.color,
        quantity: 1,
      }),
    })
    await refreshCart()
  }

  const decrease = async () => {
    if (!user) return
    if (item.quantity <= 1) {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: item.product_id,
          image: item.image,
          selectedGram: item.selected_gram,
          color: item.color,
        }),
      })
    } else {
      await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: item.product_id,
          image: item.image,
          selectedGram: item.selected_gram,
          color: item.color,
          quantity: item.quantity - 1,
        }),
      })
    }
    await refreshCart()
  }

  const remove = async () => {
    if (!user) return
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        productId: item.product_id,
        image: item.image,
        selectedGram: item.selected_gram,
        color: item.color,
      }),
    })
    await refreshCart()
  }

  return (
    <div
      key={`${item.product_id}-${item.image}-${item.selected_gram}-${index}`}
      className="flex items-center justify-between border-b pb-4"
    >
      <div className="flex items-center gap-4">
        <img src={item.image} alt={item.title} className="w-16 h-16 object-cover" />
        <div>
          <p className="font-semibold">{item.title}</p>
          {item.selected_gram && (
            <p className="text-sm text-gray-500">Gramaža: {item.selected_gram}</p>
          )}

          <p className="text-sm text-gray-600">
            {item.quantity} × €{price.toFixed(2)} = €{lineTotal.toFixed(2)}
          </p>

          <div className="flex gap-2 mt-1">
            <button
              onClick={decrease}
              className="w-7 h-7 rounded-full bg-gray-200 text-black text-sm font-bold"
            >
              −
            </button>
            <button
              onClick={increase}
              className="w-7 h-7 rounded-full bg-gray-200 text-black text-sm font-bold"
            >
              +
            </button>
            <button
              onClick={remove}
              className="ml-3 text-red-600 text-sm underline hover:text-red-800"
            >
              Obriši
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})}


          <div className="text-right mt-6">
            <p className="text-lg font-bold">Ukupno: €{total.toFixed(2)}</p>

            <Link
              href="/checkout"
              className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition"
            >
              Naruči
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
