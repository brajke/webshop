import { db } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { productId, stock } = req.body

    try {
      await db.query(
        'UPDATE products SET stock_quantity = ? WHERE id = ?',
        [stock, productId]
      )
      return res.status(200).json({ message: 'Stock updated in products table' })
    } catch (err) {
      console.error('Greška prilikom ažuriranja zalihe:', err)
      return res.status(500).json({ message: 'Greška na serveru' })
    }
  }

  res.status(405).json({ message: 'Method not allowed' })
}
