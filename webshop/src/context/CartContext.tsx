'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useUser } from './UserContext'

type CartItem = {
  cart_id: number
  product_id: number
  title: string
  price: string
  image: string
  quantity: number
  user_id?: number
  selected_gram?: string
  stock_quantity: number
  color?: string
}

type CartContextType = {
  cartItems: CartItem[]
  refreshCart: () => Promise<void>
  clearCart: () => void 
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  refreshCart: async () => {},
  clearCart: () => {},
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { user } = useUser()
  const clearCart = () => {
    setCartItems([])
  }
  

  const refreshCart = async () => {
    if (!user) return
    try {
      console.log("Pozivam refreshCart za user:", user?.id)
      const res = await fetch(`/api/cart?userId=${user.id}`)
      const data = await res.json()
      setCartItems(data)
    } catch (err) {
      console.error('Ne mogu dohvatiti košaricu:', err)
    }
  }

  useEffect(() => {
    if (user) {
      refreshCart()
    } else {
      clearCart()
    }
  }, [user])

  return (
    <CartContext.Provider value={{ cartItems, refreshCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
