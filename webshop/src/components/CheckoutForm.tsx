'use client'

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import type { StripeCardElement } from '@stripe/stripe-js'
import { useImperativeHandle, forwardRef } from 'react'

export type CheckoutFormRef = {
  handleCardPayment: () => Promise<boolean>
}

interface Props {
  clientSecret: string
  onError: (message: string) => void
}

const CheckoutForm = forwardRef<CheckoutFormRef, Props>(({ clientSecret, onError }, ref) => {
  const stripe = useStripe()
  const elements = useElements()

  useImperativeHandle(ref, () => ({
    handleCardPayment: async () => {
      if (!clientSecret) {
        onError('Client secret nije postavljen.')
        return false
      }
      
      if (!stripe || !elements) {
        onError('Stripe nije spreman.')
        return false
      }

      const element = elements.getElement(CardElement)

      if (!element) {
        onError('Kartični element nije pronađen.')
        return false
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: element as unknown as StripeCardElement,
        },
      })

      if (result.error) {
        onError(result.error.message || 'Greška pri plaćanju.')
        return false
      }

      return result.paymentIntent?.status === 'succeeded'
    }
  }))

  return (
    <div className="p-2 border border-gray-300 rounded mb-4">
      <CardElement />
    </div>
  )
})

export default CheckoutForm
