import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { loginUser } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
        setUser(data.user) 
        navigate('/')
    },
  })

  const serverError =
    axios.isAxiosError(error) && error.response?.data?.message
      ? (error.response.data.message as string)
      : error
        ? 'Something went wrong. Please try again.'
        : null

  const onSubmit = (data: LoginFormData) => mutate(data)

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 ">
      <div className="w-full max-w-md rounded-2xl shadow-2xl px-8 py-10 bg-base bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">

        {/* Logo / Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-surface tracking-wide">dFlow</h1>
          <p className="mt-2 text-sm text-surface">Sign in to your account</p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-surface">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register('email')}
              className={`w-full rounded-lg bg-base border px-4 py-2.5 text-sm text-surface placeholder:text-neutral-500 outline-none focus:ring-1 transition-colors duration-200 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-neutral-600 focus:border-accent focus:ring-accent'}`}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-surface">
                Password
              </label>
              <a href="#" className="text-xs text-accent hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
                className={`w-full rounded-lg bg-base border pr-11 px-4 py-2.5 text-sm text-surface placeholder:text-neutral-500 outline-none focus:ring-1 transition-colors duration-200 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-neutral-600 focus:border-accent focus:ring-accent'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent hover:bg-[#e64a19] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-colors duration-200 mt-2"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-accent hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
