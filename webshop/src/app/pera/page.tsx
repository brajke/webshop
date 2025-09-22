'use client'

import DetailedProductCard from '@/components/DetailedProductCard'
import { useEffect, useState } from 'react'

type Product = {
  id: number
  title: string
  price: string | number
  oldPrice?: string | number | null
  description?: string
  image: string
  category?: string
  colors?: any
  grams?: any
  rating?: number
}

type Review = {
  product_id: number
  rating: number
}

const cleanPrice = (price: string | number): number => {
  if (typeof price === 'number') return price
  const p = parseFloat(price.replace('€', '').replace(',', '.'))
  return isNaN(p) ? 0 : p
}

export default function PeraPage() {
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])
  const [sort, setSort] = useState('')

  useEffect(() => {
    const fetchAndSort = async () => {
      const resProd = await fetch('/api/products')
      const allProducts: Product[] = await resProd.json()

      const resRev = await fetch('/api/reviews')
      const allReviews: Review[] = await resRev.json()

      const filtered = allProducts.filter((p) => p.category === 'pera')

      const enriched = filtered.map((product) => {
        const reviews = allReviews.filter((r) => r.product_id === product.id)
        const avg = reviews.length
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

        return {
          ...product,
          price: product.price !== null ? String(product.price) : '0.00',
          rating: Number(avg.toFixed(2)),
        }
      })

      if (sort === 'price_asc') {
        enriched.sort((a, b) => cleanPrice(a.price) - cleanPrice(b.price))
      } else if (sort === 'price_desc') {
        enriched.sort((a, b) => cleanPrice(b.price) - cleanPrice(a.price))
      } else if (sort === 'rating_asc') {
        enriched.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0))
      } else if (sort === 'rating_desc') {
        enriched.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      }

      setSortedProducts(enriched)
    }

    fetchAndSort()
  }, [sort])

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pera</h1>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="mb-6 border px-3 py-2 rounded"
      >
        <option value="">Sortiraj</option>
        <option value="price_asc">Cijena (najniža)</option>
        <option value="price_desc">Cijena (najviša)</option>
        <option value="rating_desc">Ocjena (najviša)</option>
        <option value="rating_asc">Ocjena (najniža)</option>
      </select>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product) => (
          <DetailedProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
