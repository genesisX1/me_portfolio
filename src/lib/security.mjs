export const briefServices = [
  'Site ou application',
  'Identité visuelle',
  'Affiche ou campagne',
  'Code et design',
  'Autre projet',
];
export const bookingServices = [
  'Site ou application',
  'Identité visuelle',
  'Interfaces & expérience',
  'Communication visuelle',
  'Autre projet',
];
const controls = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;
export function validEmail(value) {
  return (
    typeof value === 'string' &&
    value.length <= 180 &&
    !/[\s\u0000-\u001f\u007f?&#]/.test(value) &&
    /^[^@]+@[^@]+\.[^@]+$/.test(value)
  );
}
export function validateRequest(fields, services, messageLimit = 6000) {
  const clean = { name: '', email: '', service: '', message: '' };
  for (const key of ['name', 'email', 'service', 'message']) {
    if (typeof fields?.[key] !== 'string' || controls.test(fields[key]))
      throw Error('Certains caractères ne sont pas autorisés.');
    clean[key] = fields[key].trim();
  }
  if (!clean.name || clean.name.length > 120 || /[\r\n]/.test(clean.name))
    throw Error('Indiquez un nom valide (120 caractères maximum).');
  if (!validEmail(clean.email)) throw Error('Indiquez une adresse email valide.');
  if (!services.includes(clean.service)) throw Error('Choisissez un sujet proposé dans la liste.');
  if (clean.message.length < 10 || clean.message.length > messageLimit)
    throw Error(`Votre message doit contenir de 10 à ${messageLimit} caractères.`);
  return clean;
}
