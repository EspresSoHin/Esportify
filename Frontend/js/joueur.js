// ================================
// ESPACE JOUEUR
// ================================

function renderMesEvents() {
  const tbody = document.getElementById('mesEventsList');
  if (!tbody) return;

  const userId = parseInt(sessionStorage.getItem('id'));
  const mesInscriptions = INSCRIPTIONS_DATA.filter(i => i.id_utilisateur === userId);
  
  if (mesInscriptions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:2rem;">Aucune inscription pour l'instant</td></tr>`;
    return;
  }

  tbody.innerHTML = mesInscriptions.map(insc => {
    const ev = EVENTS_DATA.find(e => e.id === insc.id_evenement);
    if (!ev) return '';

    const badgeClass = insc.id_statut_inscription === 2 ? 'badge-valide'
      : insc.id_statut_inscription === 1 ? 'badge-en_attente'
      : insc.id_statut_inscription === 3 ? 'badge-refuse'
      : 'badge-non_valide';
    const badgeText = insc.id_statut_inscription === 2 ? 'Accepté'
      : insc.id_statut_inscription === 1 ? 'En attente'
      : insc.id_statut_inscription === 3 ? 'Refusé'
      : 'Non validé';

    const modifiable = insc.id_statut_inscription === 1;

    return `
      <tr>
        <td>${escapeHTML(ev.titre)}</td>
        <td>${formatDateShort(ev.dateDebut)}</td>
        <td><span class="elc-badge ${badgeClass}">${badgeText}</span></td>
        <td>
          ${modifiable
            ? `<button class="action-btn btn-stop" style="font-size:11px; padding:5px 12px;"
                 onclick="annulerInscription(${insc.id})">
                 Se désinscrire
               </button>`
            : `<span style="font-size:12px; color:var(--text-muted);">Non modifiable</span>`
          }
        </td>
      </tr>`;
  }).join('');
}

async function annulerInscription(inscriptionId) {
  if (!confirm('Se désinscrire de cet événement ?')) return;

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });

    if (!response.ok) {
      showToast('Erreur lors de la désinscription.');
      return;
    }

    // Pour retirer de INSCRIPTIONS_DATA localement
    INSCRIPTIONS_DATA = INSCRIPTIONS_DATA.filter(i => i.id !== inscriptionId);
    showToast('Désinscription effectuée.');
    renderMesEvents();

  } catch(error) {
    console.error(error);
  }
}


function renderScores() {
  const tbody = document.getElementById('scoresTable');
  if (!tbody) return;

  const userId = parseInt(sessionStorage.getItem('id'));
  const mesScores = SCORES_DATA.filter(s => s.id_utilisateur === userId);

  if (mesScores.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">Aucun score pour l'instant</td></tr>`;
    return;
  }


  tbody.innerHTML = mesScores.map(s => {
    const ev = EVENTS_DATA.find(e => e.id === s.id_evenement);
    const couleur = s.position === 1 ? 'var(--blue)'
      : s.position <= 3 ? 'var(--purple)'
      : 'var(--text-muted)';

    return `
      <tr>
        <td>${escapeHTML(ev?.titre || 'Événement inconnu')}</td>
        <td>${new Date(s.date_score).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td style="font-family: var(--font-heading); font-size: 18px; color: ${couleur};">#${s.position}</td>
        <td style="color: var(--blue); font-weight: 600;">${s.points} pts</td>
        <td><span class="elc-badge ${s.position === 1 ? 'badge-en_cours' : s.position <= 3 ? 'badge-valide' : 'badge-en_attente'}">${escapeHTML(s.resultat || '-')}</span></td>
      </tr>`;
  }).join('');
}

function showJoueurCreateModal() {
  document.getElementById('joueurCreateModal').style.display = 'flex';
}
function hideJoueurCreateModal() {
  document.getElementById('joueurCreateModal').style.display = 'none';
}

async function submitJoueurEvent() {
  const titre      = document.getElementById('joueurTitre').value.trim();
  const joueurs    = parseInt(document.getElementById('joueurJoueurs').value);
  const desc       = document.getElementById('joueurDescription').value.trim();
  const dateDebut  = document.getElementById('joueurDateDebut').value;
  const dateFin    = document.getElementById('joueurDateFin').value;
  const image      = document.getElementById('joueurImage').value.trim() || null;

  if (!titre || !joueurs || !desc || !dateDebut || !dateFin) {
    alert('Merci de remplir tous les champs obligatoires (*).');
    return;
  }

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({
        titre,
        description: desc,
        nb_joueurs_max: joueurs,
        date_debut: dateDebut,
        date_fin: dateFin,
        image_url: image,
        discussion_active: false,
        id_organisateur: parseInt(sessionStorage.getItem('id'))
      })
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.detail || 'Erreur lors de la création.');
      return;
    }

    hideJoueurCreateModal();
    showToast('Événement soumis — en attente de validation.');
    renderMesEvents();

  } catch(error) {
    console.error(error);
    alert('Erreur de connexion au serveur.');
  }
}


function switchJoueurView(view) {
  const vues = ['home', 'events', 'favoris', 'classement', 'params-joueur'];
  vues.forEach(v => {
    const el = document.getElementById(`vue-${v}`);
    if (el) el.style.display = v === view ? 'block' : 'none';
  });

  const sidebarIds = {
    'home':         ['sidebarHome'],
    'events':       ['sidebarEvents'],
    'favoris':      ['sidebarFavoris'],
    'classement':   ['sidebarClassement'],
    'params-joueur':['sidebarParams'],
  };

  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  (sidebarIds[view] || []).forEach(id => {
    document.getElementById(id)?.classList.add('active');
  });

  const bnMap = {
  'home':          'bnHome',
  'events':        'bnJEvents',
  'favoris':       'bnFavoris',
  'classement':    'bnClassement',
  'params-joueur': 'bnJParams',
  };
  document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(bnMap[view])?.classList.add('active');
}

function renderHomeCards() {
  const container = document.getElementById('homeEventCards');
  if (!container) return;

  const userId = parseInt(sessionStorage.getItem('id'));

  const mesFavoris = FAVORIS_DATA.filter(f => f.id_utilisateur === userId);
  const mesInscriptions = INSCRIPTIONS_DATA.filter(i => i.id_utilisateur === userId);

  // On combine les deux sans doublons
  const eventIds = [...new Set([
    ...mesFavoris.map(f => f.id_evenement),
    ...mesInscriptions.map(i => i.id_evenement)
  ])];

  const cards = eventIds.map(eventId => {
    const ev = EVENTS_DATA.find(e => e.id === eventId);
    if (!ev) return '';

    const isFavori = mesFavoris.some(f => f.id_evenement === eventId);
    const inscription = mesInscriptions.find(i => i.id_evenement === eventId);

    const borderClass = ev.statut === 'en_cours' ? 'green-border'
      : inscription ? 'blue-border'
      : 'purple-border';

    const badge = ev.statut === 'en_cours'
      ? '<span class="event-badge badge-live">En cours</span>'
      : inscription
      ? '<span class="event-badge badge-join">Inscrit</span>'
      : '<span class="event-badge badge-fav">Favoris</span>';

    const btnText = ev.statut === 'en_cours' ? '▶ Rejoindre maintenant'
      : ev.statut === 'valide' ? '⏱ Pas encore démarré'
      : '↺ Voir les détails';

    return `
      <div class="event-card ${borderClass}">
        <div class="event-card-header">
          <h3 class="event-title">${escapeHTML(ev.titre)}</h3>
          ${badge}
        </div>
        <div class="event-meta">
          <span>👥 ${ev.joueurs} joueurs</span>
          <span>📅 ${formatDateShort(ev.dateDebut)}</span>
        </div>
        <button class="event-btn" onclick="window.location.href='event-detail.html?id=${ev.id}'">${btnText}</button>
      </div>`;
  });

  // Card "Parcourir"
  cards.push(`
    <div class="event-card empty" onclick="window.location.href='events.html'" style="cursor:pointer;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      Parcourir les événements
    </div>`);

  container.innerHTML = cards.join('');
}

function renderFavoris() {
  const container = document.getElementById('favorisGrid');
  if (!container) return;

  const userId = parseInt(sessionStorage.getItem('id'));
  const mesFavoris = FAVORIS_DATA.filter(f => f.id_utilisateur === userId);

  if (mesFavoris.length === 0) {
    container.innerHTML = `
      <div class="event-card empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        Aucun favori pour l'instant
      </div>
      <div class="event-card empty" onclick="window.location.href='events.html'" style="cursor:pointer;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        Parcourir les événements
      </div>`;
    return;
  }

  const cards = mesFavoris.map(f => {
    const ev = EVENTS_DATA.find(e => e.id === f.id_evenement);
    if (!ev) return '';
    return `
      <div class="event-card purple-border">
        <div class="event-card-header">
          <h3 class="event-title">${escapeHTML(ev.titre)}</h3>
          <span class="event-badge badge-fav">Favoris</span>
        </div>
        <div class="event-meta">
          <span>👥 ${ev.joueurs} joueurs</span>
          <span>📅 ${formatDateShort(ev.dateDebut)}</span>
        </div>
        <button class="event-btn" onclick="window.location.href='event-detail.html?id=${ev.id}'">
          Voir l'événement →
        </button>
      </div>`;
  });

  cards.push(`
    <div class="event-card empty" onclick="window.location.href='events.html'" style="cursor:pointer;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      Parcourir les événements
    </div>`);

  container.innerHTML = cards.join('');
}


function renderStatsJoueur() {
  const userId = parseInt(sessionStorage.getItem('id'));

  const tournoisJoues = INSCRIPTIONS_DATA.filter(i => i.id_utilisateur === userId).length;
  const victoires = SCORES_DATA.filter(s => s.id_utilisateur === userId && s.position === 1).length;
  const favoris = FAVORIS_DATA.filter(f => f.id_utilisateur === userId).length;

  document.querySelector('.stat-value.blue').textContent = tournoisJoues;
  document.querySelector('.stat-value.purple').textContent = victoires;
  document.querySelector('.stat-value.white').textContent = favoris;
}


function renderStatsConnexion() {
  const tournoisActifs = EVENTS_DATA.filter(ev => 
    ev.statut === 'valide' || ev.statut === 'en_cours'
  ).length;
  
  const totalJoueurs = INSCRIPTIONS_DATA.length;

  const allEvActifs = document.getElementById('activeTournaments');
  const allJoueurs = document.getElementById('totalPlayers');

  if (allEvActifs) allEvActifs.textContent = `${tournoisActifs} tournois actifs`;
  if (allJoueurs) allJoueurs.textContent = `${totalJoueurs} joueurs`;
}