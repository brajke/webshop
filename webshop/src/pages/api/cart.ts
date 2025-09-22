import { db } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = req.query
    try {
      const [cartItems]: any = await db.query(
        `SELECT ci.*, p.title, p.price, p.stock_quantity
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`,
        [userId]
      )
      return res.status(200).json(cartItems)
    } catch (err) {
      console.error('Greška pri dohvaćanju košarice:', err)
      return res.status(500).json({ message: 'Greška na serveru' })
    }
  }

  if (req.method === 'POST') {
    const body = req.body
    const { userId, productId: product_id, title, price, image, quantity } = body
  
    const selectedGram = body.selectedGram && body.selectedGram.trim() !== '' ? body.selectedGram.trim() : null
    const color = body.color && body.color.trim() !== '' ? body.color.trim() : null
  
    const [variantResults]: any = await db.query(
      `SELECT * FROM product_variants WHERE product_id = ? AND gram <=> ? AND color <=> ?`,
      [product_id, selectedGram, color]
    )
  
    let availableStock = 0
  
    if (variantResults.length > 0) {
      availableStock = variantResults[0].stock_quantity
    } else {
      const [productResults]: any = await db.query(
        `SELECT stock_quantity FROM products WHERE id = ?`,
        [product_id]
      )
      if (productResults.length > 0) {
        availableStock = productResults[0].stock_quantity
      }
    }
  
    if (availableStock <= 0) {
      return res.status(400).json({ message: 'Proizvod trenutno nije na zalihi' })
    }
  
    const [existing]: any = await db.query(
      `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND selected_gram <=> ? AND color <=> ?`,
      [userId, product_id, selectedGram, color]
    )
  
    if (existing.length > 0) {
      const existingQuantity = existing[0].quantity
  
      if (existingQuantity + quantity > availableStock) {
        return res.status(400).json({ message: 'Nema dovoljno proizvoda na skladištu' })
      }
  
      await db.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE id = ?`,
        [quantity, existing[0].id]
      )
    } else {
      if (quantity > availableStock) {
        return res.status(400).json({ message: 'Nema dovoljno proizvoda na skladištu' })
      }
  
      await db.query(
        `INSERT INTO cart_items (user_id, product_id, title, price, image, quantity, selected_gram, color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, product_id, title, price, image, quantity, selectedGram, color]
      )
    }
  
    return res.status(200).json({ message: 'Dodano u košaricu' })
  }
  

  if (req.method === 'DELETE') {
    const body = req.body
    const { userId, productId, image } = body
    const selectedGram = body.selectedGram ?? null
    const selectedColor = body.color ?? null

    try {
      await db.query(
        `DELETE FROM cart_items 
         WHERE user_id = ? AND product_id = ? AND image = ?
         AND (selected_gram = ? OR (selected_gram IS NULL AND ? IS NULL))
         AND (color = ? OR (color IS NULL AND ? IS NULL))`,
        [userId, productId, image, selectedGram, selectedGram, selectedColor, selectedColor]
      )

      return res.status(200).json({ message: 'Uklonjeno iz košarice' })
    } catch (err) {
      console.error('Greška pri brisanju iz košarice:', err)
      return res.status(500).json({ message: 'Greška na serveru' })
    }
  }

  return res.status(405).json({ message: 'Metoda nije dozvoljena' })
}
