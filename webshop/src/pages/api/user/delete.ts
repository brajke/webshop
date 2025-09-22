import {db} from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Pozvana DELETE ruta za brisanje korisnika')

  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query
  const userId = Number(id)

  if (!userId || isNaN(userId)) {
    console.log('Neispravan ID:', id)
    return res.status(400).json({ message: 'Missing or invalid user ID' })
  }

  try {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId])
    await db.query('DELETE FROM reviews WHERE user_id = ?', [userId])
    await db.query('DELETE FROM orders WHERE user_id = ?', [userId])

    const [result]: any = await db.query('DELETE FROM users WHERE id = ?', [userId])
    console.log(' Rezultat brisanja:', result)

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Korisnik nije pronađen' })
    }

    return res.status(200).json({ message: 'Korisnik i povezani podaci uspješno obrisani' })
  } catch (err) {
    console.error('Greška u SQL brisanju:', err)
    return res.status(500).json({ message: 'Greška na serveru', error: err })
  }
}
