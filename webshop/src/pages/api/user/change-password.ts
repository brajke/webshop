import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcrypt'
import {db} from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' })

  const { userId, oldPassword, newPassword } = req.body

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Nedostaju podaci.' })
  }

  try {
    const [result]: any = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId])

    if (result.length === 0) return res.status(404).json({ message: 'Korisnik nije pronađen.' })

    const isMatch = await bcrypt.compare(oldPassword, result[0].password_hash)

    if (!isMatch) {
      return res.status(401).json({ message: 'Trenutna lozinka nije točna.' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await db.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hashed, userId])

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Greška kod promjene lozinke:', err)
    return res.status(500).json({ message: 'Greška na serveru.' })
  }
}
