import { useMemo } from 'react'
import type { AppUser } from '../types'

export function useAuth(email?: string): { user: AppUser | null; isAdmin: boolean } {
  const user = useMemo<AppUser | null>(() => {
    if (!email) return null
    return {
      id: 'derived-user',
      name: 'Portal User',
      email,
      role: email.includes('admin') ? 'admin' : 'client',
    }
  }, [email])

  return {
    user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
  }
}
