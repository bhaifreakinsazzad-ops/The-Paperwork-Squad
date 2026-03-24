import type { AppUser } from '../../types'

type Props = {
  user: AppUser
  onLogout: () => void
}

const leads = [
  { name: 'Marcus Hill', service: 'Business Formation', status: 'New' },
  { name: 'Taylor Reed', service: 'Compliance', status: 'Qualified' },
  { name: 'Apex Transit', service: 'Trucking Setup', status: 'Proposal Sent' },
]

export default function AdminDashboard({ user, onLogout }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-shell flex items-center justify-between py-4">
          <div>
            <div className="text-xl font-black text-slate-900">Admin Dashboard</div>
            <div className="text-sm text-slate-500">Signed in as {user.email}</div>
          </div>
          <button className="btn-secondary" onClick={onLogout}>Logout</button>
        </div>
      </div>
      <div className="container-shell py-8">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="card-surface p-6"><div className="text-sm text-slate-500">Active cases</div><div className="mt-2 text-3xl font-black text-slate-900">48</div></div>
          <div className="card-surface p-6"><div className="text-sm text-slate-500">Pending docs</div><div className="mt-2 text-3xl font-black text-slate-900">13</div></div>
          <div className="card-surface p-6"><div className="text-sm text-slate-500">Open invoices</div><div className="mt-2 text-3xl font-black text-slate-900">9</div></div>
          <div className="card-surface p-6"><div className="text-sm text-slate-500">New leads</div><div className="mt-2 text-3xl font-black text-slate-900">21</div></div>
        </div>

        <div className="mt-6 card-surface p-6">
          <h2 className="text-2xl font-black text-slate-900">Recent leads</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3">Name</th>
                  <th className="py-3">Service</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.name} className="border-b border-slate-100">
                    <td className="py-4 font-medium text-slate-900">{lead.name}</td>
                    <td className="py-4 text-slate-600">{lead.service}</td>
                    <td className="py-4 text-slate-600">{lead.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
