// ================================
// DASHBOARD ORGANISATEUR
// ================================

function canStart(dateDebutStr) {
  const now = new Date();
  const debut = new Date(dateDebutStr);
  const diff = debut - now;
  return diff <= 30 * 60 * 1000 && diff > -2 * 60 * 60 * 1000;
}

function renderOrgaEvents() {
  const tbody = document.getElementById('orgaEventsList');
  if (!tbody) return;

  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === sessionStorage.getItem('pseudo'));

  tbody.innerHTML = mesEvents.map(ev => {
    const peutDemarrer = canStart(ev.dateDebut);
    const actionsHTML = ev.statut === 'en_cours'
      ? `<div class="action-btns">
           <button class="action-btn btn-stop" onclick="stopEvent(${ev.id})">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
             Arrêter
           </button>
         </div>`
      : `<div class="action-btns">
           ${peutDemarrer || ev.statut === 'valide'
             ? `<button class="action-btn btn-start" onclick="startEvent(${ev.id})">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Démarrer
                </button>`
             : `<button class="action-btn btn-start" disabled style="opacity:0.3; cursor:not-allowed;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Démarrer
                </button>`
           }
           <button class="btn-icon" onclick="editEvent(${ev.id})" title="Modifier">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
           </button>
           ${ev.statut === 'en_attente'
             ? `<button class="btn-icon danger" onclick="deleteEvent(${ev.id})" title="Supprimer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                </button>`
             : ''
           }
         </div>`;

    return `
      <tr>
        <td>${escapeHTML(ev.titre)}</td>
        <td>${ev.joueurs}</td>
        <td>${formatDateShort(ev.dateDebut)}</td>
        <td><span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span></td>
        <td>${actionsHTML}</td>
      </tr>`;
  }).join('');
}

function startEvent(id) {
  const ev = EVENTS_DATA.find(e => e.id === id);
  if (!ev) return;
  ev.statut = 'en_cours';
  renderOrgaEvents();
}

function stopEvent(id) {
  const ev = EVENTS_DATA.find(e => e.id === id);
  if (!ev) return;
  ev.statut = 'valide';
  renderOrgaEvents();
}

function editEvent(id) {
  const ev = EVENTS_DATA.find(e => e.id === id);
  if (!ev) return;

  document.getElementById('editEventId').value = ev.id;
  document.getElementById('editTitre').value = ev.titre;
  document.getElementById('editJoueurs').value = ev.joueurs;
  document.getElementById('editDescription').value = ev.description;
  document.getElementById('editDateDebut').value = ev.dateDebut;
  document.getElementById('editDateFin').value = ev.dateFin;
  document.getElementById('editImage').value = ev.image || '';

  document.getElementById('editEventModal').style.display = 'flex';
}

function hideEditModal() {
  document.getElementById('editEventModal').style.display = 'none';
}

async function saveEditEvent() {
  const id = document.getElementById('editEventId').value;
  const token = sessionStorage.getItem('token');

  const payload = {
    titre: document.getElementById('editTitre').value.trim(),
    nb_joueurs_max: parseInt(document.getElementById('editJoueurs').value),
    description: document.getElementById('editDescription').value.trim(),
    date_debut: document.getElementById('editDateDebut').value,
    date_fin: document.getElementById('editDateFin').value,
    image_url: document.getElementById('editImage').value.trim() || null,
  };

  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      showToast('Erreur lors de la modification.');
      return;
    }

    // Mise à jour locale
    const ev = EVENTS_DATA.find(e => e.id === parseInt(id));
    if (ev) {
      ev.titre = payload.titre;
      ev.joueurs = payload.nb_joueurs_max;
      ev.description = payload.description;
      ev.dateDebut = payload.date_debut;
      ev.dateFin = payload.date_fin;
      ev.image = payload.image_url;
    }

    hideEditModal();
    showToast('Événement modifié !');
    renderAdminAllEvents();
    renderModeration();

  } catch(error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}

async function deleteEvent(id) {
  if (!confirm('Supprimer cet événement ?')) return;

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      showToast('Erreur lors de la suppression.');
      return;
    }

    const idx = EVENTS_DATA.findIndex(e => e.id === id);
    if (idx !== -1) EVENTS_DATA.splice(idx, 1);

    showToast('Événement supprimé.');
    renderOrgaEvents();
    renderAllEvents();

  } catch(error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}


function renderParticipants() {
  const select = document.getElementById('participantEventFilter');
  const tbody  = document.getElementById('participantsList');
  if (!select || !tbody) return;

  const val = select.value;
  let liste = [];

  if (val === 'tous') {
    Object.entries(PARTICIPANTS_DATA).forEach(([eventId, participants]) => {
      const ev = EVENTS_DATA.find(e => e.id === parseInt(eventId));
      participants.forEach((p, idx) => {
        liste.push({ ...p, eventId: parseInt(eventId), idx, eventTitre: ev?.titre || '' });
      });
    });
  } else {
    const eventId = parseInt(val);
    liste = (PARTICIPANTS_DATA[eventId] || []).map((p, idx) => ({
      ...p, eventId, idx, eventTitre: ''
    }));
  }

  tbody.innerHTML = liste.map(p => `
    <tr>
      <td>${escapeHTML(p.joueur)}${escapeHTML(p.eventTitre) ? ` <span style="font-size:11px; color:var(--text-muted);">(${escapeHTML(p.eventTitre)})</span>` : ''}</td>
      <td>${formatDateShort(p.dateInscription)}</td>
      <td><span class="elc-badge badge-${p.statut === 'accepte' ? 'valide' : 'en_attente'}">
        ${p.statut === 'accepte' ? 'Accepté' : p.statut === 'refuse' ? 'Refusé' : 'En attente'}
      </span></td>
      <td>
        ${p.statut !== 'refuse'
          ? `<div class="action-btns">
              ${p.statut !== 'accepte'
                ? `<button class="action-btn btn-start" style="font-size:11px; padding:5px 12px;"
                  onclick="acceptParticipant(${p.id})">Accepter</button>`
                : ''
              }
              <button class="action-btn btn-stop" style="font-size:11px; padding:5px 12px;"
                   onclick="rejectParticipant(${p.id})">Refuser</button>
              </div>`
          : `<span style="font-size:12px; color:var(--text-muted);">Refusé</span>`
        }
      </td>
    </tr>
  `).join('');
}


async function rejectParticipant(inscriptionId) {
  if (!confirm('Refuser ce joueur ? Il ne pourra plus se réinscrire.')) return;

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ id_statut_inscription: 3 }) // 3 = refuse
    });

    if (!response.ok) {
      showToast('Erreur lors du refus.');
      return;
    }

    // Mise à jour locale
    for (const eventId in PARTICIPANTS_DATA) {
      const p = PARTICIPANTS_DATA[eventId].find(p => p.id === inscriptionId);
      if (p) { p.statut = 'refuse'; break; }
    }

    showToast('Joueur refusé.');
    renderParticipants();

  } catch(error) {
    console.error(error);
  }
}

async function acceptParticipant(inscriptionId) {
  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ id_statut_inscription: 2 }) // 2 = accepte
    });

    if (!response.ok) {
      showToast('Erreur lors de l\'acceptation.');
      return;
    }

    for (const eventId in PARTICIPANTS_DATA) {
      const p = PARTICIPANTS_DATA[eventId].find(p => p.id === inscriptionId);
      if (p) { p.statut = 'accepte'; break; }
    }

    showToast('Joueur accepté !');
    renderParticipants();

  } catch(error) {
    console.error(error);
  }
}

function initParticipantSelect() {
  const select = document.getElementById('participantEventFilter');
  if (!select) return;

  const pseudo = sessionStorage.getItem('pseudo');
  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === pseudo);

  select.innerHTML =
    `<option value="tous">Tous les événements</option>` +
    mesEvents.map(ev =>
      `<option value="${ev.id}">${escapeHTML(ev.titre)}</option>`
    ).join('');
  renderParticipants();
}

function renderStatsBars() {
  const container = document.getElementById('statsBars');
  if (!container) return;

  const pseudo = sessionStorage.getItem('pseudo');
  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === pseudo);
  
  if (mesEvents.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);">Aucun événement pour l'instant</p>`;
    return;
  }
  
  const max = Math.max(...mesEvents.map(ev => ev.joueurs));
  const colors = ['blue', 'purple', 'green', 'blue', 'purple', 'green'];
  container.innerHTML = mesEvents.map((ev, i) => `
    <div class="stats-bar-item">
      <div class="stats-bar-label">
        <span>${escapeHTML(ev.titre)}</span>
        <span>${ev.joueurs} joueurs</span>
      </div>
      <div class="stats-bar-track">
        <div class="stats-bar-fill ${colors[i % colors.length]}"
             style="width: ${Math.round((ev.joueurs / max) * 100)}%"></div>
      </div>
    </div>
  `).join('');
}

function renderStatsOrga() {
  const pseudo = sessionStorage.getItem('pseudo');

  const subtitle = document.querySelector('#vue-dashboard .page-subtitle .blue');
  if (subtitle) subtitle.textContent = pseudo;

  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === pseudo);
  const actifs = mesEvents.filter(ev => ev.statut === 'valide' || ev.statut === 'en_cours').length;
  const enAttente = mesEvents.filter(ev => ev.statut === 'en_attente').length;
  const totalJoueurs = mesEvents.reduce((acc, ev) => {
    return acc + INSCRIPTIONS_DATA.filter(i => i.id_evenement === ev.id).length;
  }, 0);

  const statValues = document.querySelectorAll('#vue-dashboard .stat-value');
  if (statValues[0]) statValues[0].textContent = actifs;
  if (statValues[1]) statValues[1].textContent = totalJoueurs;
  if (statValues[2]) statValues[2].textContent = enAttente;


  const totalEl = document.getElementById('orgaStatTotalEvents');
  const joueursEl = document.getElementById('orgaStatTotalJoueurs');
  const tauxEl = document.getElementById('tauxRemplissage');

  if (totalEl) totalEl.textContent = mesEvents.length;
  if (joueursEl) joueursEl.textContent = totalJoueurs;
  if (tauxEl) tauxEl.textContent = STATS_ORGA.tauxRemplissage;
}


function switchDashboardView(view) {
  const vues = ['dashboard', 'tous-events', 'participants', 'statistiques', 'parametres'];
  vues.forEach(v => {
    const el = document.getElementById(`vue-${v}`);
    if (el) el.style.display = v === view ? 'block' : 'none';
  });

  const sidebarIds = {
    'dashboard':    ['sidebarDashboard'],
    'tous-events':  ['sidebarEvents'],
    'participants': ['sidebarParticipants'],
    'statistiques': ['sidebarStats'],
    'parametres':   ['sidebarParams'],
  };

  document.querySelectorAll('.sidebar-item').forEach(item => item.classList.remove('active'));
  (sidebarIds[view] || []).forEach(id => {
    document.getElementById(id)?.classList.add('active');
  });

  const bnMap = {
  'dashboard':    'bnDashboard',
  'tous-events':  'bnEvents',
  'participants': 'bnParticipants',
  'statistiques': 'bnStats',
  'parametres':   'bnParams',
  };
  document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(bnMap[view])?.classList.add('active');
}

function showCreateModal() {
  document.getElementById('createModal').style.display = 'flex';
}
function hideCreateModal() {
  document.getElementById('createModal').style.display = 'none';
}

async function creerEvenement() {
  const titre     = document.getElementById('newTitre').value.trim();
  const joueurs   = parseInt(document.getElementById('newJoueurs').value);
  const desc      = document.getElementById('newDescription').value.trim();
  const dateDebut = document.getElementById('newDateDebut').value;
  const dateFin   = document.getElementById('newDateFin').value;
  const image     = document.getElementById('newImage').value.trim() || null;
  const discussion = document.getElementById('newDiscussion').checked;

  if (!titre || !joueurs || !desc || !dateDebut || !dateFin) {
    alert('Merci de remplir tous les champs obligatoires (*).');
    return;
  }
const id_organisateur = parseInt(sessionStorage.getItem('id'));
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
        discussion_active: discussion,
        id_organisateur
      })
    });

    if (!response.ok) {
      const err = await response.json();
      alert(err.detail || 'Erreur lors de la création.');
      return;
    }

  const newEvent = await response.json();

  EVENTS_DATA.push(mapEvent(newEvent, null));

  hideCreateModal();
  renderOrgaEvents();
  showToast('Événement créé — en attente de validation.');

  } catch(error) {
    console.error(error);
    alert('Erreur de connexion au serveur.');
  }
}