import type { NextApiRequest, NextApiResponse } from 'next'
import { registerUser, findUserByEmail } from '@/backend/models/userModel'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Sva polja su obavezna.' })
  }

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    return res.status(409).json({ message: 'Korisnik već postoji.' })
  }

  await registerUser(name, email, password)
  return res.status(201).json({ message: 'Uspješna registracija.' })
}
