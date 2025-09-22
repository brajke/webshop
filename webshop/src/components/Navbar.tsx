'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { FaSearch, FaShoppingCart } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { useCart } from '@/context/CartContext'
import CartDropdown from './CartDropdown'
import { usePathname, useSearchParams } from 'next/navigation'

const categories = ['strelice', 'pera', 'nastavci', 'spicevi', 'mete', 'snizenja']

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState<string[]>([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, logout } = useUser()
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const { cartItems } = useCart()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const normalize = (str: string) =>
    str.toLowerCase().replace(/š/g, 's').replace(/č/g, 'c').replace(/ž/g, 'z')

  const handleSearch = () => {
    const keyword = normalize(searchTerm)
    const match = categories.find((kw) => keyword.includes(kw))
    if (match) {
      setSearchTerm('')
      setFiltered([])
      router.push(`/${match}`)
    } else {
      alert(`Nema rezultata za: ${searchTerm}`)
    }
  }

  const scrollToSlider = (cat: string) => {
    window.dispatchEvent(new CustomEvent('navigate-to-slider', { detail: cat }))
    document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setFiltered([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-black text-white px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Link href="/">
              <img src="/img/datsShop.png" alt="logo" width={110} height={110} className="mt-2 md:mt-3" />
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <div
              ref={searchBoxRef}
              className="search flex items-center bg-gray-300 rounded-[10px] px-4 py-2 relative w-full max-w-md"
            >
              <input
                placeholder="Search..."
                className="SearchInput w-full bg-transparent outline-none text-black"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  const result = categories.filter((kw) =>
                    normalize(kw).includes(normalize(e.target.value))
                  )
                  setFiltered(result)
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                autoComplete="off"
              />
              <button onClick={handleSearch}>
                <FaSearch className="text-gray-600 text-[18px]" />
              </button>

              {filtered.length > 0 && (
                <div className="absolute top-[110%] left-0 w-full bg-zinc-800 rounded-lg shadow-lg z-50 max-h-[300px] overflow-y-auto">
                  <ul>
                    {filtered.map((kw) => (
                      <li
                        key={kw}
                        className="px-4 py-2 text-gray-300 hover:bg-white hover:text-black cursor-pointer"
                        onClick={() => {
                          setSearchTerm('')
                          setFiltered([])
                          router.push(`/${kw}`)
                        }}
                      >
                        {kw.charAt(0).toUpperCase() + kw.slice(1)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/snizenja"
              className="text-white text-[20px] border-b-2 border-red-600 font-sans hover:text-gray-400"
            >
              %SNIŽENJA%
            </Link>
            <div className="relative">
              <div
                className="bg-white border border-gray-300 rounded-full p-2 shadow-md flex items-center gap-2 cursor-pointer"
                onClick={() => setShowCartDropdown((prev) => !prev)}
              >
                <FaShoppingCart className="text-black text-[20px]" />
                <span className="bg-red-600 text-white px-2 text-xs rounded-full">
                  {cartItems.length}
                </span>
              </div>
              {showCartDropdown && (
                <CartDropdown onClose={() => setShowCartDropdown(false)} />
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-4 text-sm text-white">
                <span className="whitespace-nowrap">Dobrodošao, {user.name}</span>
                <Link href="/profile" className="hover:underline text-blue-300">Profil</Link>
                {user.role === 'user' && (
                  <Link href="/my-orders" className="hover:underline text-blue-300">Moje narudžbe</Link>
                )}
                <button onClick={logout} className="hover:underline text-red-400">Odjava</button>
              </div>
            ) : (
              <div className="flex gap-4 text-sm text-white">
                <Link href="/login" className="hover:underline">Login</Link>
                <Link href="/register" className="hover:underline">Register</Link>
              </div>
            )}
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="flex justify-end gap-6 text-sm text-yellow-400">
            <Link href="/admin" className="hover:underline">Admin panel</Link>
            <Link href="/admin/orders" className="hover:underline">Narudžbe</Link>
            <Link href="/admin/dashboard" className="hover:underline">Statistika</Link>
            <Link href="/admin/settings" className="hover:underline">Postavke</Link>
          </div>
        )}

        <div className="flex justify-center items-center gap-[50px] py-4">
          <Link
            href="/"
            className="text-[18px] text-gray-300 hover:text-white transition"
          >
            Naslovna
          </Link>
          {categories
            .filter((cat) => cat.toLowerCase() !== 'snizenja')
            .map((cat) => (
              <Link
                key={cat}
                href={`/${cat}`}
                className="text-[18px] text-gray-300 hover:text-white transition"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
