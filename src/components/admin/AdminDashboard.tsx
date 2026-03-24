import { useState } from 'react';
import {
  LayoutDashboard, Users, FileText, DollarSign, BarChart3,
  Settings, LogOut, Bell, Search, Plus, Eye, Edit2,
  ArrowUp, ArrowDown, Shield, MessageSquare, TrendingUp
} from 'lucide-react';
import type { AppUser } from '../../types';
import { DEMO_LEADS, DEMO_CASES, DEMO_INVOICES } from '../../lib/constants';
import { initials } from '../../lib/utils';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'cases', label: 'Cases', icon: FileText },
  { id: 'billing', label: 'Billing', icon: DollarSign },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_BADGE: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Contacted': 'bg-purple-100 text-purple-700',
  'Qualified': 'bg-green-100 text-green-700',
  'Proposal Sent': 'bg-amber-100 text-amber-700',
  'In Process': 'bg-blue-100 text-blue-700',
  'Waiting on Client': 'bg-amber-100 text-amber-700',
  'Under Review': 'bg-purple-100 text-purple-700',
  'Submitted': 'bg-gray-100 text-gray-600',
  'paid': 'bg-green-100 text-green-700',
  'due': 'bg-amber-100 text-amber-700',
};

const PRIORITY_DOT: Record<string, string> = { high: 'text-red-500', medium: 'text-amber-500', low: 'text-gray-400' };

const DEMO_CLIENTS = [
  { id: 'c1', name: 'Alex Johnson', company: 'Johnson Logistics LLC', email: 'client@demo.com', cases: 2, revenue: 324, status: 'Active', joined: 'Nov 15' },
  { id: 'c2', name: 'Maria Garcia', company: 'Garcia Consulting', email: 'mgarcia@mail.com', cases: 1, revenue: 99, status: 'Active', joined: 'Nov 20' },
  { id: 'c3', name: 'James Wilson', company: 'Wilson Trucking Inc', email: 'jwilson@truck.com', cases: 3, revenue: 848, status: 'Active', joined: 'Oct 10' },
];

interface Props { user: AppUser; onLogout: () => void; }

export default function AdminDashboard({ user, onLogout }: Props) {
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');

  const totalRevenue = DEMO_INVOICES.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const pending = DEMO_INVOICES.filter(i => i.status === 'due').reduce((s, i) => s + i.amount, 0);

  const METRICS = [
    { label: 'Revenue (MTD)', val: `$${totalRevenue}`, delta: '+18%', up: true, color: 'text-accent bg-red-50' },
    { label: 'Active Clients', val: DEMO_CLIENTS.length, delta: '+3', up: true, color: 'text-accent-blue bg-blue-50' },
    { label: 'Open Cases', val: DEMO_CASES.length, delta: '2 urgent', up: false, color: 'text-purple-600 bg-purple-50' },
    { label: 'New Leads Today', val: 4, delta: '+2', up: true, color: 'text-green-600 bg-green-50' },
    { label: 'Invoices Due', val: `$${pending}`, delta: '2 pending', up: false, color: 'text-amber-600 bg-amber-50' },
    { label: 'Satisfaction', val: '98%', delta: '+1%', up: true, color: 'text-accent bg-red-50' },
  ];

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-navy flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Shield style={{ width: 14, height: 14 }} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-display font-semibold text-white">TPS Admin</span>
              <div className="text-[10px] text-accent font-mono uppercase tracking-wider">Control Center</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                tab === item.id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}>
              <item.icon style={{ width: 16, height: 16 }} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-white">
              {initials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-accent">Super Admin</div>
            </div>
          </div>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/40 hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-all">
            <LogOut style={{ width: 14, height: 14 }} />
            <span className="text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-display font-semibold text-ink">
            {NAV.find(n => n.id === tab)?.label}
          </h1>
          <button className="relative w-9 h-9 rounded-xl bg-cream border border-gray-200 flex items-center justify-center">
            <Bell style={{ width: 15, height: 15 }} className="text-muted" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
          </button>
        </header>

        <div className="p-6">

          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {METRICS.map(m => (
                  <div key={m.label} className={`${m.color.split(' ')[1]} border border-gray-100 rounded-2xl p-5`}>
                    <p className="text-xs text-muted mb-2">{m.label}</p>
                    <p className={`text-3xl font-display font-black ${m.color.split(' ')[0]} mb-1`}>{m.val}</p>
                    <div className={`text-xs flex items-center gap-1 ${m.up ? 'text-green-600' : 'text-amber-600'}`}>
                      {m.up ? <ArrowUp style={{ width: 10, height: 10 }} /> : <ArrowDown style={{ width: 10, height: 10 }} />}
                      {m.delta} this month
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="section-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-ink">Recent Leads</h3>
                    <button onClick={() => setTab('leads')} className="text-xs text-accent hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {DEMO_LEADS.slice(0, 3).map(lead => (
                      <div key={lead.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-blue/20 text-accent-blue text-xs font-bold flex items-center justify-center">
                          {lead.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{lead.name}</p>
                          <p className="text-xs text-muted">{lead.service} · {lead.source}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[lead.status]}`}>{lead.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-semibold text-ink">Open Cases</h3>
                    <button onClick={() => setTab('cases')} className="text-xs text-accent hover:underline">View all</button>
                  </div>
                  <div className="space-y-3">
                    {DEMO_CASES.map(c => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className={`text-sm ${PRIORITY_DOT[c.priority]}`}>●</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{c.clientName} — {c.service}</p>
                          <p className="text-xs text-muted">Assigned: {c.assignedTo} · Due {c.dueDate}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── LEADS ── */}
          {tab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search style={{ width: 14, height: 14 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input type="text" placeholder="Search leads…" value={search} onChange={e => setSearch(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50 w-64" />
                </div>
                <button className="btn-primary text-sm py-2.5"><Plus style={{ width: 15, height: 15 }} /> Add Lead</button>
              </div>

              <div className="section-card overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Name', 'Service', 'Source', 'Score', 'Status', 'Date', ''].map(h => (
                        <th key={h} className="text-left text-[11px] text-muted uppercase tracking-wider px-5 py-3.5 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {DEMO_LEADS.filter(l => l.name.toLowerCase().includes(search.toLowerCase())).map(lead => (
                      <tr key={lead.id} className="hover:bg-cream transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">{lead.name.charAt(0)}</div>
                            <div>
                              <p className="text-sm font-medium text-ink">{lead.name}</p>
                              <p className="text-xs text-muted">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-ink">{lead.service}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs bg-purple-50 border border-purple-100 text-purple-600 px-2 py-0.5 rounded-full">{lead.source}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${lead.score >= 80 ? 'bg-green-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${lead.score}%` }} />
                            </div>
                            <span className="text-xs text-muted">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[lead.status]}`}>{lead.status}</span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted">{lead.date}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button className="text-muted hover:text-ink"><Eye style={{ width: 14, height: 14 }} /></button>
                            <button className="text-muted hover:text-accent"><Edit2 style={{ width: 14, height: 14 }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CASES ── */}
          {tab === 'cases' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{DEMO_CASES.length} active cases</p>
                <button className="btn-primary text-sm py-2.5"><Plus style={{ width: 15, height: 15 }} /> New Case</button>
              </div>
              {DEMO_CASES.map(c => (
                <div key={c.id} className="section-card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted">{c.caseNumber}</span>
                        <span className={`text-xs font-bold ${PRIORITY_DOT[c.priority]}`}>● {c.priority}</span>
                      </div>
                      <h3 className="font-display font-semibold text-ink">{c.clientName} — {c.service}</h3>
                      <p className="text-sm text-muted">Assigned to {c.assignedTo} · Due {c.dueDate}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="text-xs bg-cream border border-gray-200 rounded-lg px-3 py-1.5 text-ink focus:outline-none">
                      {['Submitted', 'Under Review', 'Waiting on Client', 'In Process', 'Completed'].map(s => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <select className="text-xs bg-cream border border-gray-200 rounded-lg px-3 py-1.5 text-ink focus:outline-none">
                      <option>Assign to…</option>
                      {['Mike R.', 'Sara T.', 'Jordan K.'].map(n => <option key={n}>{n}</option>)}
                    </select>
                    <button className="ml-auto text-xs text-accent hover:underline font-medium">View Full Case →</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── BILLING ── */}
          {tab === 'billing' && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Collected', val: `$${totalRevenue}`, color: 'text-accent bg-red-50' },
                  { label: 'Pending Collection', val: `$${pending}`, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Total Invoices', val: DEMO_INVOICES.length, color: 'text-accent-blue bg-blue-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.color.split(' ')[1]} border border-gray-100 rounded-2xl p-5`}>
                    <p className="text-xs text-muted mb-2">{s.label}</p>
                    <p className={`text-3xl font-display font-black ${s.color.split(' ')[0]}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="section-card overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-ink">All Invoices</h3>
                  <button className="flex items-center gap-1 text-xs text-accent border border-accent/30 px-3 py-1.5 rounded-lg hover:bg-accent/5 transition-colors">
                    <Plus style={{ width: 12, height: 12 }} /> New Invoice
                  </button>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Invoice #', 'Client', 'Service', 'Amount', 'Status', 'Date', ''].map(h => (
                        <th key={h} className="text-left text-[11px] text-muted uppercase tracking-wider px-5 py-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {DEMO_INVOICES.map(inv => (
                      <tr key={inv.id} className="hover:bg-cream transition-colors">
                        <td className="px-5 py-3 text-xs font-mono text-muted">{inv.invoiceNumber}</td>
                        <td className="px-5 py-3 text-sm text-ink">{inv.clientName}</td>
                        <td className="px-5 py-3 text-sm text-muted">{inv.service}</td>
                        <td className="px-5 py-3 text-sm font-display font-bold text-ink">${inv.amount}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[inv.status]}`}>
                            {inv.status === 'paid' ? 'Paid' : 'Due'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-muted">{inv.date}</td>
                        <td className="px-5 py-3">
                          <button className="text-xs text-accent hover:underline">Send Link</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab === 'analytics' && (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="section-card p-5">
                  <h3 className="font-display font-semibold text-ink mb-4">Lead Sources</h3>
                  <div className="space-y-3">
                    {[
                      { source: 'Valuation Calculator', count: 12, pct: 40 },
                      { source: 'Fundability Checker', count: 9, pct: 30 },
                      { source: 'Consultation Form', count: 6, pct: 20 },
                      { source: 'Referral', count: 3, pct: 10 },
                    ].map(s => (
                      <div key={s.source}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">{s.source}</span>
                          <span className="text-accent font-bold">{s.count} leads · {s.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-card p-5">
                  <h3 className="font-display font-semibold text-ink mb-4">Revenue by Package</h3>
                  <div className="space-y-3">
                    {[
                      { pkg: 'Revenue System ($449)', pct: 55, color: 'bg-navy' },
                      { pkg: 'Growth Builder ($249)', pct: 30, color: 'bg-accent-blue' },
                      { pkg: 'Launch Starter ($99)', pct: 15, color: 'bg-accent' },
                    ].map(p => (
                      <div key={p.pkg}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">{p.pkg}</span>
                          <span className="text-ink font-medium">{p.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.color} rounded-full`} style={{ width: `${p.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: 'Avg Order Value', val: '$249', delta: '+12%', up: true },
                  { label: 'Conversion Rate', val: '6.8%', delta: '+1.2%', up: true },
                  { label: 'Client Lifetime Value', val: '$612', delta: '+8%', up: true },
                ].map(m => (
                  <div key={m.label} className="section-card p-5">
                    <p className="text-xs text-muted mb-2">{m.label}</p>
                    <p className="text-3xl font-display font-black text-ink">{m.val}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <ArrowUp style={{ width: 10, height: 10 }} /> {m.delta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-5">
              <div className="section-card p-6">
                <h3 className="font-display font-semibold text-ink mb-4">Team Members</h3>
                <div className="space-y-3">
                  {[
                    { name: 'TPS Admin', email: 'admin@tps.com', role: 'Super Admin' },
                    { name: 'Mike Rodriguez', email: 'mike@tps.com', role: 'Case Manager' },
                    { name: 'Sara Thompson', email: 'sara@tps.com', role: 'Case Manager' },
                  ].map(m => (
                    <div key={m.email} className="flex items-center gap-3 bg-cream border border-gray-100 rounded-xl p-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center">
                        {initials(m.name)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{m.name}</p>
                        <p className="text-xs text-muted">{m.email}</p>
                      </div>
                      <span className="text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2.5 py-1 rounded-full font-medium">{m.role}</span>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl py-3 text-sm text-muted hover:text-ink hover:border-gray-300 transition-all">
                    <Plus style={{ width: 15, height: 15 }} /> Invite Team Member
                  </button>
                </div>
              </div>

              <div className="section-card p-6">
                <h3 className="font-display font-semibold text-ink mb-2">Stripe Integration</h3>
                <p className="text-sm text-muted mb-4">Connect your Stripe account to accept payments directly in the portal.</p>
                <button className="flex items-center gap-2 bg-[#635BFF] text-white font-display font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#5348e7] transition-colors">
                  Connect Stripe Account
                </button>
              </div>

              <div className="section-card p-6">
                <h3 className="font-display font-semibold text-ink mb-2">Supabase</h3>
                <p className="text-sm text-muted mb-1">VITE_SUPABASE_URL: <span className="font-mono text-xs text-accent">{import.meta.env.VITE_SUPABASE_URL ?? 'Not set'}</span></p>
                <p className="text-xs text-muted">Add environment variables in your platform settings.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
