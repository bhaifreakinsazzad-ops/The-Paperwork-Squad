import { useMemo, useState } from 'react'

type Props = {
  onClose: () => void
}

export default function FundabilityChecker({ onClose }: Props) {
  const [years, setYears] = useState(1)
  const [revenue, setRevenue] = useState(50000)
  const [hasBusinessBank, setHasBusinessBank] = useState(true)
  const [hasWebsite, setHasWebsite] = useState(true)

  const score = useMemo(() => {
    let base = 40
    base += Math.min(years * 10, 30)
    base += revenue >= 100000 ? 20 : revenue >= 50000 ? 10 : 0
    base += hasBusinessBank ? 5 : 0
    base += hasWebsite ? 5 : 0
    return Math.min(base, 100)
  }, [years, revenue, hasBusinessBank, hasWebsite])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="card-surface w-full max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Fundability checker</h2>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label>
            <div className="mb-2 text-sm font-medium text-slate-700">Years in business</div>
            <input type="number" min="0" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label>
            <div className="mb-2 text-sm font-medium text-slate-700">Annual revenue</div>
            <input type="number" min="0" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input type="checkbox" checked={hasBusinessBank} onChange={(e) => setHasBusinessBank(e.target.checked)} />
            <span className="text-sm text-slate-700">Business bank account exists</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input type="checkbox" checked={hasWebsite} onChange={(e) => setHasWebsite(e.target.checked)} />
            <span className="text-sm text-slate-700">Business website exists</span>
          </label>
        </div>
        <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
          <div className="text-sm uppercase tracking-[0.16em] text-slate-300">Estimated readiness</div>
          <div className="mt-2 text-4xl font-black">{score}/100</div>
          <p className="mt-3 text-sm text-slate-200">This is a guidance score for lead qualification and readiness, not a lending decision.</p>
        </div>
      </div>
    </div>
  )
}
