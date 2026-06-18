import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  userId: string
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = (req.cookies as Record<string, string | undefined>)?.token
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not defined')

  try {
    const payload = jwt.verify(token, secret) as JwtPayload
    ;(req as AuthRequest).userId = payload.userId
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
