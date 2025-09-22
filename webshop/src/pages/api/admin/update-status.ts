import {db} from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { orderId, status } = req.body

  if (!orderId || !status) {
    return res.status(400).json({ message: 'Missing orderId or status' })
  }

  try {
    await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    )

    return res.status(200).json({ message: 'Status updated successfully' })
  } catch (err) {
    console.error('Error updating order status:', err)
    return res.status(500).json({ message: 'Database error' })
  }
}
