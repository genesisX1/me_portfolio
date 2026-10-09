import { usePreferences } from '../Preferences';
import type { useCodeChallenge } from './useCodeChallenge';
const runnerSource = '/challenge-runner.html';
type Controller = ReturnType<typeof useCodeChallenge>;
export default function ChallengeWorkspace({ controller }: { controller: Controller }) {
  const { localize } = usePreferences();
  const {
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
    frame,
    token,
    testing,
    exercises,
    exercise,
    initialCode,
    run,
    advance,
    solved,
  } = controller;
  return localize(
    <>
      <div className="game-progress">
        <ol aria-label="Progression des missions">
          {exercises.map((e, i) => (
            <li
              key={e.title}
              className={i === index ? 'current' : i < index ? 'done' : ''}
              aria-current={i === index ? 'step' : undefined}
            >
              <span>{i < index ? (scores[i] > 0 ? '✓' : '–') : i + 1}</span>
              <b>{e.title}</b>
            </li>
          ))}
        </ol>
        <span className="game-clock">
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')} <b>{scores.reduce((a, b) => a + b, 0)} pts</b>
        </span>
      </div>
      <div className="game-brief">
        <span className="eyebrow">
          MISSION 0{index + 1} / {exercise.level}
        </span>
        <h2>{exercise.title}</h2>
        <p>{exercise.brief}</p>
      </div>
      <div className="game-workspace">
        <div className="game-editor">
          <div className="game-tabs" role="group" aria-label="Langage du code">
            {(['html', 'css', 'js'] as const).map((t) => (
              <button
                key={t}
                aria-pressed={tab === t}
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {t === 'js' ? 'JavaScript' : t.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="code-input">
            <pre aria-hidden="true">
              {code[tab]
                .split('\n')
                .map((_, i) => i + 1)
                .join('\n')}
            </pre>
            <textarea
              aria-label={`Code ${tab === 'js' ? 'JavaScript' : tab.toUpperCase()}`}
              spellCheck={false}
              maxLength={64000}
              value={code[tab]}
              onChange={(e) => {
                setCode({ ...code, [tab]: e.target.value });
                setResults([]);
                testing.current = false;
              }}
            />
          </div>
          <div className="editor-actions">
            <button
              onClick={() => {
                setCode(initialCode(index));
                setResults([]);
                run(initialCode(index));
              }}
            >
              Réinitialiser ↻
            </button>
            <button onClick={() => setHint(true)}>Un indice ?</button>
            <button
              className="run-preview"
              onClick={() => {
                setView('preview');
                run();
              }}
            >
              Exécuter ↗
            </button>
          </div>
          {hint && (
            <p className="game-hint" role="status">
              {exercise.hint}
              <small>Mission limitée à 75 points.</small>
            </p>
          )}
        </div>
        <div className="game-output">
          <div className="game-tabs" role="group" aria-label="Vue du résultat">
            <button
              className={view === 'preview' ? 'active' : ''}
              aria-pressed={view === 'preview'}
              onClick={() => setView('preview')}
            >
              Aperçu
            </button>
            <button
              className={view === 'tests' ? 'active' : ''}
              aria-pressed={view === 'tests'}
              onClick={() => setView('tests')}
            >
              Tests{' '}
              {results.length ? `${results.filter((r) => r.pass).length}/${results.length}` : ''}
            </button>
          </div>
          <iframe
            key={preview}
            ref={frame}
            title="Aperçu isolé de votre code"
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            src={preview ? `${runnerSource}#${token.current}` : undefined}
            onLoad={() => {
              if (preview && token.current)
                frame.current?.contentWindow?.postMessage(
                  { type: 'challenge-run', token: token.current, document: preview },
                  '*',
                );
            }}
            className={view === 'preview' ? '' : 'preview-hidden'}
          />
          {view === 'tests' && (
            <div className="game-tests" aria-live="polite">
              {busy ? (
                <p>Tests en cours…</p>
              ) : results.length ? (
                results.map((r, i) => (
                  <p key={i} className={r.pass ? 'pass' : 'fail'}>
                    <span>{r.pass ? '✓' : '×'}</span>
                    {r.label}
                  </p>
                ))
              ) : (
                <p>Cliquez sur « Vérifier » pour lancer les tests.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="game-controls">
        <span role="status">
          {solved
            ? 'Bien joué. Tous les tests passent.'
            : busy
              ? 'Exécution en cours…'
              : 'Modifiez le code, puis vérifiez votre solution.'}
        </span>
        <div>
          <button className="pill game-secondary" onClick={advance} disabled={busy}>
            {solved
              ? index === 5
                ? 'Voir mon résultat ↗'
                : 'Mission suivante ↗'
              : 'Passer la mission →'}
          </button>
          <button className="pill game-primary" disabled={busy} onClick={() => run(code, true)}>
            Vérifier ✓
          </button>
        </div>
      </div>
    </>,
  );
}
