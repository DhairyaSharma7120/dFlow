import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { logoutUser } from '../api/auth'
import { useCurrentUser } from '../hooks/useCurrentUser'

function Navbar() {
  const navigate = useNavigate()
  const clearUser = useAuthStore((s) => s.clearUser)
  const { setUser } = useAuthStore()
  const { data } = useCurrentUser()
  const user = data?.user ?? null
  useEffect(() => {
    if(data?.user) {
    setUser(data.user)
  }
  },[]);
  
  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      clearUser()
      navigate('/login')
    },
  })

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-18 bg-base border-b border-[#1e1e1e] shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
      <span className="text-xl font-bold text-surface tracking-wide italic">
        dFlow
      </span>

      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-surface">{user.name}</span>
          </div>
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="px-5 py-2 rounded-md border border-transparent bg-surface text-white text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#E64A19] disabled:opacity-60"
          >
            {isPending ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 text-white rounded-md border bg-surface text-sm cursor-pointer transition-colors duration-200 hover:border-neutral-400 hover:text-white"
          >
            Log in
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="px-5 py-2 rounded-md border border-transparent bg-accent text-white text-sm font-semibold cursor-pointer transition-colors duration-200 hover:bg-[#E64A19]"
          >
            Sign up
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar