'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { user, login } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.message || 'Greška pri registraciji.')
      } else {
        setMessage('Registracija uspješna ')
        localStorage.setItem('user', JSON.stringify(data.user))
        login(data.user)
        router.push('/login')
      }
    } catch (err) {
      console.error(err)
      setMessage('Došlo je do greške na serveru.')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Registracija</h2>

      <input
        type="text"
        placeholder="Ime"
        className="w-full mb-3 px-4 py-2 border rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 px-4 py-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        pattern="^[^@\s]+@[^@\s]+\.com$"
      />

      <input
        type="password"
        placeholder="Lozinka"
        className="w-full mb-3 px-4 py-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        {loading ? 'Registracija...' : 'Registriraj se'}
      </button>

      {message && <p className={`mt-4 text-center text-sm ${message.includes('') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
    </form>
  )
}
