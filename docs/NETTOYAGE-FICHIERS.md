# Nettoyage des fichiers — 9 octobre 2026

Contrôle du dépôt courant : imports des composants et bibliothèques depuis les entrées Next.js, chemins d’images dans les contenus et le manifeste responsive, imports CSS, scripts npm, génération hors ligne et références des tests.

## Fichiers retirés

| Fichier | Motif |
| --- | --- |
| `public/images/projects/afripul-support.jpg` | Ancienne capture sans référence ; la carte utilise le PNG et les variantes WebP. |
| `public/images/projects/cave-du-bourgeois.jpg` | Même motif. |
| `public/images/projects/mauvais-temps.jpg` | Même motif. |
| `public/images/projects/sceau-origines.jpg` | Même motif. |
| `src/lib/booking.mjs` | Ancien calendrier local de propositions/ICS, jamais importé par le site actuel ; réservation remplacée par Google Agenda. |
| `tests/booking.test.mjs` | Quatre tests propres à ce module retiré. |

Les quatre JPG représentaient 279 799 octets, soit environ 273 Kio. Ils n’étaient pas téléchargés par les cartes : leur suppression allège les fichiers déployés, pas le poids chargé par une visite qui ne les demandait pas. Git conserve leur historique.

Les tests de sécurité et de traduction conservent les contrôles du formulaire et des libellés utilisés ; seules les assertions portant sur l’ancien ICS et les emails de réservation ont été retirées. Le parcours d’intégration couvre toujours le lien Google Agenda en français et en anglais.

## Fichiers conservés

- Tous les composants et bibliothèques restants dans `src` sont reliés aux entrées de l’application par leurs imports.
- PNG : secours pour les navigateurs sans WebP, génération des variantes et export HTML autonome.
- WebP : toutes les variantes sont présentes dans le manifeste utilisé par les images responsive.
- Polices WOFF : référencées par les styles et l’export autonome. Licences OFL : accompagnent la distribution des polices et doivent être conservées.
- `public/challenge-runner.html` : exécution isolée du défi et version autonome.
- Scripts : appelés par les commandes npm ou par la génération du fichier autonome.
- Configurations, tests actifs et instructions de maintenance : nécessaires au développement et à la publication.
- `docs/qa/projects-captures.jpg` : preuve visuelle historique, conservée hors de `public` ; non distribuée dans l’export du site.
- `docs/qa/verification.md` : historique des contrôles, explicitement signalé comme tel.

## Entretien

Le fichier généré `OUVRIR-LE-PORTFOLIO.html` est ignoré par Git. Les dossiers `node_modules`, `.next` et `out` l’étaient déjà ; ils se régénèrent avec les commandes du projet. Aucune ancienne archive de travail externe au dépôt n’a été supprimée.

La documentation de déploiement indique désormais les chemins actuels des styles et du lien de réservation. Le README pointe vers le portfolio sur Vercel.

Ce contrôle porte sur les fichiers du dépôt et leurs références. Il ne certifie pas que chaque export, chaque traduction historique ou chaque règle CSS est nécessaire ; ces suppressions demanderaient un audit distinct des comportements dynamiques.

## Validation après nettoyage

`npm run deliver` réussi : lint, formatage, typage, 35 tests unitaires, compilation statique, export autonome, parcours DOM complet et contrôle des empreintes CSP. Les huit images originales et toutes les variantes référencées restent présentes. Aucun composant ou style actif n’a été modifié ; aucun nouveau contrôle sur téléphone physique n’est revendiqué.
