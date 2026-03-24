import type { AppUser } from '../../types'

type Props = {
  user: AppUser
  onLogout: () => void
}

const tasks = [
  'Upload state filing documents',
  'Review compliance checklist',
  'Pay open invoice',
]

export default function ClientPortal({ user, onLogout }: Props) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-shell flex items-center justify-between py-4">
          <div>
            <div className="text-xl font-black text-slate-900">Client Portal</div>
            <div className="text-sm text-slate-500">Welcome back, {user.name}</div>
          </div>
          <button className="btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="container-shell grid gap-6 py-8 md:grid-cols-3">
        <div className="card-surface p-6 md:col-span-2">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Case Overview</div>
          <h2 className="mt-3 text-2xl font-black text-slate-900">Business Compliance Setup</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Status</div><div className="mt-1 font-bold text-slate-900">In Process</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Assigned to</div><div className="mt-1 font-bold text-slate-900">TPS Operations</div></div>
            <div className="rounded-2xl bg-slate-50 p-4"><div className="text-sm text-slate-500">Due date</div><div className="mt-1 font-bold text-slate-900">April 3, 2026</div></div>
          </div>
          <div className="mt-6">
            <div className="text-sm font-semibold text-slate-700">Required client tasks</div>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              {tasks.map((task) => <li key={task}>• {task}</li>)}
            </ul>
          </div>
        </div>
        <div className="card-surface p-6">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Account</div>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div><span className="font-semibold text-slate-900">Company:</span> {user.company || '—'}</div>
            <div><span className="font-semibold text-slate-900">Email:</span> {user.email}</div>
            <div><span className="font-semibold text-slate-900">Role:</span> {user.role}</div>
          </div>
          <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
            <div className="text-sm uppercase tracking-[0.16em] text-slate-300">Open Invoice</div>
            <div className="mt-2 text-3xl font-black">$699</div>
            <p className="mt-2 text-sm text-slate-200">Growth package balance pending.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
