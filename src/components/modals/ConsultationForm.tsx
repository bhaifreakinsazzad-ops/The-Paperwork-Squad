type Props = {
  onClose: () => void
}

export default function ConsultationForm({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <div className="card-surface w-full max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Book a consultation</h2>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        <form className="mt-6 grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Full name" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Email" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Phone" />
          <input className="rounded-2xl border border-slate-200 px-4 py-3" placeholder="Company" />
          <select className="rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2">
            <option>Business formation</option>
            <option>Compliance support</option>
            <option>Trucking setup</option>
            <option>General consultation</option>
          </select>
          <textarea className="min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2" placeholder="Tell us what you need help with" />
          <button type="button" className="btn-primary md:col-span-2">Submit request</button>
        </form>
      </div>
    </div>
  )
}
