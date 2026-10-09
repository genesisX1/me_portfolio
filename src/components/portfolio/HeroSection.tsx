'use client';
import { useEffect, useRef, useState } from 'react';
import { usePreferences, PreferenceControls } from '../Preferences';
import { preparePortrait, portraitHit } from '../portraitHit';
import PortraitEffects from '../PortraitEffects';
import OptimizedImage from '../OptimizedImage';
import { SocialLink } from '../MotionDetails';
import { profile, projects, services } from '@/data/portfolio';
import { navigationLinks as links } from '@/data/navigation';
import { portraitMode, safeExternalUrl } from '@/lib/interaction.mjs';
import { Arrow } from './UI';
export default function HeroSection({
  introReady,
  activeSection,
  mobileMenu,
  onMenuToggle,
}: {
  introReady: boolean;
  activeSection: string;
  mobileMenu: boolean;
  onMenuToggle: () => void;
}) {
  const { localize } = usePreferences();
  const [hovered, setHovered] = useState(false),
    [pinned, setPinned] = useState(false),
    [portraitReady, setPortraitReady] = useState(false);
  const developerImage = useRef<HTMLImageElement>(null),
    designerImage = useRef<HTMLImageElement>(null);
  const hoverFrame = useRef(0),
    lastPointer = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    for (const image of [developerImage.current, designerImage.current])
      if (image?.complete) preparePortrait(image);
    return () => cancelAnimationFrame(hoverFrame.current);
  }, []);
  useEffect(() => {
    if (designerImage.current?.complete && designerImage.current.naturalWidth > 0)
      setPortraitReady(true);
  }, []);
  const mode = portraitReady ? portraitMode(pinned, hovered) : 'dev';
  const design = mode === 'design';
  const socials = [['Instagram', profile.instagram, 'ig']].filter(([, url]) =>
    safeExternalUrl(url),
  );
  function hitPortrait(x: number, y: number) {
    // Test the visually dominant image, including its current CSS transform.
    const dev = developerImage.current,
      designer = designerImage.current;
    const visible = designer && Number(getComputedStyle(designer).opacity) > 0.5 ? designer : dev;
    return portraitHit(visible, x, y) || (hovered && portraitHit(dev, x, y));
  }
  function movePortrait(e: React.PointerEvent<HTMLButtonElement>) {
    if (e.pointerType !== 'mouse') return;
    const x = e.clientX,
      y = e.clientY,
      stage = e.currentTarget;
    lastPointer.current = { x, y };
    cancelAnimationFrame(hoverFrame.current);
    hoverFrame.current = requestAnimationFrame(() => {
      const hit = hitPortrait(x, y);
      stage.style.cursor = hit ? 'pointer' : 'default';
      setHovered(hit);
    });
  }
  function leavePortrait() {
    lastPointer.current = null;
    cancelAnimationFrame(hoverFrame.current);
    setHovered(false);
  }
  return localize(
    <section
      id="top"
      className={`hero panel ${introReady ? 'intro-ready' : ''} ${design ? 'is-design' : ''}`}
      aria-label="Présentation de Joackim DATE"
    >
      <header className="header">
        <a className="availability" href="#contact">
          <i />
          {profile.availability}
        </a>
        <nav aria-label="Navigation principale" className="desktop-nav">
          {links.map(([name, href], i) => (
            <a
              key={href}
              href={href}
              className={`${i === 3 ? 'accent' : ''} ${activeSection === href.slice(1) ? 'nav-active' : ''}`}
              aria-current={activeSection === href.slice(1) ? 'location' : undefined}
            >
              {name}
              {i === 0 || i === 1 ? (
                <sup>[{i === 0 ? projects.length : services.length}]</sup>
              ) : null}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="pill dark header-cta" href="#booking">
            Prenons rendez-vous <Arrow />
          </a>
          <div className="site-preferences">
            <PreferenceControls compact />
          </div>
          <button
            className="menu-button"
            aria-expanded={mobileMenu}
            aria-controls="mobile-menu"
            onClick={onMenuToggle}
          >
            {mobileMenu ? 'Fermer' : 'Menu'} <span>{mobileMenu ? '×' : '☰'}</span>
          </button>
        </div>
      </header>

      <h1 className="hero-name">
        <span>{profile.firstName}</span>
        <b>{profile.lastName}</b>
      </h1>
      <div className="hero-intro">
        <span className="eyebrow">DEUX REGARDS. UNE MÊME EXIGENCE.</span>
        <h2>
          <span key={mode} className="changing-title">
            {design ? profile.designerTitle : profile.developerTitle}
          </span>
        </h2>
        <p>{profile.description}</p>
        <a className="pill dark" href="#work">
          Découvrir mes projets <Arrow />
        </a>
        <span className="location">
          <i />
          {profile.location}
        </span>
      </div>
      <button
        className={`portrait-stage ${design ? 'designer-active' : ''}`}
        aria-label={design ? 'Afficher mon côté développeur' : 'Afficher mon côté designer'}
        aria-pressed={design}
        onPointerEnter={movePortrait}
        onPointerMove={movePortrait}
        onPointerLeave={leavePortrait}
        onPointerCancel={leavePortrait}
        onClick={(e) => {
          if (e.detail !== 0 && !hitPortrait(e.clientX, e.clientY)) return;
          cancelAnimationFrame(hoverFrame.current);
          setPinned(!design);
          setHovered(false);
        }}
      >
        <OptimizedImage
          sizes="(max-width: 760px) 90vw, (max-width: 1150px) 60vw, 55vw"
          ref={developerImage}
          onLoad={(e) => preparePortrait(e.currentTarget)}
          className="portrait portrait-dev"
          src="/images/developer.png"
          width="1122"
          height="1402"
          alt="Joackim, en tenue noire, travaillant sur un ordinateur avec des stickers de développeur"
          fetchPriority="high"
          draggable={false}
          aria-hidden={design}
        />
        <OptimizedImage
          sizes="(max-width: 760px) 90vw, (max-width: 1150px) 60vw, 55vw"
          fetchPriority="low"
          ref={designerImage}
          className="portrait portrait-design"
          src="/images/designer.png"
          width="1122"
          height="1402"
          alt="Joackim, en pull beige, présentant un ordinateur avec des stickers Adobe et Figma"
          onLoad={(e) => {
            preparePortrait(e.currentTarget);
            setPortraitReady(true);
          }}
          draggable={false}
          aria-hidden={!design}
        />
        <PortraitEffects design={design} />
      </button>
      <div className="signature-badge" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <text>
            <textPath href="#badge-circle" textLength="270">
              DÉVELOPPEUR · DESIGNER ·{' '}
            </textPath>
          </text>
        </svg>
        <span>
          <b key={mode} className="identity-symbol">
            {design ? '✳' : '</>'}
          </b>
        </span>
      </div>
      <aside className="hero-aside">
        {socials.length ? (
          socials.map(([name, url, icon]) => (
            <a
              className="social-pill"
              href={safeExternalUrl(url)}
              target="_blank"
              rel="noreferrer"
              key={name}
            >
              <span>{icon}</span>
              {name}
              <Arrow />
            </a>
          ))
        ) : (
          <>
            <a className="social-pill" href="#work">
              <span>↗</span>Mes projets
            </a>
            <a className="social-pill" href="#services">
              <span>✳</span>Mon savoir-faire
            </a>
            <a className="social-pill" href="#contact">
              <span>↗</span>Échangeons
            </a>
          </>
        )}
        <div className="hero-socials">
          <SocialLink name="GitHub" url={profile.github} />
          <SocialLink name="LinkedIn" url={profile.linkedin} />
        </div>
      </aside>
      <div className="portrait-controls">
        <span className="portrait-hint">
          Deux facettes, un même créatif <span>↗</span>
        </span>
        <div role="group" aria-label="Choisir le portrait">
          <button
            className={!design ? 'selected' : ''}
            aria-pressed={!design}
            onClick={() => {
              setPinned(false);
              setHovered(false);
            }}
          >
            Code <span>&lt;/&gt;</span>
          </button>
          <button
            className={design ? 'selected' : ''}
            aria-pressed={design}
            disabled={!portraitReady}
            onClick={() => {
              setPinned(true);
              setHovered(false);
            }}
          >
            Design <span>✳</span>
          </button>
        </div>
      </div>
    </section>,
  );
}
