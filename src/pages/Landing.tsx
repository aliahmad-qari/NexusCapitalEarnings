import { Navbar } from '../components/Landing/Navbar.tsx';
import { Hero } from '../components/Landing/Hero.tsx';
import { Stats } from '../components/Landing/Stats.tsx';
import { Features } from '../components/Landing/Features.tsx';
import { Plans } from '../components/Landing/Plans.tsx';
import { CTA } from '../components/Landing/CTA.tsx';
import { Footer } from '../components/Landing/Footer.tsx';

export const Landing = () => {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <Navbar />
      <main className="pt-24">
        <Hero />
        <Stats />
        <Features />
        <Plans />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
