// ================================
// ENCODAGE HTML
// ================================

function escapeHTML(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ================================
// UTILITAIRES
// ================================

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateFull(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function badgeLabel(statut) {
  const labels = { valide: 'Validé', en_cours: 'En cours', en_attente: 'En attente', suspendu: 'Suspendu', refuse: 'Refusé' };
  return labels[statut] || statut;
}

function gameSVG(titre) { //voir comment enlever le hardcode
  const t = titre.toLowerCase();
  if (t.includes('valorant')) return GAME_ICONS.valorant;
  if (t.includes('legend'))   return GAME_ICONS.league;
  if (t.includes('cs2') || t.includes('counter')) return GAME_ICONS.cs2;
  if (t.includes('fortnite')) return GAME_ICONS.fortnite;
  if (t.includes('rocket'))   return GAME_ICONS.rocket;
  if (t.includes('fifa'))     return GAME_ICONS.fifa;
  return GAME_ICONS.default;
}

function showToast(message) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}