'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import { useCart } from '@/context/CartContext'

type Product = {
  id: string
  productId: number
  title: string
  price: string
  image: string
  colors?: any
  grams?: any
}

export default function ProductSection({ product }: { product: Product }) {
  const { user } = useUser()
  const { refreshCart } = useCart()

  let parsedColors: any[] = []
  let parsedGrams: string[] = []

  try {
    parsedColors =
      typeof product.colors === 'string'
        ? JSON.parse(product.colors)
        : Array.isArray(product.colors)
        ? product.colors
        : []
  } catch {
    parsedColors = []
  }

  try {
    parsedGrams =
      typeof product.grams === 'string'
        ? JSON.parse(product.grams)
        : Array.isArray(product.grams)
        ? product.grams
        : []
  } catch {
    parsedGrams = []
  }

  const hasColors = parsedColors.length > 0
  const hasGrams = parsedGrams.length > 0

  const [selectedImg, setSelectedImg] = useState(product.image)
  const [selectedGram, setSelectedGram] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => {
    if (hasColors && parsedColors[0]) {
      const first = parsedColors[0]
      setSelectedImg(first.img || product.image)
      setSelectedColor(first.name || first.code || null)
    } else {
      setSelectedImg(product.image)
      setSelectedColor(null)
    }

    if (hasGrams && parsedGrams.length > 0) {
      setSelectedGram(parsedGrams[0])
    }
  }, [product.id])

  const handleAddToCart = async () => {
    if (!user) {
      alert('Prijavi se da bi dodao u košaricu.')
      return
    }

    if (hasGrams && !selectedGram) {
      alert('Molimo odaberi gramažu prije dodavanja u košaricu.')
      return
    }

    if (hasColors && !selectedColor) {
      alert('Molimo odaberite boju prije dodavanja u košaricu.')
      return
    }

    console.log('Šaljem u košaricu:', {
      selectedColor,
      selectedGram,
      selectedImg,
    })

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product.productId,
          title: product.title,
          price: product.price,
          image: selectedImg,
          quantity: 1,
          selectedGram: selectedGram?.trim(),
          color: selectedColor?.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.message || 'Greška pri dodavanju u košaricu.')
        return
      }

      alert('Dodano u košaricu!')
      refreshCart()
    } catch (err) {
      console.error(err)
      alert('Nešto je pošlo po zlu.')
    }
  }

  return (
    <section className="product-section bg-gray-100 py-12 px-6 flex flex-col items-center justify-center">
      <img src={selectedImg} alt={product.title} className="h-[300px] mb-4 object-contain" />

      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <h2 className="text-xl mb-2">{product.price}€</h2>

        {hasColors && (
          <div className="colors flex justify-center gap-2 mb-4">
            {parsedColors.map((color: any, i: number) => {
              const name = String(color.name || color.code).trim()
              const code = color.code || '#000'
              const img = color.img || product.image

              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedColor(name)
                    setSelectedImg(img)
                  }}
                  className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                    selectedColor === name ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: code }}
                  title={name}
                />
              )
            })}
          </div>
        )}

        {hasGrams && (
          <div className="grams flex justify-center gap-2 mb-4">
            {parsedGrams.map((gram: string) => (
              <div
                key={gram}
                onClick={() => setSelectedGram(gram)}
                className={`border px-3 py-1 cursor-pointer text-sm ${
                  selectedGram === gram ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {gram}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAddToCart}
          className="bg-red-600 text-white font-bold px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          <i className="fa-solid fa-cart-plus mr-2" />
          Dodaj u košaricu
        </button>
      </div>
    </section>
  )
}
