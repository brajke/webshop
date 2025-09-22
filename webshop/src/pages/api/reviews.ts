import { NextApiRequest, NextApiResponse } from 'next'
import {db} from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { productId } = req.query

    try {
      if (productId) {
        const [rows]: any = await db.query(
          'SELECT * FROM reviews WHERE product_id = ?',
          [productId]
        )
        return res.status(200).json(rows)
      }

      const [rows]: any = await db.query('SELECT * FROM reviews')
      return res.status(200).json(rows)
    } catch (error) {
      console.error('Greška kod čitanja recenzija:', error)
      return res.status(500).json({ message: 'Greška na serveru.' })
    }
  }

  if (req.method === 'POST') {
    const { userId, productId, rating, comment } = req.body
  
    if (!userId || !productId || !rating) {
      return res.status(400).json({ message: 'Missing fields' })
    }
  
    const [orders]: any = await db.query(
      `
      SELECT o.status, oi.product_id
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = ? AND oi.product_id = ?
      LIMIT 1
      `,
      [userId, productId]
    )

  
    if (!orders.length) {
      return res.status(403).json({ message: 'Možeš ostaviti recenziju samo ako si kupio proizvod.' })
    }
    if (orders[0].status !== 'placeno') {
      return res.status(403).json({ message: 'Recenziju možeš ostaviti tek kad je narudžba plaćena.' })
    }
  
    const [existing]: any = await db.query(
      'SELECT * FROM reviews WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    )
  
    if (existing.length > 0) {
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ? WHERE user_id = ? AND product_id = ?',
        [rating, comment, userId, productId]
      )
    } else {
      await db.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [userId, productId, rating, comment]
      )
    }
  
    return res.status(200).json({ message: 'Recenzija spremljena.' })
  }
  if (req.method === 'PUT') {
    const { userId, productId, rating, comment } = req.body
  
    if (!userId || !productId || !rating) {
      return res.status(400).json({ message: 'Nedostaju podaci.' })
    }
  
    try {
      await db.query(
        `UPDATE reviews SET rating = ?, comment = ?, updated_at = NOW() WHERE user_id = ? AND product_id = ?`,
        [rating, comment, userId, productId]
      )
  
      return res.status(200).json({ message: 'Recenzija ažurirana' })
    } catch (err) {
      console.error('Greška kod ažuriranja recenzije:', err)
      return res.status(500).json({ message: 'Greška na serveru' })
    }
  }
  
  

  res.status(405).json({ message: 'Method not allowed' })
}
