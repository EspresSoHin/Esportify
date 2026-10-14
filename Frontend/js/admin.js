// ================================
// DASHBOARD ADMIN
// ================================

async function moderationAction(id, action) {
  const ev = EVENTS_DATA.find(e => e.id === id);
  if (!ev) return;

    const statutMap = {
    'valider':   { id_statut: 2, visible: true },
    'refuser':   { id_statut: 5, visible: false },
    'suspendre': { id_statut: 4, visible: false },
  };

  const payload = statutMap[action];
  if (!payload) return;

  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      showToast('Erreur : ' + (err.detail || 'inconnue'));
      return;
    }

    // Mise à jour locale
    ev.statut = action === 'valider' ? 'valide' : action === 'refuser' ? 'refuse' : 'suspendu';
    ev.visible = payload.visible;

    const toastMap = {
      'valider':   'Événement validé — maintenant visible publiquement',
      'refuser':   'Événement refusé',
      'suspendre': 'Événement suspendu',
    };
    showToast(toastMap[action]);

    renderModeration();
    renderAdminDashboard();

  } catch(error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}

async function promouvoir(userId, nouveauRole) {
  const user = USERS_DATA.find(u => u.id === userId);
  if (!user) return;

  const token = sessionStorage.getItem('token');
  
  const role = ROLES_DATA.find(r => r.nom.toLowerCase() === nouveauRole);
  if (!role) return;

  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ id_role: role.id })
    });

    if (!response.ok) {
      showToast('Erreur lors de la promotion.');
      return;
    }

    user.role = nouveauRole;
    showToast(`${user.pseudo} promu ${nouveauRole}`);
    renderUtilisateurs();

  } catch(error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}

function renderAdminDashboard() {
  const attente = EVENTS_DATA.filter(ev => ev.statut === 'en_attente').length;
  const suspendus = EVENTS_DATA.filter(ev => ev.statut === 'suspendu').length; 

  const elAttente = document.getElementById('adminCountAttente');
  const elUsers = document.getElementById('adminCountUsers');
  const elSuspendus = document.getElementById('adminCountSuspendus');
  const pseudo = sessionStorage.getItem('pseudo');
  const subtitle = document.querySelector('#admin-vue-dashboard .page-subtitle .purple');
  
  if (subtitle) subtitle.textContent = pseudo;
  if (elAttente) elAttente.textContent = attente;
  if (elUsers) elUsers.textContent = USERS_DATA.length;
  if (elSuspendus) elSuspendus.textContent = suspendus;

  const tbody = document.getElementById('adminDemandesRecentes');
  if (!tbody) return;

  const recentes = EVENTS_DATA
    .filter(ev => ev.statut === 'en_attente' || ev.statut === 'suspendu')
    .slice(0, 5);

  tbody.innerHTML = recentes.length === 0
    ? `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:2rem;">Aucune demande en attente</td></tr>`
    : recentes.map(ev => `
      <tr>
        <td>${escapeHTML(ev.titre)}</td>
        <td style="color:var(--blue)">${escapeHTML(ev.organisateur)}</td>
        <td>${formatDateShort(ev.dateDebut)}</td>
        <td><span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span></td>
        <td>${renderModerationActions(ev)}</td>
      </tr>`).join('');
}

function renderModerationActions(ev) {
  if (ev.statut === 'valide') {
    return `<div class="action-btns">
      <button class="action-btn btn-stop" onclick="moderationAction(${ev.id}, 'suspendre')" style="font-size:11px; padding:5px 12px;">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
        Suspendre
      </button>
    </div>`;
  }
  return `<div class="action-btns">
    <button class="action-btn btn-start" onclick="moderationAction(${ev.id}, 'valider')" style="font-size:11px; padding:5px 12px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      Valider
    </button>
    <button class="action-btn btn-stop" onclick="moderationAction(${ev.id}, 'refuser')" style="font-size:11px; padding:5px 12px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      Refuser
    </button>
    ${ev.statut !== 'suspendu' ? `
    <button class="btn-icon" onclick="moderationAction(${ev.id}, 'suspendre')" title="Suspendre">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
    </button>` : ''}
  </div>`;
}

function renderModeration() {
  const tbody = document.getElementById('adminModerationList');
  if (!tbody) return;

  const filterStatut = document.getElementById('adminFilterStatut')?.value || 'tous';
  const filterSearch = document.getElementById('adminFilterSearch')?.value.toLowerCase().trim() || '';

  let events = [...EVENTS_DATA];
  if (filterStatut !== 'tous') events = events.filter(ev => ev.statut === filterStatut);
  if (filterSearch) events = events.filter(ev =>
    ev.titre.toLowerCase().includes(filterSearch) ||
    ev.organisateur.toLowerCase().includes(filterSearch)
  );

  tbody.innerHTML = events.length === 0
    ? `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:2rem;">Aucun événement trouvé</td></tr>`
    : events.map(ev => `
      <tr>
        <td>${escapeHTML(ev.titre)}</td>
        <td style="color:var(--blue)">${escapeHTML(ev.organisateur)}</td>
        <td>${ev.joueurs}</td>
        <td>${formatDateShort(ev.dateDebut)}</td>
        <td><span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span></td>
        <td>${renderModerationActions(ev)}</td>
      </tr>`).join('');
}

function renderUtilisateurs() {
  const tbody = document.getElementById('adminUsersList');
  if (!tbody) return;

  const search = document.getElementById('adminUserSearch')?.value.toLowerCase().trim() || '';
  const users = search
    ? USERS_DATA.filter(u => u.pseudo.toLowerCase().includes(search))
    : USERS_DATA;

  tbody.innerHTML = users.map(u => {
    const rolesDisponibles = ['joueur', 'organisateur', 'admin']
      .filter(r => r !== u.role);

    return `
      <tr>
        <td>${escapeHTML(u.pseudo)}</td>
        <td><span class="role-badge role-${u.role}">${u.role.toUpperCase()}</span></td>
        <td style="color:var(--text-muted)">${u.eventsOrganises}</td>
        <td>
          <div class="action-btns">
            ${rolesDisponibles.map(r => `
              <button class="action-btn ${r === 'admin' ? 'btn-stop' : 'btn-start'}"
                      style="font-size:11px; padding:5px 12px;"
                      onclick="promouvoir('${u.id}', '${r}')">
                → ${r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            `).join('')}
          </div>
        </td>
      </tr>`;
  }).join('');
}

function renderAdminAllEvents() {
  const container = document.getElementById('adminAllEventsList');
  if (!container) return;

  container.innerHTML = EVENTS_DATA.map(ev => `
    <a href="event-detail.html?id=${ev.id}" class="event-list-card statut-${ev.statut}">
      ${ev.image
        ? `<img class="elc-image" src="${escapeHTML(ev.image)}" alt="${escapeHTML(ev.titre)}" />`
        : `<div class="elc-image-placeholder">${gameSVG(escapeHTML(ev.titre))}</div>`
      }
      <div class="elc-body">
        <div class="elc-header">
          <h2 class="elc-title">${escapeHTML(ev.titre)}</h2>
          <span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span>
        </div>
        <div class="elc-meta">
          <span>👥 ${ev.joueurs} joueurs</span>
          <span>📅 ${formatDate(ev.dateDebut)}</span>
          <span style="color: ${ev.visible ? '#22c55e' : '#ef4444'}">
            ${ev.visible ? '👁 Public' : '🔒 Masqué'}
          </span>
        </div>
        <div class="elc-footer">
          <span class="elc-organisateur">Par <strong>${escapeHTML(ev.organisateur)}</strong></span>
          <div class="action-btns" onclick="event.preventDefault()">
            <button class="btn-icon" onclick="editEvent(${ev.id})" title="Modifier">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            ${renderModerationActions(ev)}
          </div>
        </div>
      </div>
    </a>
  `).join('');
}

function renderAdminStats() {
  const totalEl = document.getElementById('adminStatTotalEvents');
  const orgasEl = document.getElementById('adminStatOrgas');
  const totalJoueursEl = document.getElementById('adminStatTotalJoueurs');

  if (totalEl) totalEl.textContent = EVENTS_DATA.length;

  const orgas = [...new Set(EVENTS_DATA.map(ev => ev.organisateur))];
  if (orgasEl) orgasEl.textContent = orgas.length;

  if (totalJoueursEl) totalJoueursEl.textContent = INSCRIPTIONS_DATA.length;

  const container = document.getElementById('adminStatsBars');
  if (!container) return;

  const max = Math.max(...orgas.map(o => EVENTS_DATA.filter(ev => ev.organisateur === o).length));
  const colors = ['blue', 'purple', 'green'];
  container.innerHTML = orgas.map((orga, i) => {
    const count = EVENTS_DATA.filter(ev => ev.organisateur === orga).length;
    return `
      <div class="stats-bar-item">
        <div class="stats-bar-label">
          <span>${escapeHTML(orga)}</span>
          <span>${count} event${count > 1 ? 's' : ''}</span>
        </div>
        <div class="stats-bar-track">
          <div class="stats-bar-fill ${colors[i % colors.length]}"
               style="width:${Math.round((count / max) * 100)}%"></div>
        </div>
      </div>`;
  }).join('');
}

function switchAdminView(view) {
  const vues = ['dashboard', 'moderation', 'utilisateurs', 'evenements', 'stats', 'params'];
  vues.forEach(v => {
    const el = document.getElementById(`admin-vue-${v}`);
    if (el) el.style.display = v === view ? 'block' : 'none';
  });

  const map = {
    'dashboard':    'adminSidebarDashboard',
    'moderation':   'adminSidebarModeration',
    'utilisateurs': 'adminSidebarUtilisateurs',
    'evenements':   'adminSidebarEvenements',
    'stats':        'adminSidebarStats',
    'params':       'adminSidebarParams',
  };

  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.getElementById(map[view])?.classList.add('active');

  const bnMap = {
  'dashboard':    'bnAdminDash',
  'moderation':   'bnAdminMod',
  'utilisateurs': 'bnAdminUsers',
  'evenements':   'bnAdminEvents',
  'params':       'bnAdminParams',
  };
  document.querySelectorAll('.bottom-nav-item').forEach(i => i.classList.remove('active'));
  document.getElementById(bnMap[view])?.classList.add('active');
}