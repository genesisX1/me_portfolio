'use client';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createCodefi } from '@/lib/codefi.mjs';
type Engine = ReturnType<typeof createCodefi>;
const AudioState = createContext({
  playing: false,
  busy: false,
  failed: false,
  volume: 18,
  toggle: () => {},
  setVolume: (_value: number) => {},
});
export function AmbientAudioProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState(false),
    [busy, setBusy] = useState(false),
    [failed, setFailed] = useState(false),
    [volume, setVolumeState] = useState(18);
  const engine = useRef<Engine | null>(null),
    locked = useRef(false),
    disposed = useRef(false);
  const pause = async () => {
    const current = engine.current;
    engine.current = null;
    setPlaying(false);
    await current?.stop().catch(() => {});
  };
  useEffect(() => {
    disposed.current = false;
    const hide = () => {
      if (document.hidden) void pause();
    };
    document.addEventListener('visibilitychange', hide);
    window.addEventListener('pagehide', hide);
    return () => {
      disposed.current = true;
      document.removeEventListener('visibilitychange', hide);
      window.removeEventListener('pagehide', hide);
      void engine.current?.stop().catch(() => {});
      engine.current = null;
    };
  }, []);
  const toggle = async () => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setFailed(false);
    try {
      if (engine.current) {
        await pause();
        return;
      }
      const Context =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Context) throw new Error('Audio unavailable');
      const next = createCodefi(Context);
      engine.current = next;
      next.setVolume(volume / 100);
      await next.start();
      if (disposed.current || document.hidden || engine.current !== next) {
        await next.stop();
        if (engine.current === next) engine.current = null;
        return;
      }
      setPlaying(true);
    } catch {
      await pause();
      if (!disposed.current) setFailed(true);
    } finally {
      locked.current = false;
      if (!disposed.current) setBusy(false);
    }
  };
  const setVolume = (value: number) => {
    const safe = Math.min(50, Math.max(0, value));
    setVolumeState(safe);
    engine.current?.setVolume(safe / 100);
  };
  return (
    <AudioState.Provider value={{ playing, busy, failed, volume, toggle, setVolume }}>
      {children}
    </AudioState.Provider>
  );
}
export function AmbientAudioControl({
  language,
  tabIndex = 0,
}: {
  language: 'fr' | 'en';
  tabIndex?: number;
}) {
  const { playing, busy, failed, volume, toggle, setVolume } = useContext(AudioState),
    id = useId();
  const en = language === 'en',
    label = failed
      ? en
        ? 'Audio unavailable — retry'
        : 'Son indisponible — réessayer'
      : playing
        ? en
          ? 'Pause code-fi ambience'
          : 'Couper l’ambiance code-fi'
        : en
          ? 'Play code-fi ambience'
          : 'Activer l’ambiance code-fi';
  return (
    <div className={`audio-control ${playing ? 'audio-playing' : ''}`}>
      <button
        type="button"
        className="audio-toggle"
        aria-label={label}
        title={label}
        aria-pressed={playing}
        disabled={busy}
        tabIndex={tabIndex}
        onClick={toggle}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {playing ? (
            <>
              <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
            </>
          ) : (
            <path d="m16 9 5 6m0-6-5 6" />
          )}
        </svg>
      </button>
      <div className="audio-panel">
        <span>
          CODE-FI <small>{en ? 'Original ambience' : 'Ambiance originale'}</small>
        </span>
        <label htmlFor={id}>
          {en ? 'Volume' : 'Volume'} <b>{volume}%</b>
        </label>
        <input
          id={id}
          type="range"
          min="0"
          max="50"
          value={volume}
          tabIndex={tabIndex}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label={en ? 'Ambience volume' : 'Volume de l’ambiance'}
        />
        <p>{en ? 'Soft keys · 72 BPM' : 'Clavier doux · 72 BPM'}</p>
        {failed && (
          <p role="status">
            {en ? 'Your browser cannot play audio.' : 'Le navigateur ne peut pas lire le son.'}
          </p>
        )}
      </div>
    </div>
  );
}
