'use client';
import { usePreferences } from './Preferences';
import { MotionTitle, MotionCopy } from './MotionTitle';
import { useCodeChallenge } from './challenge/useCodeChallenge';
import ChallengeIntro from './challenge/ChallengeIntro';
import ChallengeResult from './challenge/ChallengeResult';
import ChallengeWorkspace from './challenge/ChallengeWorkspace';
export default function CodeChallenge() {
  const { localize, language } = usePreferences();
  const controller = useCodeChallenge(language);
  const { phase, setPhase, setOpen, dialog, close } = controller;
  return localize(
    <>
      <section id="challenge" className="challenge panel section-pad">
        <div className="challenge-top">
          <span className="eyebrow">/LE DÉFI · CODE & DESIGN</span>
          <span className="challenge-time">6 missions · À votre rythme</span>
        </div>
        <MotionTitle
          className="challenge-title"
          lines={[
            'LE SENS',
            <>
              DU <em>DÉTAIL.</em>
            </>,
          ]}
        />
        <span className="challenge-orbit" aria-hidden="true">
          ✳
        </span>
        <div className="challenge-bottom">
          <MotionCopy
            delay={0.12}
            text="Un menu capricieux. Une interface à réparer. Une logique à retrouver. Entrez dans l’atelier et faites fonctionner les détails."
          />
          <button
            className="pill light"
            onClick={() => {
              setPhase('intro');
              setOpen(true);
            }}
          >
            Relever le défi ↗
          </button>
        </div>
        <div className="challenge-levels">
          <span>
            <i>01</i>Observer
          </span>
          <span>
            <i>02</i>Réparer
          </span>
          <span>
            <i>03</i>Tester
          </span>
        </div>
        <div className="challenge-ghost" aria-hidden="true">
          &gt; interface.repair()
          <br />[ ] chaque détail compte
          <br />
          &gt; code + design = expérience
        </div>
      </section>
      <dialog
        ref={dialog}
        className="code-game"
        aria-label="Atelier code et design"
        onCancel={close}
      >
        <div className="game-shell">
          <header className="game-header">
            <span>
              JOACKIM DATE <b>/ L’ATELIER</b>
            </span>
            <button className="game-close" onClick={close} aria-label="Fermer le défi">
              Fermer ×
            </button>
          </header>
          {phase === 'intro' ? (
            <ChallengeIntro controller={controller} />
          ) : phase === 'result' ? (
            <ChallengeResult controller={controller} />
          ) : (
            <ChallengeWorkspace controller={controller} />
          )}
        </div>
      </dialog>
    </>,
  );
}
