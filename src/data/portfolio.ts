/** Contenus à personnaliser : aucun projet ou lien client n'est inventé. */
// Remplacer uniquement ces deux valeurs par vos URL complètes.
export const GITHUB_URL = 'https://github.com/genesisX1';
export const LINKEDIN_URL = '';
export const profile = {
  firstName: 'Joackim', lastName: 'DATE', location: 'Lomé, Togo',
  developerTitle: 'Développeur Full-Stack', designerTitle: 'Graphiste & Designer',
  description: 'Je conçois des expériences web et des identités visuelles. Du premier trait à la dernière ligne de code.',
  email: 'joackimdate1@gmail.com', whatsapp: '', github: GITHUB_URL, linkedin: LINKEDIN_URL, instagram: '',
  bookingUrl: 'https://calendar.app.google/vQuqsgytRnD3fLjU8', availability: 'Parlons de votre prochain projet',
};
export type Project = {
  id: string; title: string; category: 'Web' | 'Design'; type: string;
  description: string; tags: string[]; image: string; url: string; githubUrl?: string;
  status: 'À renseigner' | 'En ligne' | 'Non déployé' | 'Concept';
  role: string; details: string; technologies?: string[]; year?: number; imageAlt?: string; imageWidth?: number; imageHeight?: number;
};
export const projects: Project[] = [
  { id:'ciau', title:'CIAU', category:'Web', type:'SITE INSTITUTIONNEL', description:'Une vitrine institutionnelle pour l’architecture, l’ingénierie et l’urbanisme, avec réalisations, partenaires et navigation bilingue.', tags:['Architecture','Institutionnel','Bilingue'], technologies:[], image:'/images/projects/ciau.png', imageWidth:1890, imageHeight:962, imageAlt:'Accueil du cabinet CIAU : logo, navigation bilingue et animation architecturale', url:'https://www.cabinet-ciau.com/', githubUrl:'', status:'En ligne', role:'', details:'Site vitrine du Consortium International d’Ingénieurs, Architectes et Urbanistes. Il présente le cabinet, ses réalisations et ses partenaires, avec une navigation en français et en anglais.' },
  { id:'cave-du-bourgeois', title:'La Cave du Bourgeois', category:'Web', type:'APPLICATION MÉTIER', description:'Un back-office dédié à la gestion du stock, des ventes et au suivi des opérations métier.', tags:['Application','Stock & ventes','Back-office'], technologies:[], image:'/images/projects/cave-du-bourgeois.png', imageWidth:1888, imageHeight:973, imageAlt:'Écran de connexion du back-office La Cave du Bourgeois', url:'https://lacavedubourgeois.com/', githubUrl:'', status:'En ligne', role:'', details:'Solution de gestion opérationnelle autour du stock, des ventes et du suivi métier. L’application est déployée ; son accès est réservé au personnel autorisé. La capture présente l’écran de connexion public.' },
  { id:'the316tech', title:'The 316 Tech', category:'Web', type:'SITE CORPORATE · TECH', description:'Une présence digitale professionnelle pour une entreprise tech : services IT, réalisations et prise de contact.', tags:['Corporate','Technologie','Services IT'], technologies:[], image:'/images/projects/the316tech.png', imageWidth:1867, imageHeight:956, imageAlt:'Accueil The 316 Tech : Innovation Digitale, interface sombre et bouton orange', url:'https://www.the316tech.com/', githubUrl:'', status:'En ligne', role:'', details:'Site corporate présentant l’entreprise et ses services : conseil IT, développement web et mobile, intégration IA, cloud, cybersécurité et support technique. La page comprend également des réalisations et un formulaire de contact. La capture montre le Hero de la page d’accueil.' },
  { id:'afripul-support', title:'Afripul Support', category:'Web', type:'PLATEFORME · SUPPORT CLIENT', description:'Une interface de support claire pour trouver des réponses, consulter la FAQ et contacter l’assistance.', tags:['Application','Support client','Interface'], technologies:[], image:'/images/projects/afripul-support.png', imageWidth:1893, imageHeight:972, imageAlt:'Page À propos d’Afripul : présentation, mission et vision', url:'https://afripul-customer.bolt.host/', githubUrl:'', status:'En ligne', role:'', details:'Plateforme d’assistance client avec FAQ, formulaire de contact et accès au chat. L’interface rassemble les points d’entrée vers les commandes, le suivi et les réclamations pour faciliter l’accès au support.' },
  { id:'mauvais-temps', title:'Mauvais Temps & Compagnie', category:'Web', type:'EXPÉRIENCE WEB INTERACTIVE', description:'Un univers immersif autour d’un orage de compagnie : rencontre, personnalisation et parcours d’adoption simulée.', tags:['Expérience interactive','Univers créatif','Objet digital'], technologies:[], image:'/images/projects/mauvais-temps.png', imageWidth:1872, imageHeight:977, imageAlt:'Accueil Mauvais Temps : typographie vert clair et orage dans une sphère sur fond sombre', url:'https://mauvais-temps-compagnie.genesisxv.chatgpt.site/', githubUrl:'', status:'En ligne', role:'', details:'Expérience démo autour d’un orage numérique à rencontrer, personnaliser et adopter dans le navigateur. Le parcours propose aussi d’offrir un orage ; l’adoption est simulée, sans prélèvement.' },
  { id:'sceau-origines', title:'Sceau Origines', category:'Web', type:'CRÉATION NUMÉRIQUE PERSONNALISÉE', description:'Une expérience pour composer un Sceau à son nom, choisir ses mots et garder, partager ou offrir sa création numérique.', tags:['Personnalisation','Design produit','Cadeau numérique'], technologies:[], image:'/images/projects/sceau-origines.png', imageWidth:1886, imageHeight:953, imageAlt:'Section cadeau Sceau Origines : écrin noir et texte Certains cadeaux portent un nom.', url:'https://sceau-origines.genesisxv.chatgpt.site/', githubUrl:'', status:'En ligne', role:'', details:'Univers de créations visuelles personnalisées : choix d’un emblème, d’un nom et d’un message, puis téléchargement d’images et d’un coffret numérique. Un parcours permet de préparer un cadeau à partager par lien.' },
];

export const services = [
  { title:'Développement web', number:'01', description:'Des sites et applications pensés pour être utiles, agréables à utiliser et faciles à faire évoluer.', icon:'</>', label:'Du besoin au produit.' },
  { title:'Graphisme & identité', number:'02', description:'Une identité reconnaissable : couleurs, typographies, compositions et supports qui parlent d’une même voix.', icon:'Aa', label:'Une idée. Une identité.' },
  { title:'Interfaces & expérience', number:'03', description:'Des interfaces claires, une hiérarchie soignée et des parcours qui rendent chaque action naturelle.', icon:'↗', label:'Chaque détail compte.' },
  { title:'Communication visuelle', number:'04', description:'Affiches, visuels de campagne et contenus pour les réseaux sociaux, avec un message lisible et une direction cohérente.', icon:'✳', label:'Faire voir. Faire comprendre.' },
];
// Expériences reprises du CV fourni ; conserver les dates exactes.
export const experience = [
  {company:'AFRIPUL',role:'Développeur Full Stack · Freelance',period:'Sept. 2025 — Aujourd’hui',detail:'Plateforme web, API métiers, données et fonctionnalités temps réel.'},
  {company:'DREAMMORE',role:'Développeur Full Stack / Angular',period:'Oct. 2023 — Mars 2025',detail:'Plateforme e-commerce, gestion des commandes et notifications en temps réel.'},
  {company:'316Group',role:'Développeur Web',period:'Févr. 2021 — Août 2023',detail:'Conception et maintenance d’applications web et de sites professionnels.'},
];
