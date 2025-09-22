import {db} from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows]: any = await db.query('SELECT * FROM settings WHERE id = 1')
    return res.status(200).json(rows[0])
  }

  if (req.method === 'PUT') {
    const { tax_rate, shipping_cost, free_shipping_min } = req.body

    if (tax_rate == null || shipping_cost == null || free_shipping_min == null) {
      return res.status(400).json({ message: 'Sva polja su obavezna.' })
    }

    await db.query(
      'UPDATE settings SET tax_rate = ?, shipping_cost = ?, free_shipping_min = ? WHERE id = 1',
      [tax_rate, shipping_cost, free_shipping_min]
    )

    return res.status(200).json({ message: 'Postavke ažurirane.' })
  }

  return res.status(405).json({ message: 'Method not allowed' })
}
