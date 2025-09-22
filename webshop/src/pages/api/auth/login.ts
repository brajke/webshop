import type { NextApiRequest, NextApiResponse } from 'next'
import { findUserByEmail, verifyPassword } from '@/backend/models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Nedostaju podaci za prijavu.' })
  }

  const user = await findUserByEmail(email)
  if (!user) {
    return res.status(401).json({ message: 'Nepostojeći korisnik.' })
  }

  const isValid = await verifyPassword(password, user.password_hash)

  const test = await verifyPassword(password, user.password_hash)

  if (!isValid) {
    return res.status(401).json({ message: 'Neispravna lozinka.' })
  }

  return res.status(200).json({
    message: 'Prijava uspješna.',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  })
}
