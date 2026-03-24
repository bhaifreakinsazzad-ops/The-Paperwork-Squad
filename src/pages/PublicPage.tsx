import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from '../components/layout/Navigation';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import { HowItWorksSection, ServicesSection } from '../components/sections/HowItWorksSections';
import PricingSection from '../components/sections/PricingSection';
import {
  TestimonialsSection,
  FAQSection,
  DashboardPreviewSection,
  LeadGenBanner,
  ClosingCTASection,
} from '../components/sections/OtherSections';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenConsult: () => void;
  onOpenValuation: () => void;
  onOpenFundability: () => void;
}

export default function PublicPage({ onOpenAuth, onOpenConsult, onOpenValuation, onOpenFundability }: Props) {
  // Kimi's scroll snap system
  useEffect(() => {
    const setup = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || !pinned.length) return;

      const ranges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: ((st.end ?? st.start) / maxScroll),
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = ranges.some(r => value >= r.start - 0.02 && value <= r.end + 0.02);
            if (!inPinned) return value;
            return ranges.reduce(
              (closest, r) => Math.abs(r.center - value) < Math.abs(closest - value) ? r.center : closest,
              ranges[0]?.center ?? 0
            );
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setup, 600);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div className="relative">
      <div className="grain-overlay" />
      <Navigation onOpenAuth={onOpenAuth} onOpenConsult={onOpenConsult} />
      <main className="relative">
        <HeroSection onOpenConsult={onOpenConsult} onOpenAuth={onOpenAuth} />
        <HowItWorksSection />
        <ServicesSection onOpenConsult={onOpenConsult} />
        <PricingSection onOpenConsult={onOpenConsult} />
        <LeadGenBanner onOpenValuation={onOpenValuation} onOpenFundability={onOpenFundability} />
        <TestimonialsSection />
        <DashboardPreviewSection onOpenAuth={onOpenAuth} />
        <FAQSection onOpenConsult={onOpenConsult} />
        <ClosingCTASection onOpenConsult={onOpenConsult} />
        <Footer />
      </main>
    </div>
  );
}
