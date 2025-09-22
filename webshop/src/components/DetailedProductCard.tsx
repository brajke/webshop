'use client'

import { useUser } from '@/context/UserContext'
import { useCart } from '@/context/CartContext'
import { useState, useEffect } from 'react'

type Product = {
  id: number
  title: string
  price: string
  oldPrice?: string
  description: string
  image: string
  colors?: any
  grams?: any
}

export default function DetailedProductCard({ product }: { product: Product }) {
  const { user } = useUser()
  const { refreshCart } = useCart()

  const [reviews, setReviews] = useState<{ id: number; rating: number; comment: string }[]>([])
  const [averageRating, setAverageRating] = useState<number | null>(null)

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

  const [selectedImg, setSelectedImg] = useState(
    hasColors ? parsedColors[0].img : product.image
  )
  const [selectedGram, setSelectedGram] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    setSelectedImg(hasColors ? parsedColors[0].img : product.image)
    if (!selectedGram && hasGrams) {
      setSelectedGram(parsedGrams[0])
    }
  }, [product])
  

  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch('/api/reviews')
      const all = await res.json()
      const filtered = all.filter((r: any) => r.product_id === product.id)
      setReviews(filtered)
  
      if (filtered.length > 0) {
        const ratings = filtered
          .map((r) => parseFloat(r.rating))
          .filter((n) => !isNaN(n))
  
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length
        setAverageRating(Number(avg.toFixed(1)))
      } else {
        setAverageRating(null)
      }
    }
  
    fetchReviews()
  }, [product.id])
  
  

  const handleAddToCart = async () => {
    if (!user) {
      alert('Prijavi se da bi dodao u košaricu.')
      return
    }

    if (hasGrams && !selectedGram) {
      alert('Molimo odaberite gramažu prije dodavanja u košaricu.')
      return
    }
    if (hasColors && !selectedColor) {
      alert('Molimo odaberite boju prije dodavanja u košaricu.')
      return
    }
    console.log('Dodavanje u košaricu:', {
      selectedColor,
      selectedGram
    })
      
    try { 
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: selectedImg,
          quantity: 1,
          selectedGram: hasGrams ? selectedGram : null,
          color: hasColors ? selectedColor : null,
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          productId: product.id,
          rating,
          comment,
        }),
      })

      const data = await res.json()
      alert(data.message)
    } catch (err) {
      console.error(err)
      alert('Greška pri spremanju recenzije')
    }
  }

  return (
    <section className="product-section bg-gray-100 py-12 px-6 flex flex-col items-center justify-center">
      <img src={selectedImg} alt={product.title} className="h-[300px] mb-4 object-contain" />

      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold mb-1">{product.title}</h1>
        {averageRating !== null && (
          <p className="text-sm text-yellow-500 mb-1">⭐ {averageRating}/5</p>
        )}
        <h2 className="text-xl mb-2">
          {product.oldPrice && (
            <span className="line-through text-gray-500 mr-2">{product.oldPrice}€</span>
          )}
          {product.price}€
        </h2>

        {hasColors && (
          <div className="colors flex justify-center gap-2 mb-4">
            {parsedColors.map((color: any, i: number) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedColor(color.name)
                  setSelectedImg(color.img)
                }}
                className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                  selectedColor === color.name ? 'border-black' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.code }}
                title={color.name}
              />
            ))}
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

        <div className="mt-6 text-left">
          <h3 className="text-md font-semibold mb-2">Recenzije korisnika</h3>
          {reviews.length > 0 ? (
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="border p-2 rounded bg-white">
                  <p className="text-sm text-yellow-600 font-semibold">Ocjena: {r.rating}/5</p>
                  {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Još nema recenzija za ovaj proizvod.</p>
          )}
        </div>

        {user && (
          <form onSubmit={handleReviewSubmit} className="mt-6 text-left">
            <h3 className="text-sm font-medium mb-2">Ostavi recenziju</h3>

            <label className="block mb-1 text-sm">Ocjena (1–5)</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border px-2 py-1 mb-2 rounded"
              required
            />

            <label className="block mb-1 text-sm">Komentar (opcionalno)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border px-2 py-1 mb-2 rounded"
            />

            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Spremi recenziju
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
