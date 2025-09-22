'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const { user, logout } = useUser()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const oldPassword = (document.getElementById('oldPassword') as HTMLInputElement).value
    const newPassword = (document.getElementById('newPassword') as HTMLInputElement).value
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value

    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user!.id, name, email }),
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        setMessage('Podaci uspješno ažurirani.')
      } else {
        setMessage(data.message || ' Greška prilikom ažuriranja podataka.')
        return
      }
    } catch {
      setMessage(' Server greška (ime/email).')
      return
    }

    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setMessage(' Molimo popuni sva polja za promjenu lozinke.')
        return
      }

      if (newPassword !== confirmPassword) {
        setMessage(' Nove lozinke se ne podudaraju.')
        return
      }

      try {
        const res = await fetch('/api/user/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user!.id,
            oldPassword,
            newPassword,
          }),
        })

        const data = await res.json()
        if (!res.ok) {
          setMessage(data.message || ' Greška kod promjene lozinke.')
          return
        }

        setMessage(' Lozinka je također uspješno promijenjena.')
      } catch {
        setMessage(' Server greška (lozinka).')
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm('Jesi siguran da želiš obrisati račun?')) return

    await fetch(`/api/user/delete?id=${user!.id}`, { method: 'DELETE' })
    logout()
    router.push('/')
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Tvoj profil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Ime</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <hr className="my-4" />
        <h3 className="text-lg font-semibold mb-1">Promjena lozinke</h3>

        <div>
          <label className="block mb-1 text-sm">Trenutna lozinka</label>
          <input id="oldPassword" type="password" className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Nova lozinka</label>
          <input id="newPassword" type="password" className="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1 text-sm">Potvrdi novu lozinku</label>
          <input id="confirmPassword" type="password" className="w-full px-4 py-2 border rounded" />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Spremi promjene
        </button>

        {message && <p className="text-sm mt-2 text-center text-blue-600">{message}</p>}
      </form>

      <button
        onClick={handleDelete}
        className="w-full bg-red-600 text-white py-2 rounded mt-6 hover:bg-red-700"
      >
        Obriši korisnički račun
      </button>
    </div>
  )
}
