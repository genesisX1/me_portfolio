'use client';

import { useEffect, useState } from 'react';
import { usePreferences } from './Preferences';

const VISIT_KEY = 'portfolio-intro-completed-v1';
const TIMINGS = {
  full: { minimum: 1500, imageTimeout: 4000, exit: 750 },
  short: { minimum: 180, imageTimeout: 1200, exit: 400 },
};

function hasCompletedIntro() {
  try {
    return window.localStorage.getItem(VISIT_KEY) === '1';
  } catch {
    return false;
  }
}

function rememberCompletedIntro() {
  try {
    window.localStorage.setItem(VISIT_KEY, '1');
  } catch {
    // Storage is optional: an unavailable preference must never block the page.
  }
}

export function Intro({ onReady }: { onReady: (ready: boolean) => void }) {
  const { localize } = usePreferences();
  const [phase, setPhase] = useState<'boot' | 'loading' | 'leaving' | 'done'>('boot');
  const [short, setShort] = useState(false);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let cancelled = false;
    let finished = false;
    const timers: number[] = [];
    const cleanups: (() => void)[] = [];

    const finish = (remember = false) => {
      if (cancelled || finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      if (remember) rememberCompletedIntro();
      setPhase('done');
      onReady(true);
    };

    if (reduced.matches) {
      finish();
      return;
    }

    const returning = hasCompletedIntro();
    const timing = TIMINGS[returning ? 'short' : 'full'];
    setShort(returning);
    setPhase('loading');

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    // Only the initially visible portrait can hold the introduction. The second
    // portrait has its own readiness guard and must not delay entry on mobile.
    const image = document.querySelector<HTMLImageElement>('.portrait-dev');
    const portrait = new Promise<void>((resolve) => {
      if (!image) return resolve();
      const loaded = () => {
        if (image.decode)
          image
            .decode()
            .catch(() => {})
            .then(resolve);
        else resolve();
      };
      if (image.complete) return loaded();
      image.addEventListener('load', loaded, { once: true });
      image.addEventListener('error', loaded, { once: true });
      cleanups.push(() => {
        image.removeEventListener('load', loaded);
        image.removeEventListener('error', loaded);
      });
    });

    Promise.all([delay(timing.minimum), Promise.race([portrait, delay(timing.imageTimeout)])]).then(
      () => {
        if (cancelled || finished || reduced.matches) return;
        setPhase('leaving');
        onReady(true);
        timers.push(window.setTimeout(() => finish(!returning), timing.exit));
      },
    );

    const change = () => {
      if (reduced.matches) finish();
    };
    reduced.addEventListener('change', change);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      cleanups.forEach((cleanup) => cleanup());
      reduced.removeEventListener('change', change);
    };
  }, [onReady]);

  return localize(
    <div className={`intro-cover intro-${phase}${short ? ' intro-short' : ''}`} aria-hidden="true">
      <span className="intro-greeting">Bonjour.</span>
      <div className="intro-panel intro-left">
        <span className="intro-code">
          CODE <b>&lt;/&gt;</b>
        </span>
      </div>
      <div className="intro-panel intro-right">
        <span className="intro-design">
          DESIGN <b>✳</b>
        </span>
      </div>
      <div className="intro-progress">
        <span>JOACKIM DATE</span>
        <i>
          <b />
        </i>
        <span>CODE + DESIGN</span>
      </div>
    </div>,
  );
}
