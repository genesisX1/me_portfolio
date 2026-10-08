// Tests du DOM et des événements. Ne remplacent pas un contrôle visuel navigateur.
import {JSDOM,VirtualConsole} from 'jsdom';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const html=await readFile(new URL('../OUVRIR-LE-PORTFOLIO.html',import.meta.url),'utf8');
const errors=[];let exported;
const consoleSink=new VirtualConsole();consoleSink.on('jsdomError',e=>errors.push(e.message));
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,url:'file:///portfolio/OUVRIR-LE-PORTFOLIO.html',virtualConsole:consoleSink,beforeParse(w){
 w.matchMedia=q=>({matches:q.includes('prefers-reduced-motion'),media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}});
 w.IntersectionObserver=class{constructor(cb){this.cb=cb;}observe(target){this.cb([{target,isIntersecting:true,intersectionRatio:1}]);}unobserve(){}disconnect(){}};
 w.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
 Object.defineProperty(w.HTMLImageElement.prototype,'naturalWidth',{get(){return 4;}});
 Object.defineProperty(w.HTMLImageElement.prototype,'naturalHeight',{get(){return 4;}});
 w.HTMLCanvasElement.prototype.getContext=function(){return {drawImage(){},getImageData(){const data=new Uint8ClampedArray(64);for(const i of [5,6,9,10])data[i*4+3]=255;return {data};}};};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
 w.URL.createObjectURL=blob=>{exported=blob;return 'blob:local-test';};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){};
}});
const w=dom.window,d=w.document;
const tick=()=>new Promise(r=>setTimeout(r,400));
const click=async el=>{assert.ok(el,'Élément à cliquer présent');el.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await tick();};
const button=(text,root=d)=>[...root.querySelectorAll('button')].find(el=>el.textContent.trim()===text);
const openDialog=()=>d.querySelector('dialog[open]');
function input(name,value){const el=openDialog().querySelector(`[name="${name}"]`);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));}
try{
 await tick();
 assert.equal(d.documentElement.dataset.theme,'dark','La première visite commence en mode sombre');
 assert.equal(d.querySelector('.site-preferences .theme-options button').getAttribute('aria-label'),'Mode clair');
 assert.equal(d.querySelectorAll('.project-card').length,6);
 assert.equal(d.querySelector('.header .audio-toggle').getAttribute('aria-pressed'),'false','Le son ne démarre jamais automatiquement');await click(d.querySelector('.header .audio-toggle'));assert.equal(d.querySelector('.header .audio-toggle').getAttribute('aria-pressed'),'false','Un navigateur sans Web Audio garde le site utilisable');assert.equal(d.querySelector('.header .audio-toggle').title,'Son indisponible — réessayer');
 assert.equal(d.querySelector('.intro-replay'),null);assert.ok(d.querySelector('.hero.intro-ready'),'L’introduction initiale reste active');assert.ok(d.querySelector('.header .site-preferences'));assert.ok(!d.querySelector('.hero-aside').textContent.includes('EXPLORER MON UNIVERS'));
 const stage=d.querySelector('.portrait-stage'),designer=d.querySelector('.portrait-design');
 for(const image of d.querySelectorAll('.portrait')){image.getBoundingClientRect=()=>({left:0,top:0,width:100,height:100});image.dispatchEvent(new w.Event('load'));}await tick();
 assert.equal(stage.getAttribute('aria-pressed'),'false');
 const enter=new w.MouseEvent('pointerover',{bubbles:true,clientX:50,clientY:50});Object.defineProperty(enter,'pointerType',{value:'mouse'});stage.dispatchEvent(enter);await tick();
 assert.equal(stage.getAttribute('aria-pressed'),'true','Le survol opaque montre le designer');
 const move=async(x,y)=>{const e=new w.MouseEvent('pointermove',{bubbles:true,clientX:x,clientY:y});Object.defineProperty(e,'pointerType',{value:'mouse'});stage.dispatchEvent(e);await tick();};
 await move(5,5);assert.equal(stage.getAttribute('aria-pressed'),'false','Les pixels transparents restent neutres dans la bounding box');
 for(let i=0;i<3;i++){await move(50,50);assert.equal(stage.getAttribute('aria-pressed'),'true');await move(95,95);assert.equal(stage.getAttribute('aria-pressed'),'false');}
 stage.dispatchEvent(new w.MouseEvent('click',{bubbles:true,detail:1,clientX:5,clientY:5}));await tick();assert.equal(stage.getAttribute('aria-pressed'),'false','Un tap transparent ne sélectionne rien');
 stage.dispatchEvent(new w.MouseEvent('pointerout',{bubbles:true,relatedTarget:d.body}));await tick();
 assert.equal(stage.getAttribute('aria-pressed'),'false','La sortie restaure le développeur');
 stage.dispatchEvent(new w.MouseEvent('click',{bubbles:true,detail:1,clientX:50,clientY:50}));await tick();assert.equal(stage.getAttribute('aria-pressed'),'true','Un tap opaque sélectionne le designer');
 stage.dispatchEvent(new w.MouseEvent('pointerout',{bubbles:true,relatedTarget:d.body}));await tick();assert.equal(stage.getAttribute('aria-pressed'),'true','Le choix au clic persiste');
 await click(button('Code </>'));assert.equal(stage.getAttribute('aria-pressed'),'false');
 await click(button('Design',d.querySelector('.filters')));assert.equal(d.querySelectorAll('.project-card').length,0);assert.ok(d.querySelector('.projects-empty'));
 await click(button('Web',d.querySelector('.filters')));assert.equal(d.querySelectorAll('.project-card').length,6);
 const projectCards=[...d.querySelectorAll('a.project-card')];
 assert.deepEqual(projectCards.map(a=>a.href),['https://www.cabinet-ciau.com/','https://lacavedubourgeois.com/','https://www.the316tech.com/','https://afripul-customer.bolt.host/','https://mauvais-temps-compagnie.genesisxv.chatgpt.site/','https://sceau-origines.genesisxv.chatgpt.site/']);
 for(const card of projectCards){assert.equal(card.target,'_blank');assert.equal(card.rel,'noopener noreferrer');assert.equal(card.querySelectorAll('button,a').length,0);const event=new w.MouseEvent('click',{bubbles:true,cancelable:true});let intercepted=false;const preventNavigation=e=>{intercepted=e.defaultPrevented;e.preventDefault();};d.addEventListener('click',preventNavigation,{once:true});card.dispatchEvent(event);await tick();assert.equal(intercepted,false,'Le clic reste une navigation native');assert.equal(openDialog(),null,'Aucune fiche intermédiaire');}
 await click(button('Tous',d.querySelector('.filters')));assert.equal(d.querySelectorAll('.project-card').length,6);
 const serviceButtons=[...d.querySelectorAll('.service>button')];await click(serviceButtons[1]);assert.equal(serviceButtons[1].getAttribute('aria-expanded'),'true');assert.equal(serviceButtons[0].getAttribute('aria-expanded'),'false');
 await click(serviceButtons[1]);assert.equal(serviceButtons[1].getAttribute('aria-expanded'),'false');
 await click(d.querySelector('.challenge .pill'));assert.ok(openDialog());
 assert.equal(openDialog().querySelectorAll('.mission-grid article').length,6);
 await click(button('Lancer le défi ↗',openDialog()));assert.ok(openDialog().querySelector('.game-workspace'));
 assert.equal(openDialog().querySelector('iframe').getAttribute('sandbox'),'allow-scripts');
 const finishRun=async(pass=false)=>{const frame=openDialog().querySelector('iframe');const token=JSON.stringify(new URL(frame.src).hash.slice(1));w.dispatchEvent(new w.MessageEvent('message',{origin:'null',source:frame.contentWindow,data:{type:'challenge-result',token:JSON.parse(token),results:[{label:'Test de navigation',pass}]}}));await tick();};
 // Ignore messages from another source even if its payload is well formed.
 w.dispatchEvent(new w.MessageEvent('message',{source:w,data:{type:'challenge-result',token:'wrong',results:[{label:'spoof',pass:true}]}}));await tick();assert.ok(button('Vérifier ✓',openDialog()).disabled);
 await finishRun();assert.equal(button('Vérifier ✓',openDialog()).disabled,false);
 await click(button('Un indice ?',openDialog()));assert.ok(openDialog().querySelector('.game-hint'));
 await click(button('Vérifier ✓',openDialog()));await finishRun(true);assert.match(openDialog().querySelector('.game-controls').textContent,/Tous les tests passent/);
 await click(button('Mission suivante ↗',openDialog()));await finishRun();assert.match(openDialog().querySelector('.game-brief h2').textContent,/bouton invisible/);
 await click(button('Réinitialiser ↻',openDialog()));await finishRun();assert.ok(openDialog().querySelector('.code-input textarea'));
 for(let i=1;i<6;i++){await click(button('Passer la mission →',openDialog()));if(i<5)await finishRun();}
 assert.match(openDialog().querySelector('.game-result h2').textContent,/75\/600/);assert.equal(openDialog().querySelectorAll('.game-result li').length,6);
 await click(button('Rejouer ↗',openDialog()));await finishRun();assert.match(openDialog().querySelector('.game-brief h2').textContent,/menu silencieux/);
 await click(openDialog().querySelector('.game-close'));
 assert.equal(d.querySelector('.contact-bottom a.pill').getAttribute('href'),'mailto:joackimdate1@gmail.com');
 await click(d.querySelector('.contact-brief'));assert.ok(openDialog());
 input('name','Client test');input('email','client@example.com');input('message','Un projet de portfolio avec du code et du design.');
 openDialog().querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await tick();
 const mail=openDialog().querySelector('.prepared-mail');assert.ok(mail);assert.match(mail.href,/^mailto:joackimdate1@gmail.com/);assert.match(decodeURIComponent(mail.href),/Client test/);assert.match(openDialog().querySelector('[role="status"]').textContent,/message est prêt/);assert.equal(exported,undefined,'La préparation ne déclenche aucun envoi ni téléchargement');
 await click(openDialog().querySelector('.close'));
 // JSDOM uses the desktop CSS; expose the mobile trigger for the focus test.
 const menu=d.querySelector('.menu-button');menu.style.display='flex';menu.focus();await click(menu);assert.equal(menu.getAttribute('aria-expanded'),'true');
 assert.equal(openDialog().getAttribute('aria-label'),'Navigation mobile');assert.equal(openDialog().querySelectorAll('nav a').length,6);assert.equal(d.body.style.overflow,'hidden');assert.equal(d.activeElement,openDialog().querySelector('nav a'),'Le menu reçoit le focus');
 w.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape'}));await tick();assert.equal(menu.getAttribute('aria-expanded'),'false');assert.equal(openDialog(),null);assert.notEqual(d.body.style.overflow,'hidden');assert.ok(d.activeElement?.matches('.menu-button'),`Fermer le menu restitue le focus au bouton (actuel : ${d.activeElement?.tagName}.${d.activeElement?.className})`);
 await click(d.querySelector('.floating-more'));assert.ok(openDialog());assert.equal(d.querySelector('.floating-more').getAttribute('aria-expanded'),'true');
 await click(openDialog().querySelector('a[href="#challenge"]'));assert.equal(openDialog(),null,'Une destination ferme le menu');
 await click(menu);openDialog().dispatchEvent(new w.MouseEvent('click',{bubbles:true}));await tick();assert.equal(openDialog(),null,'Le clic sur le fond ferme le menu');

 const booking=d.querySelector('#booking');
 const bookingLink=booking.querySelector('a.booking-link');
 assert.ok(bookingLink,'La réservation Google est accessible');
 assert.equal(bookingLink.href,'https://calendar.app.google/vQuqsgytRnD3fLjU8');
 assert.equal(bookingLink.target,'_blank');assert.equal(bookingLink.rel,'noopener noreferrer');
 assert.match(booking.querySelector('.booking-duration').textContent,/45 minutes/);
 assert.equal(booking.querySelectorAll('form,.calendar-days,.booking-times').length,0,'Aucun créneau fictif ni formulaire manuel');
 const bookingEvent=new w.MouseEvent('click',{bubbles:true,cancelable:true});let bookingIntercepted=false;
 d.addEventListener('click',e=>{bookingIntercepted=e.defaultPrevented;e.preventDefault();},{once:true});
 bookingLink.dispatchEvent(bookingEvent);await tick();assert.equal(bookingIntercepted,false,'La réservation ouvre une navigation native');
 assert.equal(openDialog(),null);assert.equal(exported,undefined,'Aucune proposition ICS non confirmée');
 assert.equal(d.querySelectorAll('.career-row').length,3);
 assert.equal(d.querySelectorAll('a[href=""]').length,0);
 assert.equal(d.querySelectorAll('.hero-socials [aria-disabled="true"]').length,1);
 for(const link of d.querySelectorAll('.social-network[href]')){assert.equal(link.href,'https://github.com/genesisX1');assert.equal(link.target,'_blank');assert.equal(link.rel,'noopener noreferrer');}
 assert.equal(d.querySelectorAll('.project-cursor[aria-hidden="true"]').length,1);
 assert.equal(d.documentElement.classList.contains('project-cursor-enabled'),false,'Pas de curseur animé avec mouvement réduit');
 assert.equal(d.querySelectorAll('main>section').length,7);
 assert.deepEqual([...d.querySelectorAll('main>section')].map(e=>e.id),['top','work','services','experience','challenge','booking','contact']);
 for(const a of d.querySelectorAll('a[href^="#"]'))assert.ok(d.querySelector(a.getAttribute('href')));
 assert.equal(d.querySelectorAll('.intro-code').length,1);assert.deepEqual([...d.querySelectorAll('.project-card h3')].map(e=>e.textContent),['CIAU','La Cave du Bourgeois','The 316 Tech','Afripul Support','Mauvais Temps & Compagnie','Sceau Origines']);for(const a of d.querySelectorAll('a.project-card')){assert.equal(a.target,'_blank');assert.equal(a.rel,'noopener noreferrer');}assert.ok([...d.querySelectorAll('.project-image img')].every(i=>/^data:image\/(jpeg|png);base64,/.test(i.src)));assert.equal(d.querySelectorAll('.project-code-link').length,0);
 assert.ok([...d.querySelectorAll('.portrait')].every(i=>i.src.startsWith('data:image/png;base64,')),'Les portraits sont embarqués dans le fichier autonome');

 assert.equal(d.querySelectorAll('.expertise-list,.expertise-caption').length,0,'Le bloc des trois terrains est retiré');
 dom.reconfigure({url:'https://portfolio.example/'}); // Persistence on a hosted origin; the file:// flow above also works without storage.
 await click(d.querySelector('.site-preferences .language-toggle'));
 assert.equal(d.documentElement.lang,'en');assert.equal(d.querySelector('.hero-intro h2').textContent,'Full-Stack Developer');
 assert.match(d.querySelector('#services .simple-heading p').textContent,/From idea to screen/);
 assert.match(d.querySelector('#work .motion-title').textContent,/SELECTED WORK/);
 assert.equal(bookingLink.getAttribute('aria-label'),'Book an appointment — new tab');
 assert.match(bookingLink.textContent,/Book an appointment/);
 assert.match(booking.querySelector('.booking-zone-note').textContent,/time zone/);
 await click(d.querySelector('.site-preferences .theme-options button'));
 assert.equal(d.documentElement.dataset.theme,'light');
 await click(d.querySelector('.contact-brief'));assert.equal(openDialog().getAttribute('aria-label'),'Prepare your project');
 assert.equal(openDialog().querySelector('option').value,'Site ou application','Les valeurs autorisées restent stables');
 assert.equal(openDialog().querySelector('option').textContent,'Website or application');
 input('name','English visitor');input('email','english@example.com');input('message','A professional website for my business.');
 openDialog().querySelector('form').dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));await tick();
 assert.match(decodeURIComponent(openDialog().querySelector('.prepared-mail').href),/PROJECT REQUEST/);
 assert.match(openDialog().querySelector('[role="status"]').textContent,/Your message is ready/);
 await click(openDialog().querySelector('.close'));
 await click(d.querySelector('.challenge .pill'));assert.match(openDialog().querySelector('.mission-grid').textContent,/The silent menu/);
 await click(button('Start the challenge ↗',openDialog()));assert.match(openDialog().querySelector('.game-brief').textContent,/The menu will not open/);
 await click(openDialog().querySelector('.game-close'));
 await click(menu);assert.equal(openDialog().getAttribute('aria-label'),'Mobile navigation');
 assert.match(openDialog().textContent,/Book a call/);await click(openDialog().querySelector('.drawer-heading button'));
 assert.equal(w.localStorage.getItem('joackim-language'),'en');assert.equal(w.localStorage.getItem('joackim-theme'),'light');
 await click(d.querySelector('.site-preferences .language-toggle'));assert.equal(d.documentElement.lang,'fr');
 await click(d.querySelector('.site-preferences .theme-options button'));assert.equal(d.documentElement.dataset.theme,'dark');
 assert.deepEqual(errors,[]);
 console.log('OK : survol / sortie / clic portrait, filtres, liens directs des projets, services, défi complet et rejouer, message préparé, réservation Google directe FR/EN, menu et Échap.');
 console.log('OK : fichier autonome, images embarquées, aucune erreur JavaScript détectée.');
}finally{dom.window.close();}
