import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Layers } from 'lucide-react';
import { PACKAGES, STRIPE_LINKS } from '../../lib/constants';

gsap.registerPlugin(ScrollTrigger);

interface PricingSectionProps {
  onOpenConsult: () => void;
}

export default function PricingSection({ onOpenConsult }: PricingSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const pricingCards = Array.from(card.querySelectorAll('.pricing-card')) as HTMLElement[];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(card, { y: '100vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0);
      tl.fromTo(pricingCards[1], { y: '60vh', opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: 'power2.out' }, 0.1);
      tl.fromTo(pricingCards[0], { y: '60vh', opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: 'power2.out' }, 0.14);
      tl.fromTo(pricingCards[2], { y: '60vh', opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, ease: 'power2.out' }, 0.18);
      tl.fromTo(pricingCards, { y: 0, opacity: 1 }, { y: '-25vh', opacity: 0, ease: 'power2.in', stagger: 0.02 }, 0.7);
      tl.fromTo(card, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  const handleBuy = (pkgId: string) => {
    const link = STRIPE_LINKS[pkgId as keyof typeof STRIPE_LINKS];
    if (link && !link.includes('REPLACE_ME')) {
      window.open(link, '_blank');
    } else {
      onOpenConsult();
    }
  };

  return (
    <section id="pricing" ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-40">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh]">
        <div className="p-[5%] h-full flex flex-col">
          <div className="text-center mb-6">
            <span className="text-label block mb-2">Transparent Pricing</span>
            <h2 className="text-[clamp(30px,3.8vw,52px)] font-display font-bold text-ink mb-2">
              Choose Your <span className="highlight-red">Launch Package</span>
            </h2>
            <p className="text-muted text-base">Flat-fee pricing. No hourly billing, no hidden costs.</p>
          </div>

          <div className="flex-1 grid grid-cols-3 gap-5">
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`pricing-card rounded-[22px] p-6 flex flex-col border-2 ${
                  pkg.badge
                    ? 'bg-[#FFF5F5] border-accent ring-2 ring-accent/20'
                    : 'bg-white border-gray-100'
                }`}
              >
                {pkg.badge && (
                  <span className="bg-accent text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-3">
                    {pkg.badge}
                  </span>
                )}
                <p className="text-xs text-muted mb-1">{pkg.best}</p>
                <h3 className="text-xl font-display font-semibold text-ink mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-4xl font-display font-bold text-ink">${pkg.price}</span>
                  <span className="text-muted line-through text-base">${pkg.anchor}</span>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.includes.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(pkg.id)}
                  className={`w-full py-3 rounded-full font-display font-semibold text-sm transition-all ${
                    pkg.badge
                      ? 'bg-accent text-white hover:bg-[#c43333]'
                      : 'bg-cream text-ink hover:bg-gray-200'
                  }`}
                >
                  Get Started — ${pkg.price}
                </button>
              </div>
            ))}
          </div>

          {/* Custom solutions row */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={onOpenConsult}
              className="flex items-center gap-2 bg-navy/5 border border-navy/10 rounded-full px-6 py-2.5 text-sm text-navy font-medium hover:bg-navy/10 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Need something custom? Get a quote starting at $699+
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
