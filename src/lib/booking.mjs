import { translate } from './localization.mjs';
import { validEmail } from './security.mjs';
export const bookingSettings = {
  timezone: 'Africa/Lome',
  duration: 30,
  horizonMonths: 6,
  weekdays: [1, 2, 3, 4, 5, 6],
  times: [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ],
};
export function dateKey(date) {
  return date.toISOString().slice(0, 10);
}
export function monthDays(month) {
  const [year, m] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, m - 1, 1));
  return {
    offset: (first.getUTCDay() + 6) % 7,
    days: Array.from(
      { length: new Date(Date.UTC(year, m, 0)).getUTCDate() },
      (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`,
    ),
  };
}
export function shiftMonth(month, delta) {
  const [year, m] = month.split('-').map(Number);
  return dateKey(new Date(Date.UTC(year, m - 1 + delta, 1))).slice(0, 7);
}
export function proposedTimes(day, now = new Date(), settings = bookingSettings) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return [];
  const date = new Date(`${day}T00:00:00Z`);
  if (
    !Number.isFinite(date.getTime()) ||
    dateKey(date) !== day ||
    !settings.weekdays.includes(date.getUTCDay())
  )
    return [];
  const max = shiftMonth(dateKey(now).slice(0, 7), settings.horizonMonths);
  if (day.slice(0, 7) > max) return [];
  return settings.times.filter((time) => new Date(`${day}T${time}:00Z`).getTime() > now.getTime());
}
export function formatDay(day, language = 'fr') {
  return new Intl.DateTimeFormat(language === 'en' ? 'en-GB' : 'fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Africa/Lome',
  }).format(new Date(`${day}T12:00:00Z`));
}
export function bookingMessage({ day, time, name, email, service, message }, language = 'fr') {
  if (language === 'en')
    return `APPOINTMENT REQUEST — JOACKIM DATE\n\nSuggested time: ${formatDay(day, language)} at ${time}\nTimezone: Africa/Lome (UTC+0)\nDuration: 30 minutes\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nSubject: ${translate(service, language)}\n\n${message.trim()}\n\nAwaiting confirmation from Joackim. This time slot is not reserved.\n`;
  return `DEMANDE DE RENDEZ-VOUS — JOACKIM DATE\n\nCréneau proposé : ${formatDay(day)} à ${time}\nFuseau : Africa/Lome (UTC+0)\nDurée : 30 minutes\n\nNom : ${name.trim()}\nEmail : ${email.trim()}\nSujet : ${service}\n\n${message.trim()}\n\nDemande à confirmer par Joackim. Ce créneau n’est pas réservé.\n`;
}
export function requestMailto(recipient, fields, language = 'fr') {
  if (!validEmail(recipient)) throw Error('Adresse de contact invalide.');
  return `mailto:${recipient}?subject=${encodeURIComponent(language === 'en' ? 'Appointment request — ' + formatDay(fields.day, language) + ' at ' + fields.time : 'Demande de rendez-vous — ' + formatDay(fields.day) + ' à ' + fields.time)}&body=${encodeURIComponent(bookingMessage(fields, language))}`;
}
const escapeICS = (value) =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
export function tentativeCalendar({ day, time, service }, now = new Date(), language = 'fr') {
  const start = new Date(`${day}T${time}:00Z`),
    end = new Date(start.getTime() + bookingSettings.duration * 60000);
  const stamp = (date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Joackim DATE//Portfolio//FR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${now.getTime()}@joackim-portfolio`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    'STATUS:TENTATIVE',
    'TRANSP:TRANSPARENT',
    `SUMMARY:${escapeICS(language === 'en' ? 'Appointment awaiting confirmation — ' + translate(service, language) : 'RDV à confirmer — ' + service)}`,
    language === 'en'
      ? 'DESCRIPTION:Suggestion only. Wait for confirmation from Joackim before treating this appointment as reserved.'
      : 'DESCRIPTION:Proposition uniquement. Attendre la confirmation de Joackim avant de considérer ce rendez-vous comme réservé.',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return (
    lines
      .map((line) => {
        let out = '',
          length = 0;
        for (const char of line) {
          const bytes = new TextEncoder().encode(char).length;
          if (length + bytes > 74) {
            out += '\r\n ';
            length = 1;
          }
          out += char;
          length += bytes;
        }
        return out;
      })
      .join('\r\n') + '\r\n'
  );
}
