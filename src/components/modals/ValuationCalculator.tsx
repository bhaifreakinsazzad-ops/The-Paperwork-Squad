import { useMemo, useState } from 'react'

type Props = {
  onClose: () => void
}

export default function ValuationCalculator({ onClose }: Props) {
  const [revenue, setRevenue] = useState(250000)
  const [multiple, setMultiple] = useState(2.2)

  const value = useMemo(() => revenue * multiple, [revenue, multiple])

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="card-surface w-full max-w-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Business valuation</h2>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        <div className="mt-6 space-y-6">
          <label className="block">
            <div className="mb-2 text-sm font-medium text-slate-700">Estimated annual revenue</div>
            <input type="range" min="50000" max="2000000" step="10000" value={revenue} onChange={(e) => setRevenue(Number(e.target.value))} className="w-full" />
            <div className="mt-2 text-sm text-slate-500">${revenue.toLocaleString()}</div>
          </label>
          <label className="block">
            <div className="mb-2 text-sm font-medium text-slate-700">Valuation multiple</div>
            <input type="range" min="1" max="5" step="0.1" value={multiple} onChange={(e) => setMultiple(Number(e.target.value))} className="w-full" />
            <div className="mt-2 text-sm text-slate-500">{multiple.toFixed(1)}x</div>
          </label>
          <div className="rounded-3xl bg-slate-900 p-6 text-white">
            <div className="text-sm uppercase tracking-[0.16em] text-slate-300">Estimated value</div>
            <div className="mt-2 text-4xl font-black">${Math.round(value).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
