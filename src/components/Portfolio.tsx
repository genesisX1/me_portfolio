'use client';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { usePreferences, PreferenceControls } from './Preferences';
import { Intro, ProjectCursor, Marquee, usePortfolioMotion } from './MotionDetails';
import { profile } from '@/data/portfolio';
import { navigationLinks as links } from '@/data/navigation';
import { Mark, Arrow } from './portfolio/UI';
import HeroSection from './portfolio/HeroSection';
import ProjectsSection from './portfolio/ProjectsSection';
import ServicesSection from './portfolio/ServicesSection';
import ExperienceSection from './portfolio/ExperienceSection';
import ContactSection from './portfolio/ContactSection';
import Booking from './Booking';
import CodeChallenge from './CodeChallenge';
import MobileNavigation from './MobileNavigation';
export default function Portfolio() {
  const { localize } = usePreferences();
  const activeSection = usePortfolioMotion();
  const [introReady, setIntroReady] = useState(false),
    [mobileMenu, setMobileMenu] = useState(false),
    [sticky, setSticky] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    if (!mobileMenu) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenu(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [mobileMenu]);
  return localize(
    <>
      <a href="#main" className="skip-link">
        Aller au contenu
      </a>
      <Intro onReady={setIntroReady} />
      <ProjectCursor />
      <div className="reading-progress" aria-hidden="true">
        <span />
      </div>
      <main id="main">
        <HeroSection
          introReady={introReady}
          activeSection={activeSection}
          mobileMenu={mobileMenu}
          onMenuToggle={() => setMobileMenu(!mobileMenu)}
        />
        <div className={`floating-nav ${sticky ? 'visible' : ''}`} aria-hidden={!sticky}>
          <a href="#top" aria-label="Retour en haut" tabIndex={sticky ? 0 : -1}>
            <Mark />
          </a>
          <nav aria-label="Navigation rapide">
            {links.map(([name, href]) => (
              <a
                key={href}
                href={href}
                aria-current={activeSection === href.slice(1) ? 'location' : undefined}
                className={activeSection === href.slice(1) ? 'nav-active' : ''}
                tabIndex={sticky ? 0 : -1}
              >
                {name}
              </a>
            ))}
          </nav>
          <button
            className="floating-more"
            aria-label="Toutes les sections"
            aria-expanded={mobileMenu}
            aria-controls="mobile-menu"
            tabIndex={sticky ? 0 : -1}
            onClick={() => setMobileMenu(true)}
          >
            ☰
          </button>
          <PreferenceControls compact tabIndex={sticky ? 0 : -1} />
          <a
            className="floating-rdv"
            href="#booking"
            aria-current={activeSection === 'booking' ? 'location' : undefined}
            tabIndex={sticky ? 0 : -1}
          >
            RDV <Arrow />
          </a>
        </div>{' '}
        <Marquee>
          {[0, 1].map((n) => (
            <span className="marquee-track" key={n}>
              {[
                'DÉVELOPPEMENT',
                'DESIGN GRAPHIQUE',
                'IDENTITÉ VISUELLE',
                'INTERFACES',
                'CRÉATIVITÉ',
              ].map((t) => (
                <span key={t}>
                  {t}
                  <b>✳</b>
                </span>
              ))}
            </span>
          ))}
        </Marquee>
        <ProjectsSection />
        <ServicesSection />
        <ExperienceSection />
        <CodeChallenge />
        <Booking />
        <ContactSection />{' '}
        <footer>
          <span>
            © {new Date().getFullYear()} {profile.firstName} {profile.lastName}
          </span>
          <span>Conçu avec intention. Développé avec soin.</span>
          <a href="#top">Retour en haut ↑</a>
        </footer>
      </main>
      <MobileNavigation
        open={mobileMenu}
        onClose={() => setMobileMenu(false)}
        links={links}
        active={activeSection}
      />
      <style>{reduce ? `.marquee>div,.signature-badge svg{animation:none!important}` : ''}</style>
    </>,
  );
}
