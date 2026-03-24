import { STATS } from '../../lib/constants'

type Props = {
  onOpenConsult: () => void
  onOpenFundability: () => void
}

export default function HeroSection({ onOpenConsult, onOpenFundability }: Props) {
  return (
    <section className="container-shell grid gap-10 py-16 md:grid-cols-2 md:py-24">
      <div>
        <div className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">Built for founders, operators, and service businesses</div>
        <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl">Stop getting buried in the paperwork.</h1>
        <p className="mt-5 max-w-2xl text-lg text-slate-600">The Paperwork Squad helps you launch, organize, and manage business paperwork, compliance tasks, client operations, and service delivery through one streamlined system.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onOpenConsult}>Book a consultation</button>
          <button className="btn-secondary" onClick={onOpenFundability}>Check fundability</button>
        </div>
      </div>
      <div className="card-surface p-8">
        <div className="grid gap-4 md:grid-cols-3">
          {STATS.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
              <div className="text-2xl font-black text-slate-900">{item.value}</div>
              <div className="mt-1 text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.2em] text-slate-300">What you get</div>
          <ul className="mt-4 space-y-3 text-sm text-slate-100">
            <li>• Business formation and filing guidance</li>
            <li>• Client portal for tracking, documents, and invoices</li>
            <li>• Organized workflows for compliance and service execution</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
