import { db } from '../db'
import bcrypt from 'bcrypt'

export async function registerUser(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)

  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, 'user']
  )

  return result
}

export async function findUserByEmail(email: string) {
  const [rows]: any = await db.execute(
    'SELECT * FROM users WHERE email = ?',
    [email]
  )

  return rows.length > 0 ? rows[0] : null
}

export async function verifyPassword(inputPassword: string, hashedPassword: string) {
  return bcrypt.compare(inputPassword, hashedPassword)
}
