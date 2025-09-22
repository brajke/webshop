'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: number
  title: string
  price: number
  oldPrice?: string
  description: string
  image: string
  colors?: any
  grams?: any
  category?: string
  stock_quantity?: number
}
type Variant = {
  color: string
  gram: string
  stock: string
}


export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [variants, setVariants] = useState<{ color: string; gram: string; stock: string }[]>([])
  const [showVariants, setShowVariants] = useState(false)
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableGrams, setAvailableGrams] = useState<string[]>([])

  const [form, setForm] = useState({
    id: null,
    title: '',
    price: '',
    oldPrice: '',
    description: '',
    image: '',
    colors: '',
    grams: '',
    category: ''
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    try {
      const rawColors = form.colors
        ? form.colors
            .split('\n')
            .map(line =>
              Object.fromEntries(
                line.split(',').map(pair => {
                  const [k, v] = pair.includes(':') ? pair.split(':').map(x => x.trim()) : [null, null]
                  return [k, v]
                }).filter(([k, v]) => k && v)                
              )
            )
        : []
  
      const parsed = rawColors.map((c: any) => c.name || c.code).filter(Boolean)
      setAvailableColors(parsed)
    } catch {
      setAvailableColors([])
    }
  }, [form.colors])
  
  useEffect(() => {
    try {
      const parsed = form.grams ? JSON.parse(form.grams) : []
      setAvailableGrams(parsed.map((g: any) => String(g)))
    } catch {
      setAvailableGrams([])
    }
  }, [form.grams])
  

  const fetchProducts = async () => {
    const res = await fetch('/api/products', { cache: 'no-store' })
    const data = await res.json()
    setProducts(data)
  }

  const handleSubmit = async () => {
    const deleteVariants = async (productId: number) => {
      await fetch('/api/product-variants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })
    }
    const method = form.id ? 'PUT' : 'POST'
  
    const payload = {
      ...form,
      price: parseFloat(form.price),
      oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      colors: form.colors
        ? JSON.stringify(
            form.colors
              .split('\n')
              .map((line) => {
                const entries = line.split(',').map((pair) => pair.trim())
                const obj: any = {}
  
                entries.forEach((pair) => {
                  const [key, value] = pair.split(':').map((x) => x.trim())
                  if (key && value) obj[key] = value
                })
  
                if (Object.keys(obj).length === 0) {
                  return { code: line.trim() }
                }
  
                return obj
              })
          )
        : null,
      grams: form.grams ? JSON.stringify(JSON.parse(form.grams)) : null,
      category: form.category || null,
    }
  
    const res = await fetch('/api/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  
    const saved = await res.json()
    const productId = saved.id || form.id

    if (productId) {
      if (!availableColors.length && !availableGrams.length) {
        await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            stock: parseInt(variants[0].stock || '0'),
          }),
        })
      } else {
        await deleteVariants(productId)
        await saveVariants(productId)
      }
    }
    
  
    setForm({
      id: null,
      title: '',
      price: '',
      oldPrice: '',
      description: '',
      image: '',
      colors: '',
      grams: '',
      category: ''
    })
  
    setVariants([{ color: '', gram: '', stock: '' } as Variant])
    setShowForm(false)
    setShowVariants(false)
    await fetchProducts()
  }
  

  const saveVariants = async (productId: number) => {
    const validVariants = variants
      .filter(v => v.stock !== '')
      .map(v => ({
        color: v.color || null,
        gram: v.gram || null,
        stock: parseInt(v.stock || '0'),
      }))

    await fetch('/api/product-variants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId,
        variants: validVariants,
      }),
    })
  }
  
  

  const handleDelete = async (id: number) => {
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchProducts()
  }

  const handleEdit = async (product: Product) => {
    console.log('Editing product:', product)
  
    setForm({
      id: product.id,
      title: product.title,
      price: product.price.toString(),
      oldPrice: product.oldPrice || '',
      description: product.description,
      image: product.image,
      colors: product.colors
        ? Array.isArray(product.colors)
          ? product.colors.map((c: any) =>
              Object.entries(c)
                .map(([k, v]) => `${k}:${v}`)
                .join(', ')
            ).join('\n')
          : typeof product.colors === 'string'
            ? JSON.parse(product.colors)
                .map((c: any) =>
                  Object.entries(c)
                    .map(([k, v]) => `${k}:${v}`)
                    .join(', ')
                ).join('\n')
            : ''
        : '',
      grams: product.grams
        ? typeof product.grams === 'string'
          ? product.grams
          : JSON.stringify(product.grams)
        : '',
      category: product.category ?? ''
    })
  
    let parsedColors: string[] = []
    let parsedGrams: string[] = []
  
    try {
      const rawColors = typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors
      parsedColors = Array.isArray(rawColors)
        ? rawColors.map((c: any) => c.name || c.code).filter(Boolean)
        : []
      setAvailableColors(parsedColors)
    } catch {
      setAvailableColors([])
    }
  
    try {
      const parsed = product.grams
        ? typeof product.grams === 'string'
          ? JSON.parse(product.grams)
          : product.grams
        : []
      parsedGrams = parsed.map((g: any) => String(g))
      setAvailableGrams(parsedGrams)
    } catch {
      setAvailableGrams([])
    }
  
    const res = await fetch(`/api/product-variants?productId=${product.id}`)
    const fetchedVariants = await res.json()
  
    let enrichedVariants: Variant[] = []

    if (parsedColors.length === 0 && parsedGrams.length === 0) {
      enrichedVariants = [{
        color: '',
        gram: '',
        stock: product.stock_quantity?.toString() || ''
      }]
    }
     else {
      enrichedVariants = parsedColors.flatMap(color =>
        parsedGrams.map(gram => {
          const match = fetchedVariants.find(
            (v: any) => v.color === color && v.gram === gram
          )
          return {
            color,
            gram,
            stock: match && match.stock_quantity ? match.stock_quantity.toString() : ''
          }
        })
      )
    }

  
    setVariants(enrichedVariants.length > 0 ? enrichedVariants : [{ color: '', gram: '', stock: '' }])
    setShowForm(true)
    setShowVariants(true)
  }
  
  
  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Upravljanje proizvodima</h2>
      <button
        onClick={() => {
          setForm({
            id: null,
            title: '',
            price: '',
            oldPrice: '',
            description: '',
            image: '',
            colors: '',
            grams: '',
            category: ''
          })
          setVariants([{ color: '', gram: '', stock: '' }])
          setShowForm(true)
          setShowVariants(true)

          setAvailableColors([])
          setAvailableGrams([])
        }}
        className="bg-blue-600 text-white px-4 py-2 mb-4 rounded hover:bg-blue-700"
      >
        + Dodaj proizvod
      </button>
  
      {showForm && (
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium mb-1">Naslov</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="border p-2 w-full" />
          <label className="block text-sm font-medium mb-1">Cijena</label>
          <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="border p-2 w-full" />
          <label className="block text-sm font-medium mb-1">Stara cijena</label>
          <input value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} className="border p-2 w-full" />
          <label className="block text-sm font-medium mb-1">URL slike</label>
          <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="border p-2 w-full" />
          <label className="block text-sm font-medium mb-1">Kategorija proizvoda</label>
          <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="border p-2 w-full" />
          <label className="block text-sm font-medium mb-1">Boje proizvoda</label>
          <textarea value={form.colors} onChange={e => setForm(f => ({ ...f, colors: e.target.value }))} className="border p-2 w-full" rows={3} />
          <label className="block text-sm font-medium mb-1">Težina/Širina/Duljina</label>
          <textarea value={form.grams} onChange={e => setForm(f => ({ ...f, grams: e.target.value }))} className="border p-2 w-full" rows={2} />
  
          {showVariants && (
            <div className="mt-4">
              <h4 className="font-semibold">Količina proizvoda</h4>
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  {form.id === null ? (
                    <input
                      placeholder="Boja"
                      value={variant.color}
                      onChange={(e) => {
                        const updated = [...variants]
                        updated[index].color = e.target.value
                        setVariants(updated)
                      }}
                      className="border p-2 w-1/3"
                    />
                  ) : (
                    <select
                      value={variant.color}
                      onChange={(e) => {
                        const updated = [...variants]
                        updated[index].color = e.target.value
                        setVariants(updated)
                      }}
                      className="border p-2 w-1/3"
                    >
                      <option value="">Odaberi boju</option>
                      {availableColors.map((color, idx) => (
                        <option key={idx} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  )}

                  {form.id === null ? (
                    <input
                      placeholder="Gramaža"
                      value={variant.gram}
                      onChange={(e) => {
                        const updated = [...variants]
                        updated[index].gram = e.target.value
                        setVariants(updated)
                      }}
                      className="border p-2 w-1/3"
                    />
                  ) : (
                    <select
                      value={variant.gram}
                      onChange={(e) => {
                        const updated = [...variants]
                        updated[index].gram = e.target.value
                        setVariants(updated)
                      }}
                      className="border p-2 w-1/3"
                    >
                      <option value="">Odaberi gramažu</option>
                      {availableGrams.map((gram, idx) => (
                        <option key={idx} value={gram}>
                          {gram}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    placeholder="Količina"
                    type="number"
                    value={variant.stock}
                    onChange={(e) => {
                      const v = [...variants]
                      v[index].stock = e.target.value
                      setVariants(v)
                    }}
                    className="border p-2 w-1/3"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => setVariants([...variants, { color: '', gram: '', stock: '' }])}
                className="mt-2 text-blue-600 text-sm"
              >
                + Dodaj količinu
              </button>
            </div>
          )}
  
          <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 mt-2 rounded hover:bg-gray-800">
            {form.id ? 'Spremi izmjene' : 'Dodaj proizvod'}
          </button>
          <button onClick={() => setShowForm(false)} type="button" className="bg-red-800 text-white px-4 py-2 mt-2 rounded hover:bg-red-600">
            Odustani
          </button>
        </div>
      )}
  
      <ul className="divide-y">
        <h2 className="text-xl font-bold mb-4">Svi proizvodi</h2>
        {products.map(p => (
          <li key={p.id} className="py-2 flex items-center gap-3">
            <span>{p.title} - €{p.price}</span>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(p)} className="text-blue-500 hover:underline">Uredi</button>
              <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Obriši</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
  
}
