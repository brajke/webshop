import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const { productId } = req.query
      if (!productId) return res.status(400).json({ message: 'Missing productId' })
    
      try {
        const [rows] = await db.query(
          'SELECT color, gram, stock_quantity FROM product_variants WHERE product_id = ?',
          [productId]
        )
        return res.status(200).json(rows)
      } catch (err) {
        return res.status(500).json({ message: 'Error', err })
      }
    }
  
    if (req.method === 'DELETE') {
        const { productId } = req.body
        if (!productId) return res.status(400).json({ message: 'Nedostaje productId' })
    
        try {
          await db.query('DELETE FROM product_variants WHERE product_id = ?', [productId])
          return res.status(200).json({ message: 'Deleted variants' })
        } catch (error) {
          return res.status(500).json({ message: 'Failed to delete variants', error })
        }
      }
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Metoda nije dozvoljena' })
    }

    const { productId, variants } = req.body

    if (!productId || !Array.isArray(variants)) {
        return res.status(400).json({ message: 'Nedostaju podaci' })
    }

    try {
        await db.query('DELETE FROM product_variants WHERE product_id = ?', [productId])

        for (const variant of variants) {
        const { color, gram, stock } = variant

        await db.query(
            `INSERT INTO product_variants (product_id, color, gram, stock_quantity)
            VALUES (?, ?, ?, ?)`,
            [productId, color || null, gram || null, stock || 0]
        )
        }

        return res.status(200).json({ message: 'Varijante spremljene' })
        } catch (err) {
        console.error('Greška pri spremanju varijanti:', err)
        return res.status(500).json({ message: 'Greška na serveru' })
    }
}
