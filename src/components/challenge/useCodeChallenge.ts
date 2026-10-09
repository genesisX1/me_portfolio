'use client';
import { useEffect, useRef, useState } from 'react';
import {
  exercises as originalExercises,
  challengeDocument,
  challengeScore,
  validChallengeMessage,
} from '@/lib/codeChallenge.mjs';
import { localizedExercises } from '@/lib/localization.mjs';
import type { Language } from '../Preferences';
export type Code = { html: string; css: string; js: string };
type Result = { label: string; pass: boolean };
const initial = (index: number): Code => ({
  html: originalExercises[index].html,
  css: originalExercises[index].css,
  js: originalExercises[index].js,
});
export function useCodeChallenge(language: Language) {
  const [open, setOpen] = useState(false),
    [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro'),
    [index, setIndex] = useState(0),
    [code, setCode] = useState<Code>(initial(0)),
    [tab, setTab] = useState<keyof Code>('js'),
    [view, setView] = useState<'preview' | 'tests'>('preview'),
    [results, setResults] = useState<Result[]>([]),
    [hint, setHint] = useState(false),
    [seconds, setSeconds] = useState(0),
    [scores, setScores] = useState<number[]>([]),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState('');
  const dialog = useRef<HTMLDialogElement>(null),
    frame = useRef<HTMLIFrameElement>(null),
    token = useRef(''),
    timer = useRef<ReturnType<typeof setTimeout> | null>(null),
    started = useRef(0),
    testing = useRef(false);
  const exercises = localizedExercises(originalExercises, language);
  const exercise = exercises[index];
  const initialCode = (item: number): Code => ({
    html: exercises[item].html,
    css: exercises[item].css,
    js: exercises[item].js,
  });
  useEffect(() => {
    if (!open) return;
    const d = dialog.current;
    d?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      d?.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);
  useEffect(() => {
    if (!open || phase !== 'playing') return;
    const interval = setInterval(
      () => setSeconds(Math.floor((Date.now() - started.current) / 1000)),
      1000,
    );
    return () => clearInterval(interval);
  }, [open, phase]);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (
        event.origin !== 'null' ||
        event.source !== frame.current?.contentWindow ||
        !validChallengeMessage(event.data, token.current)
      )
        return;
      setResults(event.data.results);
      setBusy(false);
      if (timer.current) clearTimeout(timer.current);
      if (testing.current) setView('tests');
    };
    window.addEventListener('message', receive);
    return () => {
      window.removeEventListener('message', receive);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function run(value = code, verify = false, item = index) {
    if (Object.values(value).some((part) => part.length > 64000)) {
      setResults([{ label: 'Limite : 64 000 caractères par langage.', pass: false }]);
      setView('tests');
      setBusy(false);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    token.current = crypto.randomUUID();
    testing.current = verify;
    setView('preview');
    setResults([]);
    setBusy(true);
    setPreview(challengeDocument(exercises[item], value, token.current, verify, language));
    timer.current = setTimeout(() => {
      setBusy(false);
      setResults([
        { label: 'Le code ne répond pas. Vérifiez vos boucles puis relancez.', pass: false },
      ]);
      setView('tests');
      setPreview('');
    }, 5000);
  }
  function launch() {
    started.current = Date.now();
    setSeconds(0);
    setScores([]);
    setIndex(0);
    setCode(initialCode(0));
    setTab('js');
    setHint(false);
    setPhase('playing');
    setView('preview');
    run(initialCode(0), false, 0);
  }
  function advance() {
    const next = [...scores, testing.current ? challengeScore(results, hint) : 0];
    setScores(next);
    if (index === exercises.length - 1) {
      setPhase('result');
      setPreview('');
      if (timer.current) clearTimeout(timer.current);
      return;
    }
    const n = index + 1;
    setIndex(n);
    setCode(initialCode(n));
    setTab(n === 1 ? 'css' : 'js');
    setHint(false);
    setView('preview');
    run(initialCode(n), false, n);
  }
  function close() {
    token.current = '';
    testing.current = false;
    setOpen(false);
    setPreview('');
    setBusy(false);
    if (timer.current) clearTimeout(timer.current);
  }
  const solved = !busy && testing.current && results.length > 0 && results.every((r) => r.pass);

  return {
    open,
    setOpen,
    phase,
    setPhase,
    index,
    code,
    setCode,
    tab,
    setTab,
    view,
    setView,
    results,
    setResults,
    hint,
    setHint,
    seconds,
    scores,
    busy,
    preview,
    dialog,
    frame,
    token,
    testing,
    exercises,
    exercise,
    initialCode,
    run,
    launch,
    advance,
    close,
    solved,
  };
}
