import { Navbar } from '../components/Landing/Navbar.tsx';
import { Hero } from '../components/Landing/Hero.tsx';
import { Stats } from '../components/Landing/Stats.tsx';
import { HowItWorks } from '../components/Landing/HowItWorks.tsx';
import { Features } from '../components/Landing/Features.tsx';
import { Plans } from '../components/Landing/Plans.tsx';
import { ROICalculator } from '../components/Landing/ROICalculator.tsx';
import { Testimonials } from '../components/Landing/Testimonials.tsx';
import { CTA } from '../components/Landing/CTA.tsx';
import { Footer } from '../components/Landing/Footer.tsx';

export const Landing = () => {
  return (
    <div className="bg-nexus-bg text-on-surface selection:bg-nexus-primary/20 selection:text-nexus-primary">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Stats />
        <HowItWorks />
        <Features />
        <Plans />
        <ROICalculator />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
