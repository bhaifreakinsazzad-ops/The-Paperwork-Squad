import { useState } from 'react'
import type { AppUser } from '../../types'

type Props = {
  mode: 'login' | 'register'
  onClose: () => void
  onLogin: (user: AppUser) => void
  onSwitchMode: (mode: 'login' | 'register') => void
}

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }: Props) {
  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('client@example.com')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin({
      id: 'demo-user',
      name,
      email,
      role: email.includes('admin') ? 'admin' : 'client',
      company: 'TPS Demo Co.',
    })
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="card-surface w-full max-w-md p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">{mode === 'login' ? 'Login' : 'Create account'}</h2>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === 'register' && (
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Full name" />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input type="password" className="w-full rounded-2xl border border-slate-200 px-4 py-3" placeholder="Password" />
          <button className="btn-primary w-full" type="submit">{mode === 'login' ? 'Continue' : 'Create account'}</button>
        </form>
        <button className="mt-4 text-sm text-slate-600" onClick={() => onSwitchMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  )
}
