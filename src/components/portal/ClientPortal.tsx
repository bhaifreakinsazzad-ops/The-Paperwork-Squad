import { useState } from 'react';
import {
  LayoutDashboard, FileText, CheckSquare, MessageSquare,
  FolderOpen, CreditCard, Settings, LogOut, Bell, ChevronRight,
  Upload, Download, Send, AlertCircle, CheckCircle, ArrowUpRight,
  Building2, Globe, TrendingUp, X
} from 'lucide-react';
import type { AppUser, Task } from '../../types';
import { DEMO_CASES, DEMO_TASKS, DEMO_INVOICES, DEMO_CONVERSATIONS, DEMO_MESSAGES, STRIPE_LINKS } from '../../lib/constants';
import { initials } from '../../lib/utils';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'services', label: 'My Services', icon: FileText },
  { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
  { id: 'invoices', label: 'Invoices', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_BADGE: Record<string, string> = {
  'In Process': 'bg-blue-100 text-blue-700',
  'Waiting on Client': 'bg-amber-100 text-amber-700',
  'Completed': 'bg-green-100 text-green-700',
  'Submitted': 'bg-gray-100 text-gray-600',
  'Under Review': 'bg-purple-100 text-purple-700',
};

const UPSELLS = [
  { icon: CreditCard, title: 'Business Credit Building', desc: 'Get your DUNS number & start building fundable credit.', price: '$299', bg: 'bg-green-50', iconBg: 'bg-green-600' },
  { icon: Building2, title: 'Trucking Authority', desc: 'MC, DOT, BOC-3, IFTA — full trucking compliance.', price: '$399', bg: 'bg-blue-50', iconBg: 'bg-blue-600' },
  { icon: TrendingUp, title: 'Funding Qualification', desc: 'Get matched with funding sources ready for your profile.', price: '$199', bg: 'bg-purple-50', iconBg: 'bg-purple-600' },
];

interface Props { user: AppUser; onLogout: () => void; }

export default function ClientPortal({ user, onLogout }: Props) {
  const [tab, setTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [msg, setMsg] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pendingCount = tasks.filter(t => t.status !== 'completed').length;
  const unread = DEMO_CONVERSATIONS.filter(c => c.unread).length;

  const toggleTask = (id: number) =>
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));

  const handlePay = (invoiceId: string) => {
    const link = STRIPE_LINKS['growth-builder'];
    if (!link.includes('REPLACE_ME')) window.open(link, '_blank');
    else alert('Stripe payment link not configured yet. Add to STRIPE_LINKS in constants.ts');
  };

  return (
    <div className="flex min-h-screen bg-cream font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-white border-r border-gray-100 flex flex-col flex-shrink-0 shadow-sm`}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && <span className="text-sm font-display font-semibold text-ink truncate">The Paperwork Squad</span>}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                tab === item.id ? 'bg-accent/10 text-accent' : 'text-muted hover:text-ink hover:bg-gray-50'
              }`}>
              <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
              {sidebarOpen && (
                <>
                  <span className="text-sm font-medium truncate flex-1">{item.label}</span>
                  {item.id === 'tasks' && pendingCount > 0 && (
                    <span className="text-[10px] bg-accent text-white font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
                  )}
                  {item.id === 'messages' && unread > 0 && (
                    <span className="text-[10px] bg-red-500 text-white font-bold px-1.5 py-0.5 rounded-full">{unread}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <div className={`flex items-center gap-2.5 px-3 py-2 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials(user.name)}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-ink truncate">{user.name}</div>
                <div className="text-[10px] text-muted truncate">{user.company}</div>
              </div>
            )}
          </div>
          <button onClick={onLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 text-muted hover:text-red-500 rounded-xl hover:bg-red-50 transition-all mt-1 ${!sidebarOpen ? 'justify-center' : ''}`}>
            <LogOut style={{ width: 15, height: 15 }} />
            {sidebarOpen && <span className="text-xs">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted hover:text-ink transition-colors mr-4">
            <LayoutDashboard style={{ width: 18, height: 18 }} />
          </button>
          <h1 className="text-base font-display font-semibold text-ink">
            {tab === 'dashboard' ? `Welcome back, ${user.name.split(' ')[0]}` : NAV.find(n => n.id === tab)?.label}
          </h1>
          <div className="flex items-center gap-2 ml-auto">
            <button className="relative w-9 h-9 rounded-xl bg-cream border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bell style={{ width: 15, height: 15 }} className="text-muted" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />}
            </button>
          </div>
        </header>

        <div className="p-6">
          {/* ── DASHBOARD ── */}
          {tab === 'dashboard' && (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Active Cases', val: DEMO_CASES.length, color: 'text-accent-blue bg-blue-50' },
                  { label: 'Pending Tasks', val: pendingCount, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Unread Messages', val: unread, color: 'text-accent bg-red-50' },
                  { label: 'Invoices Due', val: DEMO_INVOICES.filter(i => i.status === 'due').length, color: 'text-green-600 bg-green-50' },
                ].map(c => (
                  <div key={c.label} className={`${c.color.split(' ')[1]} border border-gray-100 rounded-2xl p-5`}>
                    <div className={`text-3xl font-display font-black ${c.color.split(' ')[0]}`}>{c.val}</div>
                    <div className="text-xs text-muted mt-1">{c.label}</div>
                  </div>
                ))}
              </div>

              {/* Active cases */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-display font-semibold text-ink">Active Cases</h3>
                  <button onClick={() => setTab('services')} className="text-xs text-accent flex items-center gap-1">View all <ChevronRight style={{ width: 12, height: 12 }} /></button>
                </div>
                <div className="space-y-3">
                  {DEMO_CASES.map(c => (
                    <div key={c.id} className="section-card p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-sm font-display font-semibold text-ink">{c.service} — {c.caseNumber}</h4>
                          <p className="text-xs text-muted mt-0.5">{c.package} · Due {c.dueDate}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[c.status] ?? 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {c.stages.map((s, i) => (
                          <div key={s} className="flex-1">
                            <div className={`h-1.5 rounded-full ${i <= c.stageIndex ? 'bg-accent' : 'bg-gray-100'}`} />
                            <p className="text-[9px] text-muted text-center mt-1 truncate">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending tasks */}
              {pendingCount > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-display font-semibold text-ink">Action Required</h3>
                    <button onClick={() => setTab('tasks')} className="text-xs text-accent flex items-center gap-1">View all <ChevronRight style={{ width: 12, height: 12 }} /></button>
                  </div>
                  <div className="space-y-2">
                    {tasks.filter(t => t.status !== 'completed').slice(0, 3).map(t => (
                      <div key={t.id} className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl p-4">
                        <AlertCircle style={{ width: 16, height: 16 }} className="text-amber-500 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink">{t.title}</p>
                          <p className="text-xs text-muted">{t.caseLabel}</p>
                        </div>
                        <button onClick={() => setTab('tasks')} className="text-xs text-accent flex items-center gap-1 hover:underline">
                          Complete <ArrowUpRight style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upsells */}
              <div>
                <h3 className="text-sm font-display font-semibold text-ink mb-3">Recommended for You</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {UPSELLS.map(u => (
                    <div key={u.title} className={`${u.bg} border border-gray-100 rounded-2xl p-5`}>
                      <div className={`w-10 h-10 ${u.iconBg} rounded-full flex items-center justify-center mb-3`}>
                        <u.icon style={{ width: 18, height: 18 }} className="text-white" />
                      </div>
                      <h4 className="text-sm font-display font-semibold text-ink mb-1">{u.title}</h4>
                      <p className="text-xs text-muted mb-3 leading-relaxed">{u.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-accent font-display font-bold text-sm">{u.price}</span>
                        <button className="text-xs text-ink bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">Learn More</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <div className="space-y-4">
              {DEMO_CASES.map(c => (
                <div key={c.id} className="section-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display font-semibold text-ink">{c.service}</h3>
                      <p className="text-sm text-muted">{c.package} · {c.caseNumber} · Assigned: {c.assignedTo}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_BADGE[c.status] ?? 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                  </div>
                  <div className="flex gap-2">
                    {c.stages.map((s, i) => (
                      <div key={s} className="flex-1">
                        <div className={`h-2 rounded-full ${i <= c.stageIndex ? 'bg-accent' : 'bg-gray-100'}`} />
                        <p className="text-[9px] text-muted text-center mt-1">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── TASKS ── */}
          {tab === 'tasks' && (
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm text-muted">{pendingCount} tasks remaining</p>
              {tasks.map(t => (
                <div key={t.id} className={`flex items-center gap-4 bg-white border rounded-xl p-4 transition-all ${t.status === 'completed' ? 'border-gray-100 opacity-55' : 'border-gray-200'}`}>
                  <button onClick={() => toggleTask(t.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${t.status === 'completed' ? 'bg-accent border-accent' : 'border-gray-300 hover:border-accent'}`}>
                    {t.status === 'completed' && <CheckCircle style={{ width: 12, height: 12 }} className="text-white" />}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${t.status === 'completed' ? 'line-through text-muted' : 'text-ink'}`}>{t.title}</p>
                    <p className="text-xs text-muted">{t.caseLabel}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${t.priority === 'high' ? 'bg-red-50 text-red-600' : t.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* ── MESSAGES ── */}
          {tab === 'messages' && (
            <div className="flex gap-5 h-[calc(100vh-140px)]">
              <div className="w-60 flex-shrink-0 space-y-2">
                {DEMO_CONVERSATIONS.map(c => (
                  <div key={c.id} className={`bg-white border rounded-xl p-4 cursor-pointer hover:border-accent/30 transition-all ${c.unread ? 'border-accent/20' : 'border-gray-100'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-display font-semibold text-ink">{c.with}</span>
                      <span className="text-[10px] text-muted">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted truncate">{c.preview}</p>
                    {c.unread && <div className="w-2 h-2 rounded-full bg-accent mt-2" />}
                  </div>
                ))}
              </div>
              <div className="flex-1 section-card flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-display font-semibold text-ink">TPS Team Support</h4>
                  <p className="text-xs text-muted">Typically responds within 2 hours</p>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {DEMO_MESSAGES.map(m => (
                    <div key={m.id} className={`flex ${m.self ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${m.self ? 'bg-accent text-white' : 'bg-cream border border-gray-100 text-ink'}`}>
                        <p>{m.content}</p>
                        <p className={`text-[10px] mt-1 ${m.self ? 'text-white/60' : 'text-muted'}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 flex gap-3">
                  <input type="text" value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type your message..."
                    className="flex-1 bg-cream border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-accent/50" />
                  <button className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center hover:bg-[#c43333] transition-colors">
                    <Send style={{ width: 16, height: 16 }} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── DOCUMENTS ── */}
          {tab === 'documents' && (
            <div className="space-y-5 max-w-2xl">
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-accent/40 transition-colors cursor-pointer bg-white">
                <Upload style={{ width: 28, height: 28 }} className="text-muted mx-auto mb-3" />
                <p className="text-sm text-muted mb-1">Drag files here or click to upload</p>
                <p className="text-xs text-muted/60">PDF, JPG, PNG — up to 20MB</p>
                <button className="mt-4 bg-accent/10 border border-accent/30 text-accent text-sm font-medium px-5 py-2 rounded-lg hover:bg-accent/20 transition-colors">
                  Choose File
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Signed Operating Agreement.pdf', size: '245 KB', date: 'Dec 3, 2025', status: 'approved' },
                  { name: 'EIN Application.pdf', size: '182 KB', date: 'Dec 4, 2025', status: 'review' },
                ].map(d => (
                  <div key={d.name} className="section-card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <FileText style={{ width: 18, height: 18 }} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{d.name}</p>
                      <p className="text-xs text-muted">{d.size} · {d.date}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${d.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {d.status === 'approved' ? '✓ Approved' : 'In Review'}
                    </span>
                    <button className="text-muted hover:text-ink transition-colors">
                      <Download style={{ width: 15, height: 15 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── INVOICES ── */}
          {tab === 'invoices' && (
            <div className="space-y-4 max-w-2xl">
              {DEMO_INVOICES.map(inv => (
                <div key={inv.id} className="section-card p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted mb-0.5">Invoice #{inv.invoiceNumber}</p>
                      <h4 className="font-display font-semibold text-ink">{inv.service}</h4>
                      <p className="text-xs text-muted">{inv.date}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {inv.status === 'paid' ? 'Paid' : 'Payment Due'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-black text-ink">${inv.amount}</span>
                    {inv.status !== 'paid' ? (
                      <button onClick={() => handlePay(inv.id)} className="btn-primary text-sm py-2.5 px-6">
                        Pay Now via Stripe
                      </button>
                    ) : (
                      <button className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors">
                        <Download style={{ width: 14, height: 14 }} /> Receipt
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── SETTINGS ── */}
          {tab === 'settings' && (
            <div className="max-w-lg space-y-5">
              <div className="section-card p-6 space-y-4">
                <h3 className="font-display font-semibold text-ink">Profile Settings</h3>
                {[['Full Name', user.name], ['Email', user.email], ['Company', user.company ?? '']].map(([label, val]) => (
                  <div key={label}>
                    <label className="text-xs text-muted block mb-1">{label}</label>
                    <input type="text" defaultValue={val}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-ink bg-cream focus:outline-none focus:border-accent/50" />
                  </div>
                ))}
                <button className="btn-primary text-sm">Save Changes</button>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h3 className="font-display font-semibold text-red-600 mb-2">Danger Zone</h3>
                <button onClick={onLogout} className="text-sm text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
