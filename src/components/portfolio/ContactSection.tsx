'use client';
import { useState, type FormEvent } from 'react';
import { usePreferences } from '../Preferences';
import { MotionTitle, MotionCopy } from '../MotionTitle';
import { SocialLink } from '../MotionDetails';
import OptimizedImage from '../OptimizedImage';
import { profile } from '@/data/portfolio';
import { validateRequest, briefServices } from '@/lib/security.mjs';
import { makeBrief } from '@/lib/interaction.mjs';
import { Arrow, Reveal, Modal } from './UI';
export default function ContactSection() {
  const { localize, t, language } = usePreferences();
  const [contact, setContact] = useState(false),
    [downloaded, setDownloaded] = useState(false),
    [preparedMail, setPreparedMail] = useState(''),
    [briefError, setBriefError] = useState('');
  function submitBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let fields;
    try {
      fields = validateRequest(Object.fromEntries(data), briefServices);
      setBriefError('');
    } catch (error) {
      setPreparedMail('');
      setBriefError(
        error instanceof Error ? error.message : 'Vérifiez les informations du formulaire.',
      );
      return;
    }
    const brief = makeBrief(fields, language);
    if (profile.email) {
      setPreparedMail(
        `mailto:${profile.email}?subject=${encodeURIComponent((language === 'en' ? 'Let’s talk about your project — ' : 'Parlons de votre projet — ') + t(fields.service))}&body=${encodeURIComponent(brief)}`,
      );
      return;
    }
    const url = URL.createObjectURL(new Blob([brief], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mon-brief-projet.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }
  return localize(
    <>
      <section id="contact" className="contact panel section-pad">
        <Reveal>
          <div className="contact-top">
            <span className="availability">
              <i />
              Une idée à construire ensemble ?
            </span>
            <span className="mono">CODE + DESIGN</span>
          </div>
          <MotionTitle
            className="contact-title"
            lines={[
              <>
                UN PROJET EN <em>TÊTE ?</em>
              </>,
            ]}
          />
          <div className="contact-bottom">
            <MotionCopy
              delay={0.16}
              text="Un site, une identité, une expérience. Parlons de ce que vous avez en tête."
            />
            <div>
              <a className="pill dark" href={`mailto:${profile.email}`}>
                Me contacter <Arrow />
              </a>
              <a className="pill light" href="#booking">
                Réserver un appel <Arrow />
              </a>
              <button
                className="text-link contact-brief"
                onClick={() => {
                  setDownloaded(false);
                  setPreparedMail('');
                  setContact(true);
                }}
              >
                Préparer mon projet
              </button>
            </div>
          </div>
          <div className="contact-signature">
            <a href="#top" className="wordmark">
              <OptimizedImage
                sizes="48px"
                className="signature-portrait"
                src="/images/developer.png"
                alt=""
                width="48"
                height="48"
                loading="lazy"
              />
              {profile.firstName} {profile.lastName}
              <span>®</span>
            </a>
            <span>DÉVELOPPEUR & DESIGNER</span>
            <div className="contact-socials">
              <SocialLink name="GitHub" url={profile.github} />
              <SocialLink name="LinkedIn" url={profile.linkedin} />
            </div>
          </div>
        </Reveal>
      </section>
      <Modal open={contact} onClose={() => setContact(false)} label="Préparer votre projet">
        <span className="eyebrow">FAISONS LE PREMIER PAS</span>
        <h2>
          Votre idée,
          <br />
          on en parle ?
        </h2>
        <p className="form-intro">
          {profile.email
            ? 'Préparez votre message : il s’ouvrira dans votre messagerie.'
            : 'Les coordonnées de contact seront ajoutées prochainement. Vous pouvez déjà préparer votre brief et le télécharger ; aucune donnée n’est envoyée.'}
        </p>
        <form
          onSubmit={submitBrief}
          onChange={() => {
            setPreparedMail('');
            setBriefError('');
          }}
        >
          <div className="form-row">
            <label>
              Votre nom
              <input
                required
                name="name"
                autoComplete="name"
                placeholder="Comment vous appelez-vous ?"
                maxLength={120}
              />
            </label>
            <label>
              Votre email
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                maxLength={180}
              />
            </label>
          </div>
          <label>
            Votre besoin
            <select name="service" defaultValue="Site ou application">
              <option>Site ou application</option>
              <option>Identité visuelle</option>
              <option>Affiche ou campagne</option>
              <option>Code et design</option>
              <option>Autre projet</option>
            </select>
          </label>
          <label>
            Quelques mots sur votre projet
            <textarea
              required
              name="message"
              placeholder="L’idée, vos objectifs, vos délais…"
              rows={4}
              minLength={10}
              maxLength={6000}
            />
          </label>
          <button className="pill dark" type="submit">
            {profile.email ? 'Préparer mon message' : 'Télécharger mon brief'}
            <Arrow />
          </button>
          {preparedMail && (
            <a className="pill light prepared-mail" href={preparedMail}>
              Ouvrir ma messagerie <Arrow />
            </a>
          )}
          <p className="form-notice" role="status">
            {briefError ||
              (preparedMail
                ? 'Votre message est prêt. Ouvrez votre messagerie puis envoyez-le.'
                : downloaded
                  ? 'Votre brief a été téléchargé. Il n’a pas été envoyé.'
                  : 'Vos informations restent dans ce formulaire jusqu’à votre action.')}
          </p>
        </form>
      </Modal>
    </>,
  );
}
