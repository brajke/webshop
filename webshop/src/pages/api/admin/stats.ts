import { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/backend/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const [userRows]: any = await db.query('SELECT COUNT(*) AS userCount FROM users')
    const userCount = userRows[0]?.userCount || 0

    const [orderRows]: any = await db.query('SELECT COUNT(*) AS orderCount FROM orders')
    const orderCount = orderRows[0]?.orderCount || 0

    const [revenueRows]: any = await db.query(
      "SELECT SUM(total) AS totalRevenue FROM orders WHERE status = 'placeno'"
    )
    const totalRevenue = Number(revenueRows[0]?.totalRevenue || 0)

    const [itemRows]: any = await db.query(
      'SELECT SUM(quantity) AS totalItems FROM order_items'
    )
    const totalItems = Number(itemRows[0]?.totalItems || 0)

    const [topRows]: any = await db.query(`
      SELECT p.title, SUM(oi.quantity) AS sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY oi.product_id
      ORDER BY sold DESC
      LIMIT 1
    `)
    const topProduct = topRows[0]?.title || 'Nema podataka'

    const [todayRows]: any = await db.query(`
      SELECT SUM(total) AS todayRevenue
      FROM orders
      WHERE status = 'placeno' AND DATE(created_at) = CURDATE()
    `)
    const todayRevenue = Number(todayRows[0]?.todayRevenue || 0)

    const [lastRows]: any = await db.query(`
      SELECT id FROM orders ORDER BY created_at DESC LIMIT 1
    `)
    const lastOrderId = lastRows[0]?.id || null

    res.status(200).json({
      users: userCount,
      orders: orderCount,
      revenue: totalRevenue,
      totalItems,
      topProduct,
      todayRevenue,
      lastOrderId,
    })
  } catch (err) {
    console.error('Greška u stats endpointu:', err)
    res.status(500).json({ error: 'Greška na serveru.' })
  }
}
