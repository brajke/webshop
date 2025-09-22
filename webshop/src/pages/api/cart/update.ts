import { db } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Metoda nije dozvoljena' })
  }

  const body = req.body
  const { userId, productId, quantity, image } = body
  const selectedGram = (body.selectedGram ?? null)?.trim()
  const selectedColor = (body.color ?? null)?.trim()

  try {
    await db.query(
      `UPDATE cart_items 
       SET quantity = ? 
       WHERE user_id = ? AND product_id = ? AND image = ? 
       AND (selected_gram = ? OR (selected_gram IS NULL AND ? IS NULL))
       AND (color = ? OR (color IS NULL AND ? IS NULL))`,
      [quantity, userId, productId, image, selectedGram, selectedGram,selectedColor, selectedColor]
    )

    return res.status(200).json({ message: 'Količina ažurirana' })
  } catch (err) {
    console.error('Greška pri ažuriranju količine:', err)
    return res.status(500).json({ message: 'Greška na serveru' })
  }
}
