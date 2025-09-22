'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useUser } from '@/context/UserContext'

export default function CartDropdown({ onClose }: { onClose?: () => void }) {
  const { cartItems, refreshCart } = useCart()
  const { user } = useUser()


  const removeItem = async (item: any) => {
    if (!user) return
    await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        productId: item.product_id,
        image: item.image,
        selectedGram: item.selected_gram ?? null,
        color: item.color ?? null
      }),
    })
    await refreshCart()
  }

  const totalPrice = cartItems.reduce((sum, item) => {
    const raw = typeof item.price === 'string' ? item.price : String(item.price || '0')
    const numeric = parseFloat(raw.replace(/[^\d.-]/g, '').replace(',', '.'))
    return sum + numeric * item.quantity
  }, 0)

  return (
    <div className="absolute right-0 top-full mt-2 w-[320px] bg-white shadow-lg rounded-md z-50 border">
      <div className="p-4">
        <h3 className="font-bold mb-2 text-lg">Košarica</h3>

        {cartItems.length === 0 ? (
          <p className="text-sm text-gray-500">Košarica je prazna.</p>
        ) : (
          <div>
            <ul className="max-h-[220px] overflow-y-auto divide-y">
  {cartItems.map((item,index) => {
    const raw = typeof item.price === 'string' ? item.price : String(item.price || '0')
    const price = parseFloat(raw.replace(/[^\d.-]/g, '').replace(',', '.'))
    const lineTotal = price * item.quantity
    console.log(" cart item:", item)


    const increase = async () => {
      if (!user) return
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: item.product_id,
          quantity: 1,
          image: item.image,
          title: item.title,
          price: item.price,
          selectedGram: item.selected_gram ?? null,
          color: item.color ?? null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.message || 'Greška pri dodavanju u košaricu.')
        return
      }
      await refreshCart()
    }

    const decrease = async () => {
      if (!user) return
      if (item.quantity <= 1) {
        await removeItem(item)
      } else {
        await fetch('/api/cart/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            productId: item.product_id,
            quantity: item.quantity - 1,
            image: item.image,
            selectedGram: item.selected_gram ?? null,
            color: item.color ?? null,
          }),
        })
      }
      await refreshCart()
    }

    return (
      <li key={`${item.user_id}-${item.product_id}-${item.image}-${item.selected_gram}-${index}`} className="py-2 flex items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
          <div>
          <p className="text-sm font-semibold text-black ">
            {item.title || '—nema—'}
          </p>
          {item.selected_gram && (
            <p className="text-xs text-gray-500">Gramaža: {item.selected_gram}</p>
          )}

            <p className="text-xs text-gray-500">
              {item.quantity} × €{price.toFixed(2)} = €{lineTotal.toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={decrease}
                className="w-6 h-6 rounded-full bg-gray-200 text-black text-xs font-bold"
              >
                −
              </button>
              <button
                onClick={increase}
                className="w-6 h-6 rounded-full bg-gray-200 text-black text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => removeItem(item)}
          className="text-red-500 text-sm hover:underline"
        >
          Obriši
        </button>
      </li>
    )
  })}
</ul>


            <div className="text-right font-semibold text-sm mt-3 pr-1">
              Ukupno: €{totalPrice.toFixed(2)}
            </div>
          </div>
        )}

        <Link
          href="/cart"
          onClick={onClose}
          className="block mt-4 text-center bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition"
        >
          Idi na košaricu
        </Link>
      </div>
    </div>
  )
}
