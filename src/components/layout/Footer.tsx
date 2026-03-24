import { FileText } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative w-full py-14 z-[100] bg-cream">
      <div className="section-card mx-[6vw] p-[5vh_5vw]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-semibold text-ink">The Paperwork Squad</span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Business formation, compliance, funding readiness, and digital systems — all in one place.
            </p>
          </div>
          {[
            { title: 'Services', links: ['Business Formation', 'Compliance & Filing', 'Trucking Setup', 'Funding & Credit'] },
            { title: 'Company', links: ['About Us', 'How It Works', 'Industries', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Disclaimer', 'Refund Policy'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-ink text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <button className="text-sm text-muted hover:text-accent transition-colors">{link}</button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-8 border-t border-gray-100">
          <p className="text-sm text-muted">© 2026 The Paperwork Squad. All rights reserved.</p>
          <p className="text-sm text-muted">info@thepaperworksquad.com</p>
        </div>
      </div>
    </footer>
  );
}
