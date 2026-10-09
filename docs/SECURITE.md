# Bilan de sécurité — Portfolio Joackim DATE

Audit réalisé le 7 octobre 2026. Périmètre : code du portfolio, dépendances npm, export publié, formulaires, liens et atelier de code. Tests contrôlés sur le portfolio uniquement, sans scanner les quatre sites des clients et sans test de saturation.

## Architecture et données

Le déploiement est un export statique Next.js. Aucun serveur Next.js, API métier, compte visiteur, base de données ni téléversement de fichier ne sont exposés par le projet. Le formulaire de contact prépare localement un message ; il ne transmet rien à une API du portfolio. La réservation ouvre la page Google Agenda configurée. Le visiteur choisit ensuite d'envoyer l'email depuis sa messagerie. Les coordonnées professionnelles et les images affichées sont publiques, pas des secrets. Les scores et le code du défi restent locaux à la partie. Le score n'est pas une preuve certifiée et peut être modifié par le visiteur.

## Protections ajoutées

| Zone | Protection |
| --- | --- |
| Page principale | CSP générée après compilation : scripts locaux et empreintes exactes des scripts inline Next.js ; aucun `unsafe-eval` ou `unsafe-inline` pour les scripts ; gestionnaires d'événements HTML bloqués. |
| Ressources | Sources restreintes ; objets et workers interdits ; pas de ressources distantes autorisées par la politique principale. |
| Formulaires | Longueurs et types vérifiés par le code, sujets autorisés explicitement, caractères de contrôle et retours à la ligne dans le nom refusés, emails contrôlés. Le contenu libre reste du texte et est échappé par React. |
| Liens | HTTPS uniquement et refus des identifiants intégrés ; liens projets en nouvel onglet avec `noopener noreferrer`. |
| Rendez-vous | Lien HTTPS vers Google Agenda ; réservation et coordonnées gérées sur cette page externe, sans clé privée Google dans le portfolio. |
| Défi | Runner séparé du portfolio, iframe `sandbox="allow-scripts"` sans `allow-same-origin`, popups, formulaires, navigation du parent ni téléchargements. CSP propre au sandbox : réseau, frames, objets et workers interdits. |
| Échanges du défi | Fenêtre source, origine opaque `null`, jeton renouvelé et structure des messages vérifiés ; résultats et libellés bornés ; jeton invalidé à la fermeture. |
| Charge locale | 64 000 caractères maximum par langage, document de lancement limité à 300 000 caractères, délai de réponse de 5 secondes. |
| Publication | Contrôle des fichiers privés, clés de formats connus, source maps et liens symboliques dans l'export. Les fichiers `.env`, clés et dépôts Git ne doivent jamais être copiés dans `public`. |
| Prévisualisation locale | Contrôle du chemin canonique, protection contre les sorties du dossier, en-têtes `nosniff`, `SAMEORIGIN`, politique de référent et permissions restreintes. Ces en-têtes locaux ne prouvent pas leur présence chez l'hébergeur. |

Les styles inline restent autorisés : Framer Motion utilise ces styles pour les animations. Cette permission CSS ne donne pas l'autorisation d'exécuter des scripts inline arbitraires. Les permissions d'exécution du défi restent confinées à son iframe. Le fichier HTML autonome embarque le runner et conserve le sandbox ; il n'est pas servi avec les en-têtes HTTP d'un hébergeur ni avec la CSP à empreintes de l'export Next.js.

## Vérifications réalisées

Les résultats et nombres de tests ci-dessous relatent l’audit initial du 7 octobre. Les tests de l’ancien calendrier local ont été retirés avec ce module le 9 octobre ; les contrôles du formulaire, du défi et de la réservation Google restent actifs. Voir `NETTOYAGE-FICHIERS.md`.

- `npm audit --json` : aucune vulnérabilité connue signalée pour le verrouillage de dépendances présent au moment de l'audit. Ce résultat n'est pas une garantie contre les vulnérabilités futures.
- 28 tests unitaires : formulaires malveillants, protocoles dangereux, injections de destinataire et de propriétés ICS, faux messages de défi, portraits, mouvements, calendrier et missions.
- Intégration complète : menus, portraits, filtres, liens des projets, services, défi, contact, calendrier, formulaire et fichier autonome.
- Vérification de l'export : chaque script inline autorisé possède l'empreinte SHA-256 exacte et le runner est limité à un contexte sandbox.
- Navigateur sur le site publié : une tentative de lecture de `parent.document` est refusée ; `localStorage` est inaccessible depuis le défi ; une requête `fetch` vers un domaine de test invalide est bloquée par la CSP.
- Navigateur : une solution légitime du menu passe ses cinq tests ; le portrait designer et ses icônes restent animés sous la CSP renforcée. Les seules erreurs supplémentaires observées concernent l'extension du navigateur de test.

Les tests DOM sous JSDOM ne simulent pas les protections d'origine ni l'application de CSP. Les trois essais d'isolation ci-dessus ont donc été exécutés dans un vrai navigateur.

## Limites et suivi

Aucun système ne peut être garanti inviolable. Cette intervention ne certifie pas l'infrastructure de l'hébergeur, sa résistance DDoS, ses règles WAF ni la sécurité des comptes de publication/GitHub. La lecture des en-têtes HTTP du site depuis l'environnement d'exécution a été refusée ; leur présence n'a pas été certifiée. La CSP de la page principale est néanmoins bien visible et active dans le document publié.

`frame-ancestors`, HSTS, `X-Frame-Options`, `X-Content-Type-Options` et `Permissions-Policy` doivent être contrôlés/configurés chez l'hébergeur. `frame-ancestors` n'est pas applicable via une balise meta. Ne pas ajouter simplement `headers()` dans Next.js : ce projet utilise un export statique.

Le timeout du défi ne garantit pas l'interruption d'une boucle JavaScript synchrone infinie : le sandbox isole les droits d'accès, pas un quota matériel CPU/mémoire. Le code n'est ni partagé entre visiteurs ni enregistré sur le serveur. Une exécution résistante au code volontairement gourmand demanderait une architecture de runner dédiée avec quotas.

Pour la suite : protéger les comptes d'hébergement et GitHub par une authentification forte, garder les dépendances à jour, exécuter `npm run audit:security` et `npm run deliver` avant chaque publication. Tout futur agenda connecté, API d'email, authentification ou stockage devra recevoir ses propres contrôles côté serveur, quotas et règles d'accès. Aucun secret ne doit être ajouté au JavaScript envoyé au navigateur.

## Expérience et animations

Le portfolio dispose déjà d'une introduction, d'animations de texte, de reveals de sections, d'interactions des projets, d'un ruban défilant et du portrait animé. Proposition suivante : affiner la transition des vignettes à l'ouverture des services, avec un mouvement court et cohérent avec les titres. Éviter d'ajouter des boucles permanentes partout : le rythme et la lisibilité comptent davantage que le nombre d'effets.
