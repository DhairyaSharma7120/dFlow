import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { User } from '../models/user.model.js'

const SALT_ROUNDS = 12

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

function issueToken(res: Response, userId: string): void {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')

  const token = jwt.sign({ userId }, secret, { expiresIn: '7d' })
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export async function signup(req: Request, res: Response): Promise<void> {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten().fieldErrors })
    return
  }

  const { name, email, password } = parsed.data

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(409).json({ message: 'Email already in use' })
    return
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({ name, email, password: hashed })

  issueToken(res, String(user._id))
  res.status(201).json({
    message: 'Account created',
    user: { id: user._id, name: user.name, email: user.email },
  })
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid input', errors: parsed.error.flatten().fieldErrors })
    return
  }

  const { email, password } = parsed.data

  const user = await User.findOne({ email })
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  issueToken(res, String(user._id))
  res.json({
    message: 'Logged in',
    user: { id: user._id, name: user.name, email: user.email },
  })
}

export async function logout(_req: Request, res: Response): Promise<void> {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}

export async function me(req: Request, res: Response): Promise<void> {
  const token = (req.cookies as Record<string, string | undefined>)?.token
  if (!token) {
    res.status(401).json({ message: 'Not authenticated' })
    return
  }

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')

  try {
    const payload = jwt.verify(token, secret) as { userId: string }
    const user = await User.findById(payload.userId).select('-password')
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    res.json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
