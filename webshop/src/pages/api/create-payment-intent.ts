import { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string, {
  apiVersion: '2025-05-28.basil', 
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' })
  }

  const { amount } = req.body 

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, 
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true, 
      },
    })

    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
}
