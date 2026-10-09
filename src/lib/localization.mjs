import translations from '../data/translations.json' with { type: 'json' };
export function translate(text, language = 'fr') {
  if (language === 'fr' || typeof text !== 'string') return text;
  const key = text.trim();
  if (translations[key]) return text.replace(key, translations[key]);
  if (key.startsWith('Voir le projet ') && key.endsWith(' — nouvel onglet'))
    return `View project ${key.replace(/^Voir le projet /, '').replace(/ — nouvel onglet$/, '')} — new tab`;
  if (key.startsWith('Aperçu du projet '))
    return key.replace('Aperçu du projet ', 'Preview of project ');
  if (key.endsWith(' — lien à renseigner'))
    return key.replace(' — lien à renseigner', ' — link to be added');
  if (key.startsWith('Erreur : ')) return key.replace('Erreur : ', 'Error: ');
  return text;
}
/** @template T @param {T[]} exercises @param {string} language @returns {T[]} */
export function localizedExercises(exercises, language = 'fr') {
  if (language === 'fr') return exercises;
  const entries = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  const replace = (value) => entries.reduce((s, [fr, en]) => s.split(fr).join(en), value);
  return exercises.map((exercise) => ({
    ...exercise,
    title: translate(exercise.title, language),
    level: translate(exercise.level, language),
    brief: translate(exercise.brief, language),
    hint: translate(exercise.hint, language),
    html: replace(exercise.html),
    js: replace(exercise.js),
    test: replace(exercise.test),
  }));
}
