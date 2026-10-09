import { usePreferences } from '../Preferences';
import type { useCodeChallenge } from './useCodeChallenge';
type Controller = ReturnType<typeof useCodeChallenge>;
export default function ChallengeResult({ controller }: { controller: Controller }) {
  const { localize } = usePreferences();
  const { seconds, scores, exercises, launch, close } = controller;
  return localize(
    <div className="game-result">
      <span className="eyebrow">PARTIE TERMINÉE</span>
      <h2>
        {scores.reduce((a, b) => a + b, 0)}
        <small>/600</small>
      </h2>
      <h3>Chaque détail compte.</h3>
      <p>
        {scores.filter((s) => s > 0).length} mission(s) réussie(s) sur 6 ·{' '}
        {Math.floor(seconds / 60)} min {seconds % 60} s
      </p>
      <ol>
        {exercises.map((e, i) => (
          <li key={e.title}>
            <span>{e.title}</span>
            <b>{scores[i]} / 100</b>
          </li>
        ))}
      </ol>
      <div>
        <button className="pill game-primary" onClick={launch}>
          Rejouer ↗
        </button>
        <button className="pill game-secondary" onClick={close}>
          Retour au portfolio
        </button>
      </div>
    </div>,
  );
}
