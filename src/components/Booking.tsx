'use client';
import {usePreferences} from './Preferences';
import {motion,useReducedMotion} from 'framer-motion';
import {profile} from '@/data/portfolio';
import {safeExternalUrl} from '@/lib/interaction.mjs';
import {MotionTitle,MotionCopy} from './MotionTitle';

export default function Booking(){
 const {localize}=usePreferences();
 const reduce=useReducedMotion();
 const href=safeExternalUrl(profile.bookingUrl);
 const reveal={initial:reduce?false:{opacity:0,y:22},whileInView:{opacity:1,y:0},viewport:{once:true,amount:.2},transition:{duration:reduce?0:.65,ease:[.22,1,.36,1] as [number,number,number,number]}};
 return localize(<section id="booking" className="booking panel section-pad" aria-labelledby="booking-title">
  <div className="booking-heading"><div><span className="eyebrow">PRENONS LE TEMPS D’ÉCHANGER</span><MotionTitle id="booking-title" lines={['/RENDEZ-VOUS']}/></div><span className="booking-duration">↗ 45 minutes · Sans engagement</span></div>
  <MotionCopy className="booking-intro" text="Un site, une application ou une identité visuelle ? Réservez un moment pour en parler ensemble."/>
  <div className="booking-notes"><span>Réservation via Google Agenda</span><span><i aria-hidden="true"/>Disponibilités en temps réel</span></div>
  <div className="booking-layout booking-connected">
   <motion.div className="booking-calendar booking-invitation" {...reveal}>
    <span className="eyebrow">UN PREMIER ÉCHANGE</span>
    <div className="booking-clock" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2"/><path d="M32 16v16l11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg><span>45<span>MIN</span></span></div>
    <h3>Votre idée. Notre prochain échange.</h3>
    <p>Choisissez votre créneau directement dans mon agenda.</p>
    {href?<a className="pill dark booking-link" href={href} target="_blank" rel="noopener noreferrer" aria-label="Réserver un rendez-vous — nouvel onglet">Réserver un rendez-vous <span className="arrow" aria-hidden="true">↗</span></a>:<a className="pill dark" href="#contact">Contactez-moi <span aria-hidden="true">↗</span></a>}
    <p className="booking-external-note">La page Google Agenda s’ouvre dans un nouvel onglet.</p>
   </motion.div>
   <motion.div className="booking-selection booking-guide" {...reveal}>
    <span className="eyebrow">COMMENT ÇA SE PASSE ?</span>
    <ol className="booking-steps">
     <li><span aria-hidden="true">01</span><div><h3>Choisissez un moment.</h3><p>Consultez les créneaux disponibles sur la page de réservation.</p></div></li>
     <li><span aria-hidden="true">02</span><div><h3>Faisons connaissance.</h3><p>Renseignez vos coordonnées, puis confirmez votre réservation sur Google Agenda.</p></div></li>
     <li><span aria-hidden="true">03</span><div><h3>Parlons de votre projet.</h3><p>Gardez les détails du rendez-vous envoyés par Google pour préparer notre échange.</p></div></li>
    </ol>
    <p className="booking-zone-note">Les horaires sont affichés selon le fuseau indiqué sur la page Google Agenda. Vérifiez-le avant de réserver.</p>
   </motion.div>
  </div>
 </section>);
}
