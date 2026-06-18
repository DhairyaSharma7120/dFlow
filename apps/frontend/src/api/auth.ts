import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
})

export interface SignupPayload {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  message: string
  user: { id: string; name: string; email: string }
}

export async function signupUser(data: SignupPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/signup', data)
  return res.data
}

export interface LoginPayload {
  email: string
  password: string
}

export async function loginUser(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/auth/login', data)
  return res.data
}

export async function logoutUser(): Promise<void> {
  await api.post('/api/auth/logout')
}

export async function getMe(): Promise<AuthResponse> {
  const res = await api.get<AuthResponse>('/api/auth/me')
  return res.data
}
