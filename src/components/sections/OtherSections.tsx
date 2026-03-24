import { FAQS } from '../../lib/constants'

type Props = {
  onOpenValuation: () => void
}

export default function OtherSections({ onOpenValuation }: Props) {
  return (
    <>
      <section id="portal" className="container-shell py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card-surface p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Client Portal</div>
            <h3 className="mt-3 text-3xl font-black text-slate-900">A cleaner client experience.</h3>
            <p className="mt-4 text-slate-600">Clients can log in, view case progress, track tasks, upload files, check invoices, and message the team from one place.</p>
          </div>
          <div className="card-surface p-8">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Business Valuation</div>
            <h3 className="mt-3 text-3xl font-black text-slate-900">Estimate your business value.</h3>
            <p className="mt-4 text-slate-600">Use the built-in valuation flow to get a quick estimate range and start more informed conversations.</p>
            <button className="btn-primary mt-6" onClick={onOpenValuation}>Open valuation tool</button>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Frequently asked questions</h2>
          <p className="mt-3 text-slate-600">Straight answers for common questions before you get started.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq) => (
            <div key={faq.q} className="card-surface p-6">
              <h3 className="text-lg font-bold text-slate-900">{faq.q}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
