import { PACKAGES } from '../../lib/constants'
import { currency } from '../../lib/utils'

type Props = {
  onOpenConsult: () => void
}

export default function PricingSection({ onOpenConsult }: Props) {
  return (
    <section id="pricing" className="container-shell py-16 md:py-24">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Simple pricing</h2>
        <p className="mt-3 text-slate-600">Clear package options for startups, operators, and growing businesses.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className={`card-surface p-6 ${pkg.border}`}>
            {pkg.badge && <div className="mb-4 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{pkg.badge}</div>}
            <h3 className="text-2xl font-bold text-slate-900">{pkg.name}</h3>
            <div className="mt-4 flex items-end gap-2">
              <div className="text-4xl font-black text-slate-900">{currency(pkg.price)}</div>
              <div className="pb-1 text-sm text-slate-400 line-through">{currency(pkg.anchor)}</div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{pkg.best}</p>
            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {pkg.includes.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <button className="btn-primary mt-8 w-full" onClick={onOpenConsult}>Get started</button>
          </div>
        ))}
      </div>
    </section>
  )
}
