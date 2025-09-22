import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  const { orderId } = req.query
  if (!orderId) return res.status(400).json({ message: 'Nedostaje orderId' })

  try {
    const [rows]: any = await db.execute(
      `
      SELECT oi.*, p.title 
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `,
      [orderId]
    )

    res.status(200).json(rows)
  } catch (err) {
    console.error('Greška kod dohvata stavki narudžbe:', err)
    res.status(500).json({ message: 'Greška na serveru' })
  }
}
