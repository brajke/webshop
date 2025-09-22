import type { NextApiRequest, NextApiResponse } from 'next'
import {db} from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { id, name, email } = req.body

  if (!id || !name || !email) {
    return res.status(400).json({ message: 'Nedostaju podaci.' })
  }

  try {
    await db.execute('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
    const [updated]: any = await db.query('SELECT * FROM users WHERE id = ?', [id])
    return res.status(200).json({ user: updated[0] })
  } catch (error) {
    console.error('Greška kod ažuriranja korisnika:', error)
    return res.status(500).json({ message: 'Greška na serveru.' })
  }
}
