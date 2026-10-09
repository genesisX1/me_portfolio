'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePreferences } from '../Preferences';
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`arrow ${className}`}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19 19 5M5 5h14v14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      j<span>↗</span>
    </span>
  );
}
export function Reveal({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left';
}) {
  const reduce = useReducedMotion();
  const [entered, setEntered] = useState(false);
  return (
    <motion.div
      className={`reveal ${entered ? 'is-revealed' : ''} ${className}`}
      onViewportEnter={() => setEntered(true)}
      initial={
        reduce ? false : { opacity: 0, y: from === 'bottom' ? 28 : 0, x: from === 'left' ? -24 : 0 }
      }
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: reduce ? 0 : 0.68,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}) {
  const { localize } = usePreferences();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d?.open) {
      d?.showModal();
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        d?.close();
        document.body.style.overflow = prev;
      };
    }
  }, [open]);
  return localize(
    <dialog
      ref={ref}
      className="modal"
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <button className="close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        {children}
      </div>
    </dialog>,
  );
}
