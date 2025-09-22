import Navbar from '@/components/Navbar'
import '../index.css'
import { UserProvider } from '@/context/UserContext'
import { CartProvider } from '@/context/CartContext'


export const metadata = {
  title: 'Darts Shop',
  description: 'Online prodavnica pikado opreme',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
      <UserProvider>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </UserProvider>
      </body>
    </html>
  )
}
