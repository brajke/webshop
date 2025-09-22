import {db} from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const userId = req.query.userId
  if (!userId) {
    return res.status(400).json({ message: 'Missing userId' })
  }

  try {
    const [orders]: any = await db.query(
      'SELECT id, created_at, total, status FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )
    

    for (const order of orders) {
      const [items]: any = await db.query(
        `
        SELECT p.title, oi.quantity, oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
        `,
        [order.id]
      )
      order.items = items
    }

    res.status(200).json({ orders })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
