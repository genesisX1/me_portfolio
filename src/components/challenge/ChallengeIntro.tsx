import { usePreferences } from '../Preferences';
import type { useCodeChallenge } from './useCodeChallenge';
type Controller = ReturnType<typeof useCodeChallenge>;
export default function ChallengeIntro({ controller }: { controller: Controller }) {
  const { localize } = usePreferences();
  const { exercises, launch } = controller;
  return localize(
    <div className="game-intro">
      <span className="eyebrow">À VOUS DE JOUER</span>
      <h2>
        Les détails font
        <br />
        <em>la différence.</em>
      </h2>
      <p>
        Six petits bugs, du code à modifier et un aperçu réel. Corrigez, testez et avancez à votre
        rythme. Un indice réduit le score de la mission à 75 points.
      </p>
      <div className="mission-grid">
        {exercises.map((e, i) => (
          <article key={e.title}>
            <span>0{i + 1} ↗</span>
            <h3>{e.title}</h3>
            <small>{e.level}</small>
          </article>
        ))}
      </div>
      <button className="pill game-primary" onClick={launch}>
        Lancer le défi ↗
      </button>
      <span className="game-local-note">Score local à cette partie · Aucun compte nécessaire</span>
    </div>,
  );
}
