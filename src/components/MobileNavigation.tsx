'use client';
import { usePreferences, PreferenceControls } from './Preferences';
import { useEffect, useRef } from 'react';
export default function MobileNavigation({
  open,
  onClose,
  links,
  active,
}: {
  open: boolean;
  onClose: () => void;
  links: string[][];
  active: string;
}) {
  const { localize } = usePreferences();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector<HTMLAnchorElement>('a')?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      requestAnimationFrame(() => {
        const target =
          opener?.isConnected && opener.matches('[aria-controls="mobile-menu"]')
            ? opener
            : document.querySelector<HTMLElement>('.menu-button');
        target?.focus({ preventScroll: true });
      });
    };
  }, [open]);
  return localize(
    <dialog
      id="mobile-menu"
      ref={ref}
      className="mobile-drawer"
      aria-label="Navigation mobile"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="drawer-inner">
        <div className="drawer-heading">
          <span className="eyebrow">JOACKIM DATE / EXPLORER</span>
          <button aria-label="Fermer le menu" onClick={onClose}>
            ×
          </button>
        </div>
        <nav className="drawer-nav" aria-label="Toutes les sections">
          {[...links, ['Rendez-vous', '#booking']].map(([name, href], i) => (
            <a
              key={href}
              href={href}
              aria-current={active === href.slice(1) ? 'location' : undefined}
              onClick={onClose}
            >
              <span>0{i + 1}</span>
              {name}
              <b aria-hidden="true">↗</b>
            </a>
          ))}
        </nav>
        <PreferenceControls />
        <p>Développeur & designer · Lomé, Togo</p>
      </div>
    </dialog>,
  );
}
