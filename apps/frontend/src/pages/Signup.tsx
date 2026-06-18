import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { signupUser } from '../api/auth'
import { useAuthStore } from '../store/authStore'

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
  </svg>
)

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) })

  const { mutate, isPending, error } = useMutation({
    mutationFn: signupUser,
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

  const onSubmit = (data: SignupFormData) => {
    mutate({ name: data.name, email: data.email, password: data.password })
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl shadow-2xl px-8 py-10 bg-base bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-0 border border-gray-100">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-surface tracking-wide">dFlow</h1>
          <p className="mt-2 text-sm text-surface">Create your account</p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-surface">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              {...register('name')}
              className={`w-full rounded-lg bg-base border px-4 py-2.5 text-sm text-surface placeholder:text-neutral-500 outline-none focus:ring-1 transition-colors duration-200 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-neutral-600 focus:border-accent focus:ring-accent'}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-surface">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('password')}
                className={`w-full rounded-lg bg-base border pr-11 px-4 py-2.5 text-sm text-surface placeholder:text-neutral-500 outline-none focus:ring-1 transition-colors duration-200 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-neutral-600 focus:border-accent focus:ring-accent'}`}
              />
              <button type="button" onClick={() => setShowPassword(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-surface">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register('confirmPassword')}
                className={`w-full rounded-lg bg-base border pr-11 px-4 py-2.5 text-sm text-surface placeholder:text-neutral-500 outline-none focus:ring-1 transition-colors duration-200 ${errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-neutral-600 focus:border-accent focus:ring-accent'}`}
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showConfirm ? 'Hide password' : 'Show password'}>
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-accent hover:bg-[#e64a19] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm transition-colors duration-200 mt-2"
          >
            {isPending ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <a href="/login" className="text-accent hover:underline font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

export default Signup;
