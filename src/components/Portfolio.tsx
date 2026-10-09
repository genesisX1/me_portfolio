'use client';
import {usePreferences,PreferenceControls} from './Preferences';
import {useEffect,useRef,useState, type ReactNode, type FormEvent} from 'react';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {preparePortrait,portraitHit} from './portraitHit';
import PortraitEffects from './PortraitEffects';
import OptimizedImage from './OptimizedImage';
import {Intro, ProjectCursor, Marquee, SocialLink, usePortfolioMotion} from './MotionDetails';
import {profile, projects, services, experience, type Project} from '@/data/portfolio';
import Booking from './Booking';
import MobileNavigation from './MobileNavigation';
import CodeChallenge from './CodeChallenge';
import {MotionTitle,MotionCopy} from './MotionTitle';
import {validateRequest,briefServices} from '@/lib/security.mjs';
import {portraitMode, safeExternalUrl, makeBrief} from '@/lib/interaction.mjs';

function Arrow({className=''}:{className?:string}){return <svg className={`arrow ${className}`} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function Mark(){return <span className="mark" aria-hidden="true">j<span>↗</span></span>}
function Reveal({children,className='',delay=0,from='bottom'}:{children:ReactNode;className?:string;delay?:number;from?:'bottom'|'left'}){
 const reduce=useReducedMotion();const [entered,setEntered]=useState(false);return <motion.div className={`reveal ${entered?'is-revealed':''} ${className}`} onViewportEnter={()=>setEntered(true)} initial={reduce?false:{opacity:0,y:from==='bottom'?28:0,x:from==='left'?-24:0}} whileInView={{opacity:1,y:0,x:0}} viewport={{once:true,amount:.08}} transition={{duration:reduce?0:.68,delay:reduce?0:delay,ease:[.22,1,.36,1]}}>{children}</motion.div>
}
function Modal({open,onClose,label,children}:{open:boolean;onClose:()=>void;label:string;children:ReactNode}){
 const {localize}=usePreferences();
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;if(open&&!d?.open){d?.showModal();const prev=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d?.close();document.body.style.overflow=prev;};}},[open]);
 return localize(<dialog ref={ref} className="modal" aria-label={label} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div className="modal-inner"><button className="close" onClick={onClose} aria-label="Fermer">×</button>{children}</div></dialog>)
}
function ProjectArt({project}:{project:Project}){
 const {localize}=usePreferences();
 if(project.image)return <OptimizedImage sizes="(max-width: 760px) 90vw, 42vw" src={project.image} alt={project.imageAlt||`Aperçu du projet ${project.title}`} loading="lazy" decoding="async" width={project.imageWidth} height={project.imageHeight}/>;
 return localize(<div className={`project-art art-${project.id}`}><span className="art-caption">VISUEL À AJOUTER</span>{project.category==='Web'?<div className="browser-art"><div className="browser-bar"><i/><i/><i/><span>votre-projet</span></div><div className="browser-content"><div className="tiny-line"/><strong>{project.id==='web-01'?'Une idée.\nUn site.':'Simple.\nIntuitif.'}</strong><div className="wireframe"><span/><span/><span/></div><div className="fake-button">Votre prochaine réalisation ↗</div></div><div className="browser-orbit"/></div>:<div className="poster-art"><span>ATELIER / {project.id==='design-01'?'IDENTITÉ':'ÉDITION'}</span><strong>{project.id==='design-01'?'Aa':'&'}</strong><div className="poster-rule"/><span>COULEUR · FORME · ÉMOTION</span></div>}<span className="art-index">{project.id.endsWith('01')?'01':'02'} / {project.category.toUpperCase()}</span></div>)
}
export default function Portfolio(){
 const {localize,t,language}=usePreferences();
 const activeSection=usePortfolioMotion();
 const [introReady,setIntroReady]=useState(false);
 const [hovered,setHovered]=useState(false),[pinned,setPinned]=useState(false),[portraitReady,setPortraitReady]=useState(false);
 const [filter,setFilter]=useState('Tous');
 const [service,setService]=useState<number|null>(0),[mobileMenu,setMobileMenu]=useState(false),[sticky,setSticky]=useState(false);
 const [contact,setContact]=useState(false),[downloaded,setDownloaded]=useState(false),[preparedMail,setPreparedMail]=useState('');
 const [briefError,setBriefError]=useState('');
 const developerImage=useRef<HTMLImageElement>(null),designerImage=useRef<HTMLImageElement>(null);
 const hoverFrame=useRef(0),lastPointer=useRef<{x:number;y:number}|null>(null);
 useEffect(()=>{for(const image of [developerImage.current,designerImage.current])if(image?.complete)preparePortrait(image);return()=>cancelAnimationFrame(hoverFrame.current);},[]);
 useEffect(()=>{if(designerImage.current?.complete && designerImage.current.naturalWidth>0)setPortraitReady(true);},[]);
 const reduce=useReducedMotion();const mode=portraitReady?portraitMode(pinned,hovered):'dev';
 const design=mode==='design';
 const links=[['Projets','#work'],['Services','#services'],['Parcours','#experience'],['Le défi','#challenge'],['Contact','#contact']];
 const socials=[['Instagram',profile.instagram,'ig']].filter(([,url])=>safeExternalUrl(url));
 const visible=projects.filter(p=>filter==='Tous'||p.category===filter);
 useEffect(()=>{const onScroll=()=>setSticky(window.scrollY>window.innerHeight*.55);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);},[]);
 useEffect(()=>{if(!mobileMenu)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setMobileMenu(false);};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close);},[mobileMenu]);
 function hitPortrait(x:number,y:number){
  // Test the visually dominant image, including its current CSS transform.
  const dev=developerImage.current,designer=designerImage.current;
  const visible=designer&&Number(getComputedStyle(designer).opacity)>.5?designer:dev;
  return portraitHit(visible,x,y)||(hovered&&portraitHit(dev,x,y));
 }
 function movePortrait(e:React.PointerEvent<HTMLButtonElement>){
  if(e.pointerType!=='mouse')return;
  const x=e.clientX,y=e.clientY,stage=e.currentTarget;lastPointer.current={x,y};cancelAnimationFrame(hoverFrame.current);
  hoverFrame.current=requestAnimationFrame(()=>{const hit=hitPortrait(x,y);stage.style.cursor=hit?'pointer':'default';setHovered(hit);});
 }
 function leavePortrait(){lastPointer.current=null;cancelAnimationFrame(hoverFrame.current);setHovered(false);}
 function submitBrief(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);let fields;try{fields=validateRequest(Object.fromEntries(data),briefServices);setBriefError('');}catch(error){setPreparedMail('');setBriefError(error instanceof Error?error.message:'Vérifiez les informations du formulaire.');return;}const brief=makeBrief(fields,language);if(profile.email){setPreparedMail(`mailto:${profile.email}?subject=${encodeURIComponent((language==='en'?'Let’s talk about your project — ':'Parlons de votre projet — ')+t(fields.service))}&body=${encodeURIComponent(brief)}`);return;}const url=URL.createObjectURL(new Blob([brief],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='mon-brief-projet.txt';link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);setDownloaded(true);}
 return localize(<>
  <a href="#main" className="skip-link">Aller au contenu</a>
  <Intro onReady={setIntroReady}/>
  <ProjectCursor/>
  <div className="reading-progress" aria-hidden="true"><span/></div>
  <main id="main">
   <section id="top" className={`hero panel ${introReady?'intro-ready':''} ${design?'is-design':''}`} aria-label="Présentation de Joackim DATE">
    <header className="header"><a className="availability" href="#contact"><i/>{profile.availability}</a><nav aria-label="Navigation principale" className="desktop-nav">{links.map(([name,href],i)=><a key={href} href={href} className={`${i===3?'accent':''} ${activeSection===href.slice(1)?'nav-active':''}`} aria-current={activeSection===href.slice(1)?'location':undefined}>{name}{i===0||i===1?<sup>[{i===0?projects.length:services.length}]</sup>:null}</a>)}</nav><div className="header-actions"><a className="pill dark header-cta" href="#booking">Prenons rendez-vous <Arrow/></a><div className="site-preferences"><PreferenceControls compact/></div><button className="menu-button" aria-expanded={mobileMenu} aria-controls="mobile-menu" onClick={()=>setMobileMenu(!mobileMenu)}>{mobileMenu?'Fermer':'Menu'} <span>{mobileMenu?'×':'☰'}</span></button></div></header>

    <h1 className="hero-name"><span>{profile.firstName}</span><b>{profile.lastName}</b></h1>
    <div className="hero-intro"><span className="eyebrow">DEUX REGARDS. UNE MÊME EXIGENCE.</span><h2><span key={mode} className="changing-title">{design?profile.designerTitle:profile.developerTitle}</span></h2><p>{profile.description}</p><a className="pill dark" href="#work">Découvrir mes projets <Arrow/></a><span className="location"><i/>{profile.location}</span></div>
    <button className={`portrait-stage ${design?'designer-active':''}`} aria-label={design?'Afficher mon côté développeur':'Afficher mon côté designer'} aria-pressed={design} onPointerEnter={movePortrait} onPointerMove={movePortrait} onPointerLeave={leavePortrait} onPointerCancel={leavePortrait} onClick={e=>{if(e.detail!==0&&!hitPortrait(e.clientX,e.clientY))return;cancelAnimationFrame(hoverFrame.current);setPinned(!design);setHovered(false);}}>
     <OptimizedImage sizes="(max-width: 760px) 90vw, (max-width: 1150px) 60vw, 55vw" ref={developerImage} onLoad={e=>preparePortrait(e.currentTarget)} className="portrait portrait-dev" src="/images/developer.png" width="1122" height="1402" alt="Joackim, en tenue noire, travaillant sur un ordinateur avec des stickers de développeur" fetchPriority="high" draggable={false} aria-hidden={design}/>
     <OptimizedImage sizes="(max-width: 760px) 90vw, (max-width: 1150px) 60vw, 55vw" fetchPriority="low" ref={designerImage} className="portrait portrait-design" src="/images/designer.png" width="1122" height="1402" alt="Joackim, en pull beige, présentant un ordinateur avec des stickers Adobe et Figma" onLoad={e=>{preparePortrait(e.currentTarget);setPortraitReady(true);}} draggable={false} aria-hidden={!design}/>
     <PortraitEffects design={design}/>
    </button>
    <div className="signature-badge" aria-hidden="true"><svg viewBox="0 0 120 120"><defs><path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs><text><textPath href="#badge-circle" textLength="270">DÉVELOPPEUR · DESIGNER · </textPath></text></svg><span><b key={mode} className="identity-symbol">{design?'✳':'</>'}</b></span></div>
    <aside className="hero-aside">{socials.length?socials.map(([name,url,icon])=><a className="social-pill" href={safeExternalUrl(url)} target="_blank" rel="noreferrer" key={name}><span>{icon}</span>{name}<Arrow/></a>):<><a className="social-pill" href="#work"><span>↗</span>Mes projets</a><a className="social-pill" href="#services"><span>✳</span>Mon savoir-faire</a><a className="social-pill" href="#contact"><span>↗</span>Échangeons</a></>}
     <div className="hero-socials"><SocialLink name="GitHub" url={profile.github}/><SocialLink name="LinkedIn" url={profile.linkedin}/></div>
    </aside>
    <div className="portrait-controls"><span className="portrait-hint">Deux facettes, un même créatif <span>↗</span></span><div role="group" aria-label="Choisir le portrait"><button className={!design?'selected':''} aria-pressed={!design} onClick={()=>{setPinned(false);setHovered(false);}}>Code <span>&lt;/&gt;</span></button><button className={design?'selected':''} aria-pressed={design} disabled={!portraitReady} onClick={()=>{setPinned(true);setHovered(false);}}>Design <span>✳</span></button></div></div>
   </section>
   <div className={`floating-nav ${sticky?'visible':''}`} aria-hidden={!sticky}><a href="#top" aria-label="Retour en haut" tabIndex={sticky?0:-1}><Mark/></a><nav aria-label="Navigation rapide">{links.map(([name,href])=><a key={href} href={href} aria-current={activeSection===href.slice(1)?'location':undefined} className={activeSection===href.slice(1)?'nav-active':''} tabIndex={sticky?0:-1}>{name}</a>)}</nav><button className="floating-more" aria-label="Toutes les sections" aria-expanded={mobileMenu} aria-controls="mobile-menu" tabIndex={sticky?0:-1} onClick={()=>setMobileMenu(true)}>☰</button><PreferenceControls compact tabIndex={sticky?0:-1}/><a className="floating-rdv" href="#booking" aria-current={activeSection==='booking'?'location':undefined} tabIndex={sticky?0:-1}>RDV <Arrow/></a></div>
   <Marquee>{[0,1].map(n=><span className="marquee-track" key={n}>{['DÉVELOPPEMENT','DESIGN GRAPHIQUE','IDENTITÉ VISUELLE','INTERFACES','CRÉATIVITÉ'].map(t=><span key={t}>{t}<b>✳</b></span>)}</span>)}</Marquee>
   <section id="work" className="work panel section-pad"><Reveal><div className="section-heading"><span aria-hidden="true">PORTFOLIO</span><MotionTitle lines={['/PROJETS CHOISIS']}/></div><div className="section-toolbar"><div className="filters" role="group" aria-label="Filtrer les projets">{['Tous','Web','Design'].map(f=><button key={f} onClick={()=>setFilter(f)} aria-pressed={f===filter} className={f===filter?'active':''}>{f}</button>)}</div><span className="draft-note"><i/>{projects.length} {t('projets en ligne')}</span></div></Reveal>
    <motion.div layout className="project-grid" aria-live="polite"><AnimatePresence mode="popLayout">{visible.map((p,i)=><motion.div layout key={p.id} className="project-slot" initial={reduce?false:{opacity:0,y:38,x:i%2?18:-18}} whileInView={{opacity:1,y:0,x:0}} viewport={{once:true,amount:.1}} onViewportEnter={entry=>entry?.target.classList.add("is-revealed")} exit={{opacity:0,scale:reduce?1:.985}} transition={{duration:reduce?0:.68,ease:[.22,1,.36,1],delay:reduce?0:(i%2)*.11,layout:{duration:reduce?0:.32}}}><a className="project-card" href={safeExternalUrl(p.url)} target="_blank" rel="noopener noreferrer" aria-label={`Voir le projet ${p.title} — nouvel onglet`}><div className="project-image"><ProjectArt project={p}/><span className="project-view-badge" aria-hidden="true">Voir <Arrow/></span></div><div className="project-meta"><span className="eyebrow">{p.type}</span><h3>{p.title}<Arrow/></h3><p>{p.description}</p><div className="tags">{[...p.tags,...(p.technologies||[])].map(t=><span key={t}>{t}</span>)}</div></div><div className="project-links"><span>Voir le projet <Arrow/></span>{p.year&&<span>{p.year}</span>}</div></a></motion.div>)}{visible.length===0&&<motion.p key="empty-projects" className="projects-empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Les créations graphiques seront ajoutées prochainement.</motion.p>}</AnimatePresence></motion.div>
    <p className="work-note">Une sélection de sites et d’applications sur lesquels j’ai travaillé.</p>
   </section>
   <section id="services" className="services section-pad"><Reveal><div className="simple-heading"><MotionTitle lines={['/SERVICES']}/><p>De l’idée à l’écran.<br/>Du code à l’image.</p></div></Reveal><div className="service-list">{services.map((s,i)=><Reveal key={s.title} from="left" delay={i*.035}><article className={`service service-${i} ${service===i?'open':''}`}><button aria-expanded={service===i} aria-controls={`service-${i}`} onClick={()=>setService(service===i?null:i)}><span className="service-number">{s.number}</span><h3>{s.title}</h3><span className="service-sign">{service===i?'×':'↗'}</span></button><div id={`service-${i}`} aria-hidden={service!==i} className={`service-fold ${service===i?'expanded':''}`}><div className="service-fold-inner"><div className="service-content"><p>{s.description}</p><div className={`service-art service-art-${i}`} aria-hidden="true"><span>{s.label}</span>{i===0||i===2?<OptimizedImage sizes="(max-width: 760px) 180px, 240px" className="service-preview" src={projects[i===0?0:3].image} alt="" loading="lazy"/>:<b>{s.icon}</b>}<div>JOACKIM DATE <span>STUDIO / {s.number}</span></div></div></div></div></div></article></Reveal>)}</div></section>
   <section id="experience" className="experience panel section-pad"><Reveal><div className="section-heading"><span aria-hidden="true">PARCOURS</span><MotionTitle lines={['/MON PARCOURS']}/></div><div className="experience-intro"><MotionTitle as="h3" lines={['La technique.','Le sens du détail.']}/><MotionCopy delay={.12} text="J’aime donner forme aux idées. J’aborde un projet avec le regard du développeur et celui du graphiste : penser son fonctionnement, puis soigner ce que l’on voit et ce que l’on ressent."/></div><div className="career-list">{experience.map((e,i)=><motion.article className="career-row" key={e.company} initial={reduce?false:{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} transition={{duration:reduce?0:.6,delay:reduce?0:i*.06}}><span className="career-index mono">0{i+1}</span><div><h4>{e.company}</h4><p>{e.role}</p><small>{e.detail}</small></div><span className="career-period">{e.period}</span></motion.article>)}</div><div className="experience-footer"><span>LOMÉ, TOGO · OUVERT AUX COLLABORATIONS À DISTANCE</span><a href="#contact">Faisons connaissance <Arrow/></a></div></Reveal></section>
   <CodeChallenge/>
   <Booking/>
   <section id="contact" className="contact panel section-pad"><Reveal><div className="contact-top"><span className="availability"><i/>Une idée à construire ensemble ?</span><span className="mono">CODE + DESIGN</span></div><MotionTitle className="contact-title" lines={[<>UN PROJET EN <em>TÊTE ?</em></>]}/><div className="contact-bottom"><MotionCopy delay={.16} text="Un site, une identité, une expérience. Parlons de ce que vous avez en tête."/><div><a className="pill dark" href={`mailto:${profile.email}`}>Me contacter <Arrow/></a><a className="pill light" href="#booking">Réserver un appel <Arrow/></a><button className="text-link contact-brief" onClick={()=>{setDownloaded(false);setPreparedMail('');setContact(true);}}>Préparer mon projet</button></div></div><div className="contact-signature"><a href="#top" className="wordmark"><OptimizedImage sizes="48px" className="signature-portrait" src="/images/developer.png" alt="" width="48" height="48" loading="lazy"/>{profile.firstName} {profile.lastName}<span>®</span></a><span>DÉVELOPPEUR & DESIGNER</span><div className="contact-socials"><SocialLink name="GitHub" url={profile.github}/><SocialLink name="LinkedIn" url={profile.linkedin}/></div></div></Reveal></section>
   <footer><span>© {new Date().getFullYear()} {profile.firstName} {profile.lastName}</span><span>Conçu avec intention. Développé avec soin.</span><a href="#top">Retour en haut ↑</a></footer>
  </main>

  <MobileNavigation open={mobileMenu} onClose={()=>setMobileMenu(false)} links={links} active={activeSection}/>
  <Modal open={contact} onClose={()=>setContact(false)} label="Préparer votre projet"><span className="eyebrow">FAISONS LE PREMIER PAS</span><h2>Votre idée,<br/>on en parle ?</h2><p className="form-intro">{profile.email?'Préparez votre message : il s’ouvrira dans votre messagerie.':'Les coordonnées de contact seront ajoutées prochainement. Vous pouvez déjà préparer votre brief et le télécharger ; aucune donnée n’est envoyée.'}</p><form onSubmit={submitBrief} onChange={()=>{setPreparedMail('');setBriefError('');}}><div className="form-row"><label>Votre nom<input required name="name" autoComplete="name" placeholder="Comment vous appelez-vous ?" maxLength={120}/></label><label>Votre email<input required name="email" type="email" autoComplete="email" placeholder="vous@exemple.com" maxLength={180}/></label></div><label>Votre besoin<select name="service" defaultValue="Site ou application"><option>Site ou application</option><option>Identité visuelle</option><option>Affiche ou campagne</option><option>Code et design</option><option>Autre projet</option></select></label><label>Quelques mots sur votre projet<textarea required name="message" placeholder="L’idée, vos objectifs, vos délais…" rows={4} minLength={10} maxLength={6000}/></label><button className="pill dark" type="submit">{profile.email?'Préparer mon message':'Télécharger mon brief'}<Arrow/></button>{preparedMail&&<a className="pill light prepared-mail" href={preparedMail}>Ouvrir ma messagerie <Arrow/></a>}<p className="form-notice" role="status">{briefError|| (preparedMail?'Votre message est prêt. Ouvrez votre messagerie puis envoyez-le.':downloaded?'Votre brief a été téléchargé. Il n’a pas été envoyé.':'Vos informations restent dans ce formulaire jusqu’à votre action.')}</p></form></Modal>
  <style>{reduce?`.marquee>div,.signature-badge svg{animation:none!important}`:''}</style>
 </>);
}
