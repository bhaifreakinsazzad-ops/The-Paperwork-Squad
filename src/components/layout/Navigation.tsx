type Props = {
  onOpenAuth: (mode: 'login' | 'register') => void
  onOpenConsult: () => void
}

export default function Navigation({ onOpenAuth, onOpenConsult }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <div>
          <div className="text-lg font-extrabold text-slate-900">The Paperwork Squad</div>
          <div className="text-xs text-slate-500">Business setup, compliance, and systems</div>
        </div>
        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
          <a href="#portal">Portal</a>
        </nav>
        <div className="flex gap-3">
          <button className="btn-secondary" onClick={() => onOpenAuth('login')}>Login</button>
          <button className="btn-primary" onClick={onOpenConsult}>Book Consultation</button>
        </div>
      </div>
    </header>
  )
}
