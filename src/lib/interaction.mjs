import {translate} from './localization.mjs';
export function portraitMode(pinned, hovered) { return pinned || hovered ? 'design' : 'dev'; }
export function safeExternalUrl(value) {
  try { const u = new URL(value); return u.protocol==='https:'&&!u.username&&!u.password ? u.href : ''; } catch { return ''; }
}
export function makeBrief({name, email, service, message},language='fr') {
  if(language==='en')return `PROJECT REQUEST — JOACKIM DATE\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nNeed: ${translate(service,language)}\n\n${message.trim()}\n\nThis document was prepared locally. It has not been sent.\n`;
  return `DEMANDE DE PROJET — JOACKIM DATE\n\nNom : ${name.trim()}\nEmail : ${email.trim()}\nBesoin : ${service}\n\n${message.trim()}\n\nCe document a été préparé localement. Il n’a pas été envoyé.\n`;
}
export const challenges = [
  { label:'L’œil du designer', question:'Quel bouton indique le plus clairement l’action attendue ?', choices:['Cliquez ici','Envoyer mon message','Continuer'], answer:1, explanation:'Un libellé précis annonce le résultat du clic et évite les ambiguïtés.' },
  { label:'Le réflexe du développeur', question:'Pour une action cliquable utilisable au clavier, quel élément choisir ?', choices:['Un <div> avec un clic','Une image de bouton','Un <button>'], answer:2, explanation:'Un bouton HTML possède déjà le comportement clavier et la sémantique attendus.' },
  { label:'Le détail qui change tout', question:'Comment rendre un changement de portrait accessible sur téléphone ?', choices:['Ajouter un bouton de bascule','Compter sur le survol','Changer toutes les secondes'], answer:0, explanation:'Un contrôle explicite fonctionne au toucher comme au clavier, et laisse le choix au visiteur.' },
];
