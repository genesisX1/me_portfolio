> Export Vercel : commencer par **DEPLOIEMENT-VERCEL.md**.

# Joackim DATE — Portfolio Code + Design

Version actuelle : identité gris/blanc/charbon, deux portraits fournis, six projets réels et sept sections. Référence d’interactions : jk.nameksociety.com ; le code et les contenus sont propres à ce portfolio.

## Travailler localement

Ouvrir ce dossier dans Cursor, VS Code ou Codex. Node.js 24.15+ :

```bash
npm ci
npm run dev
```

Ouvrir http://localhost:3000. `npm run preview` sert la compilation locale sur http://localhost:4173. Le fichier `OUVRIR-LE-PORTFOLIO.html` fonctionne également par double-clic, hors connexion ; les captures et portraits y sont embarqués. La messagerie nécessite une application configurée et l’envoi reste manuel.

## Contenu et réglages

- `src/data/portfolio.ts` : profil, email, projets, services, compétences et expériences. L’email professionnel et les trois expériences viennent du CV fourni. Le GitHub conserve la dernière URL donnée : https://github.com/genesisX1. LinkedIn n’est pas renseigné.
- `src/lib/booking.mjs` : fuseau Africa/Lome (UTC+0), durée, jours et heures proposés, horizon de six mois. Horaires initiaux : lundi à samedi, 09:00–11:30 et 14:00–16:30, par intervalles de 30 minutes. Ce sont des propositions configurables, pas des disponibilités extraites d’un agenda.
- `src/components/Booking.tsx` : calendrier, choix de créneau, formulaire, préparation de l’email et téléchargement d’une proposition ICS.
- `src/components/Portfolio.tsx` : structure et interactions.
- `src/components/CodeChallenge.tsx` : atelier plein écran, éditeur, aperçu, tests, chronomètre, indices et résultats.
- `src/lib/codeChallenge.mjs` : six missions originales, code initial et tests associés.
- `src/components/MotionTitle.tsx` : dévoilement des titres par mots/lignes et arrivée progressive des paragraphes.
- `src/components/MotionDetails.tsx` : introduction, curseur des projets et interactions de mouvement.
- `src/app/globals.css` : composition, mouvements et adaptations responsive.

## Rendez-vous et contact

Le visiteur choisit une date et un horaire, renseigne ses coordonnées et prépare sa demande. Il doit ensuite ouvrir sa messagerie et envoyer l’email. Joackim confirme personnellement le rendez-vous. Aucune disponibilité réelle, réservation serveur ou confirmation automatique n’est simulée. Changer de jour ou de mois efface la sélection ; les créneaux passés sont exclus.

Le fichier ICS est une proposition `TENTATIVE` et `TRANSPARENT` de 30 minutes : il ne bloque pas un agenda. Aucun compte, secret API, backend ou service d’envoi n’est nécessaire. Le bouton « Me contacter » ouvre directement la messagerie. « Préparer mon projet » ouvre le formulaire pour composer un brief ; aucun message n’est envoyé automatiquement. Les données des formulaires ne sont pas persistées.

## Décisions visuelles à conserver

- Composition validée : grand nom, personnage central, panneaux arrondis et bande inclinée espacée.
- Deux portraits propres à Joackim ; aucun remplacement par une autre personne.
- Bascule développeur/designer au survol de la silhouette, au toucher et au clavier. Les pixels transparents restent neutres ; la silhouette développeur sert aussi de zone stable pendant un survol pour éviter les oscillations de contours.
- Projets : CIAU, La Cave du Bourgeois, The 316 Tech et Afripul Support, dans cet ordre. Captures fournies, intactes et intégralement visibles. Aucune modale avant la navigation ; liens directs en nouvel onglet avec `noopener noreferrer`.
- Filtres Tous / Web / Design. Design reste vide jusqu’à l’ajout de créations réelles.
- Pas d’année, rôle ou technologie inventés pour les projets.
- Titres dévoilés par lignes, accueil séquencé, entrées de cartes discrètement alternées, accordéon et contact progressifs. L’introduction est visible dès le premier rendu et rejouée à chaque chargement. Elle est ignorée en mouvement réduit. Les titres se dévoilent à nouveau lors d’un retour dans leur section.
- Curseur Voir réservé à la souris, retour au pointeur natif au défilement et au clavier. Pastille fixe sur tactile et en mouvement réduit.
- Atelier Code + Design plein écran : six missions, éditeur, aperçu, tests, indices, chronomètre, score et possibilité de rejouer.
- Aucun défilement horizontal forcé ni parallaxe tactile. Respect de `prefers-reduced-motion`.

## Vérifications et export

```bash
npm run deliver
```

Types, tests de logique, compilation statique Next.js, génération HTML autonome et tests d’interaction dans un DOM simulé. Les tests DOM ne prouvent pas la qualité visuelle : vérifier aussi les largeurs réelles et les transitions dans un navigateur. Voir `docs/qa/verification.md` pour la portée des dernières vérifications.

Le dossier `out/` est l’export statique hébergeable. La page reste `noindex, nofollow` pendant la personnalisation ; retirer cette instruction lors de la finalisation SEO.

Stack : Next.js, React, TypeScript, Tailwind et Framer Motion. Aucun Angular et aucune nouvelle dépendance pour cette évolution.

## Atelier interactif

Six missions : menu, contraste et focus, contenu, données absentes, chevauchements de rendez-vous et file asynchrone. Le visiteur modifie HTML/CSS/JavaScript, exécute un aperçu puis vérifie les tests. Les indices réduisent le maximum à 75 points ; une mission passée vaut zéro. Score sur 600, chronomètre, réinitialisation, résultat par mission et possibilité de rejouer. Le code tourne dans un iframe opaque sans accès au portfolio ou au réseau. Le score est local à la partie, sans classement public fictif.

## Rythme et accessibilité des animations

Titres par mots, paragraphes progressifs (parcours, défi, rendez-vous, contact), cartes et services avec arrivée décalée, léger mouvement des cartes au survol, navigation mobile et ouverture du défi animées. Un trait discret indique la progression de lecture. Le défilement et le clavier annulent les décalages magnétiques des boutons. Les captures ne sont ni zoomées ni rognées. Sur tactile, les cibles importantes mesurent au moins 44px et les effets de survol ne sont pas nécessaires. La préférence de mouvement réduit conserve les textes immédiatement lisibles et supprime les déplacements.

## Navigation mobile

`src/components/MobileNavigation.tsx` contient le menu complet accessible depuis le haut et la barre flottante. Le dialogue garde le focus et bloque le défilement derrière lui ; Échap, le fond, le bouton de fermeture ou une destination le ferment. Sur petit écran, la barre conserve Projets, Services, Contact, le menu complet et RDV. Le calendrier utilise des jours de 44px de hauteur ; sélectionner un horaire mène au formulaire sans ouvrir automatiquement le clavier. Le défi garde son bouton de fermeture accessible pendant le défilement, avec un éditeur à 16px sur mobile.

### Animation du portrait

`src/components/PortraitEffects.tsx` définit les icônes Photoshop, Illustrator, InDesign et Figma. Les positions, le rythme de l’orbite et le mouvement léger du portrait sont dans le bloc « Portrait » à la fin de `src/app/globals.css`. Les effets restent décoratifs et ne capturent aucun clic ; le survol précis, les boutons Code / Design et la préférence de réduction des animations restent conservés. Les boucles sont suspendues hors écran et lorsque l’onglet est masqué. Il s’agit d’un mouvement léger des portraits existants, pas d’une vidéo de frappe au clavier.

### Sécurité

Voir `docs/SECURITE.md` pour le périmètre, les protections, les tests et les limites. `npm run deliver` vérifie aussi les empreintes CSP de l'export. `npm run audit:security` contrôle les dépendances. Le runner du défi est dans `public/challenge-runner.html` ; la CSP du portfolio est générée par `scripts/security-build.mjs`. Ne jamais copier de secrets dans les fichiers publics. Une nouvelle API ou un agenda connecté nécessite un nouvel audit côté serveur.

### Transitions des services

Le bloc « Services: quick exit » à la fin de `src/app/globals.css` règle l’arrivée et la sortie des vignettes : déplacement court, inclinaison progressive et détails décalés de 130 à 230 ms. La fermeture est plus rapide que l’ouverture ; un clic rapide inverse naturellement la transition. Sur petit écran, le déplacement reste vertical. Le mode de mouvement réduit applique immédiatement les états sans transition.

### Langue et apparence (V25)

- Sélecteur FR / EN et thème clair / anthracite en haut de page ; accessibles aussi dans le menu et la navigation flottante sur ordinateur.
- Préférences mémorisées uniquement dans le navigateur (`joackim-language`, `joackim-theme`). Le premier affichage reste français et clair ; aucune nouvelle collecte de données.
- Traductions : `src/data/translations.json` (texte français → anglais). Les textes, formulaires, dates et téléchargements de rendez-vous sont traduits, ainsi que les six missions du défi. Les identifiants des options de formulaire restent stables pour conserver les validations.
- Thèmes : bloc « Visitor preferences » à la fin de `src/app/globals.css` ; contrôles et état dans `src/components/Preferences.tsx`.
- Le bloc « Mes trois terrains d’expression » est retiré. Les trois expériences professionnelles du CV restent présentes.

- Les styles sont aussi embarqués dans la page publiée : le thème et la mise en page restent disponibles si une extension bloque le fichier CSS généré.

## Navigation discrète (V29)
Le thème utilise uniquement la lune ou le soleil ; la langue se change avec le bouton FR/EN dans la ligne du menu. Les libellés accessibles et les préférences persistantes restent actifs. « Revoir l’intro » et « Explorer mon univers » sont retirés. L’accueil et le défilement reprennent leurs dimensions précédentes ; les masques des titres gardent leur marge pour les accents français.

## Ambiance code-fi (V30)
Composition originale synthétisée localement via Web Audio : accords doux, basse et percussion discrète à 72 BPM. Aucun téléchargement audio, aucune lecture automatique. L’icône son du menu active/coupe la musique ; survol ou focus permet de régler le volume (18 % au départ, limité à 50 %). Sur téléphone, le contrôle est dans le menu pour préserver l’espace. La lecture se coupe quand l’onglet passe en arrière-plan et demande un clic pour reprendre. Le contexte audio est libéré à la pause ; une erreur audio ne bloque jamais les autres fonctions. Composition : `src/lib/codefi.mjs` ; état/contrôle : `src/components/AmbientAudio.tsx`.

## Projets ajoutés (V31)
Mauvais Temps & Compagnie et Sceau Origines sont ajoutés après les quatre réalisations existantes, dans le filtre Web. Captures réelles d’accueil dans `public/images/projects/mauvais-temps.jpg` et `sceau-origines.jpg`, affichées sans déformation. Descriptions et liens : `src/data/portfolio.ts` ; traductions : `src/data/translations.json`. Aucune technologie, année ou URL de dépôt n’est supposée.

## Captures fournies (V32)
Les deux derniers projets utilisent les captures utilisateur `mauvais-temps.png` et `sceau-origines.png` dans `public/images/projects/`, avec leurs dimensions réelles et sans rognage. La capture Sceau présente la section cadeau.
