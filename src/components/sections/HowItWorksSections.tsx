const STEPS = [
  {
    title: 'Choose your service',
    body: 'Pick the paperwork, setup, compliance, or support package that fits your current stage.',
  },
  {
    title: 'Submit details securely',
    body: 'Use the consultation form or client portal to send business details and upload required documents.',
  },
  {
    title: 'Track progress in one place',
    body: 'Monitor status, tasks, messages, invoices, and document approvals from a structured dashboard.',
  },
]

export default function HowItWorksSections() {
  return (
    <section id="services" className="container-shell py-16 md:py-24">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl font-black text-slate-900 md:text-4xl">How it works</h2>
        <p className="mt-3 text-slate-600">A simple operating flow designed to reduce confusion and keep clients moving fast.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step.title} className="card-surface p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">{index + 1}</div>
            <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
