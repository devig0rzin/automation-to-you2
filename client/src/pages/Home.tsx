import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import StorytellingSection from '@/components/StorytellingSection';
import ServicesSection from '@/components/ServicesSection';
import AuthoritySection from '@/components/AuthoritySection';
import ResultsSection from '@/components/ResultsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DifferentialsSection from '@/components/DifferentialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import GlobalBackground from '@/components/GlobalBackground';

/**
 * Design: Futuristic AI Automation Center
 * - Hero cinematográfico com 3D e parallax
 * - Storytelling visual com narrativa scroll
 * - Seções com profundidade e 3D
 * - Microinterações premium
 * - Ambiente vivo com partículas e grids
 * - Autoridade visual com números reais
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white relative">
      <GlobalBackground />
      <main className="flex-grow relative z-10">
        <HeroSection />
        <AboutSection />
        <StorytellingSection />
        <ServicesSection />
        <AuthoritySection />
        <ResultsSection />
        <HowItWorksSection />
        <DifferentialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
