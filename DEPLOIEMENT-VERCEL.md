# Héberger le portfolio sur votre compte Vercel

Ce dépôt contient les sources du portfolio, les six projets, les deux portraits et la configuration de son export statique sur Vercel.

## Déploiement depuis GitHub

1. Décompressez cette archive et ouvrez le dossier `Joackim-Portfolio-Vercel`.
2. Créez un dépôt GitHub dans votre compte et ajoutez le contenu de ce dossier, en gardant `package.json` et `vercel.json` à la racine. Ne publiez ni `.env`, ni `node_modules`, ni `.next`.
3. Dans Vercel : Add New → Project → importez ce dépôt.
4. Utilisez les réglages ci-dessous. Le fichier `vercel.json` les déclare déjà.
5. Cliquez sur Deploy. Vercel attribuera une adresse `vercel.app` à votre projet.

| Réglage | Valeur |
| --- | --- |
| Framework Preset | Other |
| Root Directory | ./ |
| Install Command | npm ci |
| Build Command | npm run build |
| Output Directory | out |
| Node.js | 24.x |
| Variables d’environnement | Aucune nécessaire |

Le code utilise Next.js, mais il génère un export statique. Le preset Other permet de publier exactement le dossier `out`, après le traitement de sécurité, sans imposer un serveur Next.js.

## Tester localement

Installez Node.js 24.15 ou plus récent dans la branche 24, puis :

```bash
npm ci
npm run dev
```

Ouvrez http://localhost:3000. Pour vérifier la compilation de production :

```bash
npm run deliver
npm run preview
```

Ouvrez http://localhost:4173. Cette archive allégée contient les sources complètes. Vercel génère automatiquement le dossier `out` pendant le déploiement. Le fichier autonome peut être généré localement avec `npm run deliver`.

## Modifier plus tard

- Projets, descriptions et coordonnées : `src/data/portfolio.ts`.
- Captures et portraits : `public/images/`.
- Traductions : `src/data/translations.json`.
- Styles et adaptations mobiles : `src/styles/` (importés par `src/app/globals.css`).
- Rendez-vous : `profile.bookingUrl` dans `src/data/portfolio.ts`, présentation dans `src/components/Booking.tsx`.

Un nouveau commit sur le dépôt lié à Vercel déclenchera une nouvelle compilation. La CSP est régénérée pour correspondre aux scripts de chaque build ; ne copiez pas des empreintes CSP d’une ancienne compilation. Les en-têtes de protection supplémentaires sont déclarés dans `vercel.json`.

## Après publication

Vérifiez le loader, la bascule Code/Design, les six liens des projets, les filtres, les services, le défi et le bouton de réservation Google Agenda. Contrôlez aussi FR/EN, clair/sombre, le son activé manuellement et la version mobile. Si le téléphone utilise « Réduire les animations », les animations sont volontairement limitées.

Le formulaire de contact prépare un email à envoyer manuellement. Les rendez-vous se réservent sur la page Google Agenda reliée au bouton de la section Rendez-vous ; aucun backend ni clé privée Google n’est requis. Le lien se modifie dans `src/data/portfolio.ts` (`profile.bookingUrl`). La durée affichée dans `src/components/Booking.tsx` doit correspondre à celle configurée sur Google Agenda (actuellement 45 minutes). Le site reste noindex/nofollow comme la version actuelle ; la finalisation SEO n’est pas effectuée dans cet export.

L’adresse `joackimdate-portfolio.genesisxv.chatgpt.site` appartient à l’hébergement actuel et ne se transfère pas à Vercel. Votre déploiement Vercel aura sa propre adresse ; vous pourrez ensuite y connecter un domaine que vous possédez.

Documentation officielle : https://vercel.com/docs/project-configuration/vercel-json
