// ================================
// LOADER
// ================================

const SCRIPTS = [
  'js/data.js',
  'js/utils.js',
  'js/auth.js',
  'js/ui.js',
  'js/events.js',
  'js/profile.js',
  'js/orga.js',
  'js/joueur.js',
  'js/admin.js',
  'js/main.js',
  'js/fetchdata.js',
];

SCRIPTS.forEach(src => {
  const s = document.createElement('script');
  s.src = src;
  s.async = false;  // garde l'ordre d'exécution
  document.body.appendChild(s);
});

//on enlevera les deux lignes data et fetchdata si ça marche.