// ================================
// PAGE EVENTS — liste publique
// ================================

function renderEvents(events) {
  const container = document.getElementById('eventsList');
  const counter = document.getElementById('resultsCount');
  if (!container) return;

  counter.textContent = `${events.length} événement${events.length > 1 ? 's' : ''}`;

  if (events.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-muted);">
        <div style="font-size: 48px; margin-bottom: 1rem;">🔍</div>
        <p>Aucun événement ne correspond à ta recherche.</p>
      </div>`;
    return;
  }

  container.innerHTML = events.map(ev => `
    <a href="event-detail.html?id=${ev.id}" class="event-list-card statut-${ev.statut}">
      ${ev.image
        ? `<img class="elc-image" src="${escapeHTML(ev.image)}" alt="${escapeHTML(ev.titre)}" />`
        : `<div class="elc-image-placeholder">${gameSVG(ev.titre)}</div>`
      }
      <div class="elc-body">
        <div class="elc-header">
            <h2 class="elc-title">${escapeHTML(ev.titre)}</h2>
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span>
                <button class="btn-favori${FAVORIS_DATA.some(f => f.id_evenement === ev.id && f.id_utilisateur === parseInt(sessionStorage.getItem('id'))) ? ' active' : ''}" 
                    title="Ajouter aux favoris"
                    onclick="event.preventDefault(); toggleFavori(${ev.id}, this)">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="${FAVORIS_DATA.some(f => f.id_evenement === ev.id && f.id_utilisateur === parseInt(sessionStorage.getItem('id'))) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                 </svg>
                </button>
            </div>
        </div>
        <div class="elc-meta">
          <span>👥 ${ev.joueurs} joueurs</span>
          <span>📅 ${formatDate(ev.dateDebut)}</span>
          <span>🏁 ${formatDate(ev.dateFin)}</span>
        </div>
        <div class="elc-footer">
          <span class="elc-organisateur">Par <strong>${escapeHTML(ev.organisateur)}</strong></span>
          <span class="elc-cta">Voir les détails →</span>
        </div>
      </div>
    </a>
  `).join('');
}

// ================================
// PAGE EVENTS — liste dashboard orga
// ================================

function renderAllEvents() {
  const container = document.getElementById('allEventsList');
  if (!container) return;

  const events = EVENTS_DATA.filter(ev => ev.visible);
  container.innerHTML = events.map(ev => `
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
        </div>
        <div class="elc-footer">
  <span class="elc-organisateur">Par <strong>${escapeHTML(ev.organisateur)}</strong></span>
  <div class="action-btns" onclick="event.preventDefault()">
    ${ev.organisateur === sessionStorage.getItem('pseudo')
      ? `
        <button class="btn-icon" onclick="editEvent(${ev.id})" title="Modifier">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="btn-icon danger" onclick="deleteEvent(${ev.id})" title="Supprimer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
        </button>`
      : `<span class="elc-cta">Voir →</span>`
    }
  </div>
</div>
      </div>
    </a>
  `).join('');
}

// ================================
// FILTRES — page events publique
// ================================

function applyFilters() {
  const sort   = document.getElementById('filterSort')?.value;
  const statut = document.getElementById('filterStatut')?.value;
  const search = document.getElementById('filterSearch')?.value.toLowerCase().trim();

  if (!sort) return;

  let results = EVENTS_DATA.filter(ev => ev.visible);

  if (statut && statut !== 'tous') {
    results = results.filter(ev => ev.statut === statut);
  }
  if (search) {
    results = results.filter(ev =>
      ev.titre.toLowerCase().includes(search) ||
      ev.organisateur.toLowerCase().includes(search)
    );
  }

  results.sort((a, b) => {
    if (sort === 'joueurs') return b.joueurs - a.joueurs;
    if (sort === 'organisateur') return a.organisateur.localeCompare(b.organisateur);
    return new Date(a.dateDebut) - new Date(b.dateDebut);
  });

  renderEvents(results);
}


// ================================
// PAGE DÉTAIL EVENT
// ================================
function renderDetail() {
  const container = document.getElementById('eventDetail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const ev = EVENTS_DATA.find(e => e.id === id);

  if (!ev) {
    container.innerHTML = `
      <div style="text-align:center; padding: 6rem 2rem; color: var(--text-muted);">
        <div style="font-size:48px; margin-bottom:1rem;">⏻</div>
        <h2 style="font-family: var(--font-heading); font-size:32px; margin-bottom:1rem;">Événement introuvable</h2>
        <a href="events.html" style="color: var(--blue);">← Retour aux événements</a>
      </div>`;
    return;
  }

  const userId = parseInt(sessionStorage.getItem('id'));
  const isConnected = !!sessionStorage.getItem('id');
  const isInscrit = INSCRIPTIONS_DATA.some(i => i.id_evenement === ev.id && i.id_utilisateur === userId);

  const inscriptionBtn = isConnected
    ? isInscrit
      ? `<button class="btn-join" style="display:block; text-align:center; padding: 12px; border-radius: 8px; font-size:14px; width:100%; border:none; cursor:pointer; background:var(--text-muted);" disabled>
          Déjà inscrit ✓
         </button>`
      : `<button class="btn-join" style="display:block; text-align:center; padding: 12px; border-radius: 8px; font-size:14px; width:100%; border:none; cursor:pointer;"
          onclick="sInscrire(${ev.id})">
          S'inscrire au tournoi
         </button>`
    : `<a href="connexion.html" class="btn-join" style="display:block; text-align:center; padding: 12px; border-radius: 8px; font-size:14px;">
        Se connecter pour s'inscrire
       </a>`;

  
  const isFavori = FAVORIS_DATA.some(f => f.id_evenement === ev.id && f.id_utilisateur === userId);

  container.innerHTML = `
    <div class="detail-hero" ${ev.image ? `style="background-image: url('${escapeHTML(ev.image)}')"` : ''}>
      <div class="detail-hero-overlay">
        <div class="detail-hero-inner">
          <a href="events.html" class="detail-back">← Retour aux événements</a>
          <div class="detail-badges">
            <span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span>
            ${ev.discussion ? '<span class="elc-badge badge-valide">💬 Discussion active</span>' : ''}
          </div>
          <h1 class="detail-title">${escapeHTML(ev.titre)}</h1>
          <p class="detail-organisateur">Organisé par <strong>${escapeHTML(ev.organisateur)}</strong></p>
        </div>
      </div>
    </div>

    <div class="detail-body">
      <div class="detail-main">
        <div class="detail-section">
          <h2 class="detail-section-title">Description</h2>
          <p class="detail-desc">${escapeHTML(ev.description)}</p>
        </div>
        <div class="detail-section">
          <h2 class="detail-section-title">Informations</h2>
          <div class="detail-info-grid">
            <div class="detail-info-item">
              <span class="info-label">👥 Joueurs</span>
              <span class="info-value">${ev.joueurs} participants</span>
            </div>
            <div class="detail-info-item">
              <span class="info-label">📅 Début</span>
              <span class="info-value">${formatDateFull(ev.dateDebut)}</span>
            </div>
            <div class="detail-info-item">
              <span class="info-label">🏁 Fin</span>
              <span class="info-value">${formatDateFull(ev.dateFin)}</span>
            </div>
            <div class="detail-info-item">
              <span class="info-label">🎮 Organisateur</span>
              <span class="info-value blue">${escapeHTML(ev.organisateur)}</span>
            </div>
            <div class="detail-info-item">
              <span class="info-label">👁 Visibilité</span>
              <span class="info-value">${ev.visible ? '✅ Public' : '🔒 Privé'}</span>
            </div>
            <div class="detail-info-item">
              <span class="info-label">📊 Statut</span>
              <span class="elc-badge badge-${ev.statut}" style="margin-top:2px">${badgeLabel(ev.statut)}</span>
            </div>
          </div>
        </div>

        ${ev.discussion ? `
        <div class="detail-section">
          <h2 class="detail-section-title">Fil de discussion</h2>
          <div class="discussion-list" id="discussionList"></div>
            ${isConnected
            ? `<div class="discussion-form">
                <input type="text" id="msgInput" placeholder="Écris un message..." maxlength="500" />
                <button onclick="envoyerMessage(${ev.id})">Envoyer</button>
              </div>`
          : `<p class="msg-text"><a href="connexion.html" style="color:var(--blue)">Connecte-toi</a> pour participer à la discussion.</p>`
          }
        </div>
        ` : ''}

      </div>

      <div class="detail-sidebar">
        <div class="detail-cta-card">
          <p class="cta-price">Gratuit</p>
          <p class="cta-spots">${ev.joueurs} places disponibles</p>
          ${inscriptionBtn}
          <button class="btn-favori${isFavori ? ' active' : ''}"
            style="width:100%; margin-top:0.75rem; height:38px; border-radius:6px;"
            title="${isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
            onclick="toggleFavori(${ev.id}, this)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${isFavori ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            ${isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </button>
          <p class="cta-note">Tu dois être connecté pour t'inscrire</p>
        </div>
        <div class="detail-dates-card">
          <p class="dates-label">📅 Début</p>
          <p class="dates-value">${formatDateShort(ev.dateDebut)}</p>
          <p class="dates-label" style="margin-top:0.75rem">🏁 Fin</p>
          <p class="dates-value">${formatDateShort(ev.dateFin)}</p>
        </div>
      </div>
    </div>
  `;

  if (ev.discussion) loadMessages(ev.id);
}


async function sInscrire(eventId) {
  const userId = parseInt(sessionStorage.getItem('id'));
  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/inscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify({ id_utilisateur: userId, id_evenement: eventId })
    });

    if (!response.ok) {
      const err = await response.json();
      showToast(err.detail || 'Erreur lors de l\'inscription.');
      return;
    }

    const newInscription = await response.json();
    INSCRIPTIONS_DATA.push(newInscription);
    showToast('Inscription envoyée — en attente de validation !');
    renderDetail(); // re-render pour mettre à jour le bouton

  } catch(error) {
    console.error(error);
  }
}

// ================================
// COMMENTAIRES
// ================================


document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const input = document.getElementById('msgInput');

  if (input && document.activeElement === input) {
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));

    envoyerMessage(eventId);
  }
});


function messageHTML(msg) {
  const isAdmin = sessionStorage.getItem('id_role') === '2';
  return `
    <div class="discussion-msg" data-id="${escapeHTML(msg.id)}">
      <div class="msg-avatar">${escapeHTML(msg.author.slice(0, 2).toUpperCase())}</div>
      <div class="msg-content">
        <div class="msg-header">
          <strong class="msg-auteur">${escapeHTML(msg.author)}</strong>
          <span class="msg-date">${formatDateShort(msg.created_at)}</span>
          ${isAdmin
            ? `<button class="btn-icon danger" style="width:24px;height:24px;margin-left:auto;"
                 title="Supprimer" onclick="supprimerMessage('${escapeHTML(msg.id)}')">✕</button>`
            : ''}
        </div>
        <p class="msg-text">${escapeHTML(msg.content)}</p>
      </div>
    </div>`;
}

async function loadMessages(eventId) {
  const list = document.getElementById('discussionList');
  if (!list) return;
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/messages`);
    if (!response.ok) throw new Error(`Messages API erreur ${response.status}`);
    const messages = await response.json();
    list.innerHTML = messages.length
      ? messages.map(messageHTML).join('')
      : `<p class="msg-text discussion-empty">Aucun message pour l'instant.</p>`;
    list.scrollTop = list.scrollHeight;
  } catch (error) {
    console.error(error);
    list.innerHTML = `<p class="msg-text">Impossible de charger la discussion.</p>`;
  }
}

async function envoyerMessage(eventId) {
  const input = document.getElementById('msgInput');
  const content = input.value.trim();
  if (!content) return;

  const token = sessionStorage.getItem('token');
  if (!token) {
    showToast(`<a href="connexion.html">Connecte-toi</a> pour écrire un message`);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/events/${eventId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      credentials: 'include',
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      // en 422, detail est un tableau : on affiche un message générique
      showToast(typeof err.detail === 'string' ? err.detail : 'Message invalide (1 à 500 caractères).');
      return;
    }

    const msg = await response.json();
    const list = document.getElementById('discussionList');
    list.querySelector('.discussion-empty')?.remove();
    list.insertAdjacentHTML('beforeend', messageHTML(msg));
    input.value = '';
    list.scrollTop = list.scrollHeight;
  } catch (error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}

async function supprimerMessage(id) {
  if (!confirm('Supprimer ce message ?')) return;
  const token = sessionStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/messages/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      showToast('Erreur lors de la suppression.');
      return;
    }
    document.querySelector(`.discussion-msg[data-id="${id}"]`)?.remove();
    showToast('Message supprimé.');
  } catch (error) {
    console.error(error);
    showToast('Erreur de connexion au serveur.');
  }
}

// ================================
// FAVORIS
// ================================

async function toggleFavori(eventId, btnEl) {
  if (!sessionStorage.getItem('id')) {
    showToast(`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      <a href="connexion.html">Connecte-toi</a> pour sauvegarder cet événement
    `);
    return;
  }

  const userId = parseInt(sessionStorage.getItem('id'));
  const token = sessionStorage.getItem('token');
  const isFavori = FAVORIS_DATA.some(f => f.id_evenement === eventId && f.id_utilisateur === userId);

  try {
    if (isFavori) {
      // Supprimer le favori
      await fetch(`${API_URL}/favoris/${userId}/${eventId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      FAVORIS_DATA = FAVORIS_DATA.filter(f => !(f.id_evenement === eventId && f.id_utilisateur === userId));
      btnEl.classList.remove('active');
      btnEl.title = "Ajouter aux favoris";
      showToast('Retiré des favoris');

    } else {
      // Ajouter le favori
      const response = await fetch(`${API_URL}/favoris`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ id_utilisateur: userId, id_evenement: eventId })
      });

      const newFavori = await response.json();
      FAVORIS_DATA.push(newFavori);
      btnEl.classList.remove('active');
      btnEl.classList.add('active');
      btnEl.title = "Retirer des favoris";
      showToast('Ajouté aux favoris ★');
    }

  } catch(error) {
    console.error(error);
    showToast('Erreur lors de la mise à jour des favoris.');
  }
}