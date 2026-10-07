# Vérification — 7 octobre 2026, rendez-vous et mouvements

- Vérification des types, 12 tests unitaires, compilation de production, HTML autonome et tests DOM d’intégration.
- Calendrier : placement des jours, année bissextile, changement d’année, retour de mois, jours passés, dimanche exclu et horizon de six mois.
- Horaires : les créneaux passés à Lomé sont exclus. Les propositions ne sont pas présentées comme des disponibilités synchronisées.
- Formulaire : demande email correctement encodée, récapitulatif focalisé, changement de jour effaçant créneau et demande, aucune transmission automatique.
- ICS : dates UTC, durée de 30 minutes, statut provisoire, événement non bloquant, échappement et longueur des lignes.
- Régression : silhouettes des portraits, survol/sortie/clic, filtres, quatre liens directs des projets, accordéon, défi/rejouer, contact, menu/Échap et images autonomes.
- Mouvement réduit : éléments accessibles sans animations, curseur personnalisé désactivé. Le menu tactile et la bascule sont couverts par les tests DOM.
- Les tests DOM ne constituent pas une validation visuelle. Aucune nouvelle émulation de téléphone réel n’a été disponible pour cette évolution.

L’audit précédent du site modèle a été effectué sur ordinateur. Il ne valide pas le rendu de cette nouvelle version sur téléphone.

## Correction du loader et contrôle direct

- Problème reproduit : loader absent au premier rendu et désactivé après une visite précédente.
- Correction : état initial visible avant activation React, suppression de la restriction par session, commande Revoir l’intro.
- Titres : dévoilement plus lisible et relancé lors d’un retour dans la section ; le mode de réduction des mouvements est préservé.
- Contrôle du site publié sur ordinateur : préférence de mouvement réduit désactivée, portraits chargés ; titre des projets et cartes visibles après défilement.
- Test supplémentaire : un ancien indicateur de visite ne supprime plus l’introduction.

## Mise à jour de l’expérience — 7 octobre 2026

- Atelier plein écran : six missions originales, édition HTML/CSS/JavaScript, aperçu sandboxé, tests, indices, réinitialisation, passage, chronomètre et résultats. Tests unitaires sur erreurs initiales, menu accessible, conflits horaires, file asynchrone, messages et isolation du document.
- Services : vignettes inclinées émergentes, accordéon et transitions de titre/description. Parcours : mise en relief du survol. Contact centré avec messagerie directe et rendez-vous, portraits et projets préservés.
- npm run deliver : TypeScript, 21 tests unitaires, compilation statique, fichier autonome et parcours DOM complet.
- Contrôle navigateur sur la version publiée : ouverture de l’atelier, correction du menu (5/5), changement de mission, indice, accordéon et contact. Un défaut de mesure CSS à l’initialisation de l’iframe a été trouvé : les tests attendent désormais deux frames de rendu, avec aperçu visible pendant l’exécution.
- La réservation reste une demande à confirmer, sans agenda synchronisé. Aucun classement public ou statistique de joueurs n’est inventé.
- Les adaptations étroites et le mouvement réduit sont implémentés ; ce contrôle navigateur n’émule pas un téléphone physique.

Correction complémentaire : parseur RGB du test de contraste (expression régulière échappée dans le code du test), couvert par un test de contraste valide. Les missions de texte, données, créneaux et file sont vérifiées dans le navigateur avec des solutions fonctionnelles.

Le test de focus contrôle aussi la règle :focus-visible du bouton : lancer les tests à la souris ne doit pas invalider un focus réservé au clavier. Cette distinction possède un test de régression.

## Rythme global — passe suivante

- Titres révélés par mots sans altérer leur texte, paragraphes progressifs dans parcours/défi/rendez-vous/contact.
- Arrivée décalée des cartes et des services, mouvements de survol limités à la souris, repère de progression, ouverture mobile et atelier animés, changement de mois fluide.
- Suppression des animations concurrentes dans les cartes ; captures toujours intactes. Réinitialisation des offsets magnétiques au scroll/clavier. Cibles tactiles de 44px et marges de sécurité en bas.
- npm run deliver réussi : 24 tests unitaires, compilation et version autonome, parcours DOM complet. Nouveaux tests : conservation des textes, lisibilité en mouvement réduit, progression bornée à 0–100 %.
- Adaptations tactiles et étroites implémentées ; aucun contrôle sur téléphone physique n’est revendiqué.

## Finition des interactions mobiles

Menu natif en dialogue, focus initial et fermeture par Échap/fond/destination ; accès complet depuis la navigation du bas. Barre compacte et cibles plus confortables. Calendrier : jours de 44px de hauteur, flèches de 44px, horaire de 48px, arrivée au formulaire sur largeur inférieure à 760px sans ouverture du clavier. Défi : fermeture accessible au défilement, éditeur à 16px et contenu long contenu dans son panneau. Régressions du menu incluses dans le parcours DOM.

### Contrôle des vues étroites dans le navigateur

Vues encadrées de 320, 390 et 430 px : aucun débordement horizontal de page ; menu accessible depuis la barre basse, fermeture et navigation vers le calendrier ; choix date/horaire et accès au formulaire ; lancement et fermeture du défi, éditeur à 16 px et en-tête fixe. La scrollbar desktop prend 15 px dans ces vues. Ce contrôle ne remplace pas un essai sur téléphone physique. La page temporaire de contrôle a été retirée avant publication finale.
