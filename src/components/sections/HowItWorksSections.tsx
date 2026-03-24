import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Building2, FileText, Truck, CreditCard, Globe, Cpu } from 'lucide-react';
import { SERVICES } from '../../lib/constants';

gsap.registerPlugin(ScrollTrigger);

// ─── How It Works ──────────────────────────────────────────
export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const steps = stepsRef.current;
    if (!section || !card || !steps) return;

    const stepCards = Array.from(steps.children) as HTMLElement[];
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(card, { y: '100vh', opacity: 0 }, { y: 0, opacity: 1, ease: 'power2.out' }, 0);
      stepCards.forEach((el, i) => {
        tl.fromTo(el, { x: '-60vw', rotate: -8, opacity: 0 }, { x: 0, rotate: 0, opacity: 1, ease: 'power2.out' }, 0.08 + i * 0.04);
      });
      tl.fromTo(stepCards, { y: 0, opacity: 1 }, { y: '-30vh', opacity: 0, ease: 'power2.in', stagger: 0.02 }, 0.7);
      tl.fromTo(card, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  const steps = [
    { num: '01', title: 'Apply or Book', desc: 'Fill out our quick intake form or book a free 30-min consultation call.' },
    { num: '02', title: 'Create Your Portal', desc: 'Get instant access to your secure client dashboard and submit your documents.' },
    { num: '03', title: 'Track & Receive', desc: 'Watch real-time progress, message your team, and receive completed work.' },
    { num: '04', title: 'Launch & Scale', desc: 'Go live, unlock upsell services, and grow with a fully-built foundation.' },
  ];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-20">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh]">
        <div className="p-[6%] h-full flex flex-col">
          <div className="mb-2">
            <span className="text-label block mb-2">Simple Process</span>
            <h2 className="text-[clamp(32px,4vw,56px)] font-display font-bold text-ink">
              From Inquiry to <span className="highlight-red">Done</span>
            </h2>
          </div>
          <div ref={stepsRef} className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {steps.map((step) => (
              <div key={step.num} className="bg-cream rounded-[22px] p-6 flex flex-col relative">
                <span className="font-mono text-5xl font-bold text-accent mb-4">{step.num}</span>
                <h3 className="text-lg font-display font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <button className="text-accent font-medium flex items-center gap-2 hover:gap-3 transition-all text-sm">
              See our services <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Services Section ──────────────────────────────────────
const SERVICE_ICONS = { formation: Building2, compliance: FileText, trucking: Truck, funding: CreditCard, websites: Globe, apps: Cpu };

interface ServicesSectionProps { onOpenConsult: () => void; }

export function ServicesSection({ onOpenConsult }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const leftContent = card.querySelector('.left-content') as HTMLElement;
    const featureCards = Array.from(card.querySelectorAll('.feature-card')) as HTMLElement[];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: '+=130%', pin: true, scrub: 0.6 },
      });
      tl.fromTo(card, { x: '100vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0);
      tl.fromTo(leftContent, { x: '-40vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0.08);
      tl.fromTo(featureCards, { x: '40vw', scale: 0.92, opacity: 0 }, { x: 0, scale: 1, opacity: 1, ease: 'power2.out', stagger: 0.05 }, 0.12);
      tl.fromTo(leftContent, { x: 0, opacity: 1 }, { x: '-18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(featureCards, { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7);
      tl.fromTo(card, { opacity: 1 }, { opacity: 0.2, ease: 'power2.in' }, 0.75);
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative w-full h-screen flex items-center justify-center overflow-hidden z-30">
      <div ref={cardRef} className="section-card absolute left-[6vw] top-[10vh] w-[88vw] h-[80vh]">
        <div className="p-[6%] h-full flex gap-10">
          <div className="left-content w-[36%] flex flex-col justify-center">
            <span className="text-label block mb-3">What We Handle</span>
            <h2 className="text-[clamp(30px,3.8vw,52px)] font-display font-bold text-ink mb-4">
              Full-Stack <span className="highlight-red">Business</span> Services
            </h2>
            <p className="text-lg text-muted leading-relaxed mb-6">
              From paperwork to digital execution — everything your business needs in one place.
            </p>
            <ul className="space-y-3 mb-8">
              {['Same-day confirmation on all requests', 'Assigned specialist per service type', 'Secure document handling & portal tracking'].map(item => (
                <li key={item} className="flex items-start gap-3 text-ink text-sm">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={onOpenConsult} className="btn-primary w-fit text-sm">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 content-center">
            {SERVICES.map(service => {
              const Icon = SERVICE_ICONS[service.id as keyof typeof SERVICE_ICONS];
              return (
                <div
                  key={service.id}
                  onClick={onOpenConsult}
                  className="feature-card bg-cream border border-gray-100 rounded-[18px] p-5 cursor-pointer hover:border-accent/30 hover:bg-white transition-all"
                >
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-ink text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
