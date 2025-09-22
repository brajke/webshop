import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  try {
    const [rows]: any = await db.execute('SELECT * FROM orders ORDER BY created_at DESC')
    res.status(200).json(rows)
  } catch (err) {
    console.error(' Greška kod dohvata narudžbi:', err)
    res.status(500).json({ message: 'Greška na serveru' })
  }
}
