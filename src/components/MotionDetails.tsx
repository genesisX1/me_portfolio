'use client';
import { usePreferences } from './Preferences';
import { useEffect, useState, useRef, type ReactNode } from 'react';
import { safeExternalUrl } from '@/lib/interaction.mjs';

export { Intro } from './Intro';

export function SocialLink({ name, url }: { name: string; url: string }) {
  const { localize } = usePreferences();
  const href = safeExternalUrl(url);
  const content = (
    <>
      <svg className="social-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        {name === 'GitHub' ? (
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.84.09-.65.35-1.09.64-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 7c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.58c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
          />
        ) : (
          <>
            <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
            <path
              d="M7 10v7m0-10v.1m4 10v-7m0 3c0-4 6-4 6 0v4"
              stroke="var(--paper)"
              strokeWidth="2"
              fill="none"
            />
          </>
        )}
      </svg>
      <span>{name}</span>
      <span className="social-arrow" aria-hidden="true">
        ↗
      </span>
    </>
  );
  return localize(
    href ? (
      <a
        className="social-pill social-network"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      <span
        className="social-pill social-network unconfigured"
        role="link"
        aria-disabled="true"
        tabIndex={0}
        aria-label={`${name} — lien à renseigner`}
      >
        <span className="social-tooltip">Lien à renseigner</span>
        {content}
      </span>
    ),
  );
}
export function Marquee({ children }: { children: ReactNode }) {
  const { localize } = usePreferences();
  return localize(
    <div
      className="marquee"
      aria-label="Développement, design graphique, identité visuelle, interfaces, créativité"
    >
      <div aria-hidden="true">{children}</div>
    </div>,
  );
}

/** One scroll callback per animation frame; no React updates for pointer positions. */
export function usePortfolioMotion() {
  const [active, setActive] = useState('top');
  useEffect(() => {
    let frame = 0;
    const sections = [...document.querySelectorAll<HTMLElement>('main>section[id]')];
    const update = () => {
      frame = 0;
      const travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      document.documentElement.style.setProperty(
        '--page-progress',
        String(Math.min(1, Math.max(0, window.scrollY / travel))),
      );
      const threshold = window.innerHeight * 0.36;
      let id = 'top';
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= threshold) id = s.id;
      }
      if (
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3
      )
        id = 'contact';
      setActive((prev) => (prev === id ? prev : id));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty('--page-progress');
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)'),
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hero = document.querySelector<HTMLElement>('.hero');
    let frame = 0;
    let hovered: HTMLElement | null = null;
    const reset = () => {
      cancelAnimationFrame(frame);
      hero?.style.setProperty('--pointer-x', '0px');
      hero?.style.setProperty('--pointer-y', '0px');
      if (hovered) {
        hovered.style.removeProperty('translate');
        hovered = null;
      }
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || reduce.matches || event.pointerType !== 'mouse') return;
      const x = event.clientX,
        y = event.clientY,
        target = event.target;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (hero) {
          const box = hero.getBoundingClientRect();
          const inside = y >= box.top && y <= box.bottom && x >= box.left && x <= box.right;
          hero.style.setProperty(
            '--pointer-x',
            inside ? `${((x - box.left) / box.width - 0.5) * 10}px` : '0px',
          );
          hero.style.setProperty(
            '--pointer-y',
            inside ? `${((y - box.top) / box.height - 0.5) * 7}px` : '0px',
          );
        }
        const button =
          target instanceof Element
            ? target.closest<HTMLElement>(
                '.hero-intro>.pill,.header-cta,.challenge-bottom>.pill,.contact-bottom .pill,.experience-footer>a',
              )
            : null;
        if (hovered && hovered !== button) hovered.style.removeProperty('translate');
        hovered = button;
        if (button) {
          const b = button.getBoundingClientRect();
          button.style.translate = `${Math.max(-3, Math.min(3, (x - b.left - b.width / 2) * 0.045))}px ${Math.max(-2, Math.min(2, (y - b.top - b.height / 2) * 0.08))}px`;
        }
      });
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });
    document.addEventListener('keydown', reset);
    media.addEventListener('change', reset);
    reduce.addEventListener('change', reset);
    return () => {
      reset();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('blur', reset);
      window.removeEventListener('scroll', reset);
      document.removeEventListener('keydown', reset);
      media.removeEventListener('change', reset);
      reduce.removeEventListener('change', reset);
    };
  }, []);
  return active;
}

/** Pointer-only affordance; native anchors retain keyboard and touch behavior. */
export function ProjectCursor() {
  const { localize } = usePreferences();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const hide = () => {
      cancelAnimationFrame(frame);
      ref.current?.classList.remove('is-visible');
      document.documentElement.classList.remove('project-cursor-active');
    };
    const sync = () => {
      hide();
      document.documentElement.classList.toggle(
        'project-cursor-enabled',
        fine.matches && !reduced.matches,
      );
    };
    const move = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || event.pointerType !== 'mouse') {
        hide();
        return;
      }
      const card = event.target instanceof Element ? event.target.closest('a.project-card') : null;
      if (!card) {
        hide();
        return;
      }
      const x = event.clientX,
        y = event.clientY;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${x}px,${y}px,0)`;
          ref.current.classList.add('is-visible');
          document.documentElement.classList.add('project-cursor-active');
        }
      });
    };
    sync();
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hide);
    document.addEventListener('keydown', hide);
    window.addEventListener('scroll', hide, { passive: true });
    window.addEventListener('blur', hide);
    fine.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      hide();
      document.documentElement.classList.remove('project-cursor-enabled');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      document.removeEventListener('keydown', hide);
      window.removeEventListener('scroll', hide);
      window.removeEventListener('blur', hide);
      fine.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);
  return localize(
    <div ref={ref} className="project-cursor" aria-hidden="true">
      <span>
        Voir <b>↗</b>
      </span>
    </div>,
  );
}
