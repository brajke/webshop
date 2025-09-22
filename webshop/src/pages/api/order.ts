import { db } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { userId, name, address, email, payment, cartItems } = req.body

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Košarica je prazna' })
    }

    let total = 0

    for (const item of cartItems) {
      const quantity = item.quantity || 1
      const price = item.price || 0
      const lineTotal = quantity * price
      total += lineTotal
      const [settingsRows]: any = await db.query('SELECT * FROM settings LIMIT 1')
      const settings = settingsRows[0]
      const shippingCost = parseFloat(settings.shipping_cost)
      const freeShippingMin = parseFloat(settings.free_shipping_min)
      
      if (total < freeShippingMin) {
        total += shippingCost
      }
    }

    const [result]: any = await db.query(
      'INSERT INTO orders (user_id, name, address, email, payment_method, total) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, name, address, email, payment, total]
    )

    const orderId = result.insertId
    for (const item of cartItems) {
      const { product_id, quantity, price } = item

      const selectedColor = item.color ?? null
      const selectedGram = item.selected_gram ?? null

      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price, color, gram) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, product_id, quantity, price, selectedColor, selectedGram]
      )

      if (selectedColor !== null && selectedGram !== null) {
        const [variants]: any = await db.query(
          `SELECT stock_quantity FROM product_variants WHERE product_id = ? AND color = ? AND gram = ?`,
          [product_id, selectedColor, selectedGram]
        )

        const variant = variants[0]

        if (!variant || variant.stock_quantity < quantity) {
          return res.status(400).json({
            message: `Nema dovoljno zaliha za varijantu: ${selectedColor}, ${selectedGram}`,
          })
        }
      }
      if (item.selected_gram != null || item.color != null) {
        await db.query(
          `UPDATE product_variants 
           SET stock_quantity = GREATEST(stock_quantity - ?, 0)
           WHERE product_id = ? AND gram <=> ? AND color <=> ?`,
          [item.quantity, item.product_id, item.selected_gram ?? null, item.color ?? null]
        )
      } else {
        await db.query(
          'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
          [quantity, item.product_id, quantity]
        );
      }
    }
    await db.query(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    )
    
    return res.status(200).json({ message: 'Narudžba uspješno spremljena',orderId })
  } catch (err) {
    console.error('Greška prilikom obrade narudžbe:', err)
    return res.status(500).json({ message: 'Greška na serveru' })
  }
}
