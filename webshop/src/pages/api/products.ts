import {db} from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [products]: any = await db.query('SELECT * FROM products')
    return res.status(200).json(products)
  }

  if (req.method === 'POST') {
    const { title, price, oldPrice, description, image, colors, grams, category } = req.body
  
    try {
      const [result]: any = await db.execute(
        'INSERT INTO products (title, price, oldPrice, description, image, colors, grams, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, price, oldPrice, description, image, colors, grams, category]
      )
      
      return res.status(200).json({ message: 'Proizvod dodan.', id: result.insertId })
    } catch (err) {
      console.error('Greška pri dodavanju proizvoda:', err)
      return res.status(500).json({ error: 'Greška na serveru.' })
    }
  }
  

  if (req.method === 'PUT') {
    const { id, title, price, oldPrice, description, image, colors, grams, category } = req.body
  
    try {
      await db.execute(
        'UPDATE products SET title=?, price=?, oldPrice=?, description=?, image=?, colors=?, grams=?, category=? WHERE id=?',
        [title, price, oldPrice, description, image, colors, grams, category, id]
      )
  
      return res.status(200).json({ message: 'Proizvod ažuriran.' })
    } catch (err) {
      console.error('Greška pri ažuriranju proizvoda:', err)
      return res.status(500).json({ error: 'Greška na serveru.' })
    }
  }
  
  

  if (req.method === 'DELETE') {
    const { id } = req.body

    if (!id) {
      return res.status(400).json({ message: 'Missing product ID' })
    }

    await db.query('DELETE FROM products WHERE id = ?', [id])

    return res.status(200).json({ message: 'Product deleted successfully' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
