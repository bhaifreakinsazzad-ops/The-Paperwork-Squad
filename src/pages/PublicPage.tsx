import Navigation from '../components/layout/Navigation'
import Footer from '../components/layout/Footer'
import HeroSection from '../components/sections/HeroSection'
import HowItWorksSections from '../components/sections/HowItWorksSections'
import PricingSection from '../components/sections/PricingSection'
import OtherSections from '../components/sections/OtherSections'

type Props = {
  onOpenAuth: (mode: 'login' | 'register') => void
  onOpenConsult: () => void
  onOpenValuation: () => void
  onOpenFundability: () => void
}

export default function PublicPage({ onOpenAuth, onOpenConsult, onOpenValuation, onOpenFundability }: Props) {
  return (
    <div className="min-h-screen bg-transparent">
      <Navigation onOpenAuth={onOpenAuth} onOpenConsult={onOpenConsult} />
      <main>
        <HeroSection onOpenConsult={onOpenConsult} onOpenFundability={onOpenFundability} />
        <HowItWorksSections />
        <PricingSection onOpenConsult={onOpenConsult} />
        <OtherSections onOpenValuation={onOpenValuation} />
      </main>
      <Footer />
    </div>
  )
}
