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
//apres je dois ajouter escapeHTML sur les variables qui sont injecté dans le DOM pour eviter les faille XSS

// ================================
// LANGUAGE SELECTOR
// ================================

const buttons = document.querySelectorAll(".lang-btn");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});


// ================================
// HAMBURGER MENU
// ================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
});


document.addEventListener('click', (e) => {
  if (!hamburger?.contains(e.target) && !mobileMenu?.contains(e.target)) {
    mobileMenu?.classList.remove('open');
    hamburger?.classList.remove('open');
  }
});


// ================================
// CONNEXION
// ================================

// Mots de passe démo — Bien sur que ça va pas rester à la fin baka gaijin
const DEMO_CREDENTIALS = {
  'Syluskitten109':  { password: 'joueur123',  role: 'joueur' },
  'ExpresSohin':     { password: 'orga123',    role: 'organisateur' },
  'AdminEsportify':  { password: 'admin123',   role: 'admin' },
};

function switchAuthTab(tab) {
  const isConnexion = tab === 'connexion';
  document.getElementById('formConnexion').style.display   = isConnexion ? 'block' : 'none';
  document.getElementById('formInscription').style.display = isConnexion ? 'none'  : 'block';
  document.getElementById('tabConnexion').classList.toggle('active', isConnexion);
  document.getElementById('tabInscription').classList.toggle('active', !isConnexion);
}

function togglePasswordVisibility(inputId, btn) {
  const input = document.getElementById(inputId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.style.color = isHidden ? 'var(--blue)' : 'var(--text-muted)';
}

function fillDemo(role) {
  const map = {
    joueur:       { id: 'Syluskitten109', pw: 'joueur123' },
    organisateur: { id: 'ExpresSohin',    pw: 'orga123' },
    admin:        { id: 'AdminEsportify', pw: 'admin123' },
  };
  const creds = map[role];
  if (!creds) return;
  document.getElementById('loginIdentifiant').value = creds.id;
  document.getElementById('loginPassword').value    = creds.pw;
}

function showAuthError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}
function hideAuthError(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

function handleLogin() {
  hideAuthError('loginError');
  const identifiant = document.getElementById('loginIdentifiant').value.trim();
  const password    = document.getElementById('loginPassword').value;

  if (!identifiant || !password) {
    showAuthError('loginError', 'Merci de remplir tous les champs.');
    return;
  }

  // Simulation auth — à remplacer par un fetch('/api/login')
  const user = DEMO_CREDENTIALS[identifiant];
  if (!user || user.password !== password) {
    showAuthError('loginError', 'Identifiant ou mot de passe incorrect.');
    return;
  }


  USER_SESSION.connecte = true;
  USER_SESSION.pseudo   = identifiant;
  USER_SESSION.role     = user.role;

  showToast(`Bienvenue ${identifiant} !`);

  setTimeout(() => {
    if (user.role === 'admin')        window.location.href = 'dashboard-admin.html';
    else if (user.role === 'organisateur') window.location.href = 'dashboard-organisateur.html';
    else                              window.location.href = 'espace-joueur.html';
  }, 800);
}

function handleRegister() {
  hideAuthError('registerError');
  const pseudo    = document.getElementById('regPseudo').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const role      = 'joueur';
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('regPasswordConfirm').value;
  const cgu       = document.getElementById('regCGU').checked;

  if (!pseudo || !email || !password || !confirm) {
    showAuthError('registerError', 'Merci de remplir tous les champs obligatoires.');
    return;
  }
  if (password !== confirm) {
    showAuthError('registerError', 'Les mots de passe ne correspondent pas.');
    return;
  }
  if (password.length < 6) {
    showAuthError('registerError', 'Le mot de passe doit contenir au moins 6 caractères.');
    return;
  }
  if (!cgu) {
    showAuthError('registerError', "Merci d'accepter les conditions d'utilisation.");
    return;
  }

  // Simulation inscription — à remplacer par fetch('/api/register')
  showToast(
    role === 'organisateur'
      ? 'Demande envoyée — ton compte sera activé après validation.'
      : 'Compte créé ! Tu peux maintenant te connecter.'
  );
  setTimeout(() => switchAuthTab('connexion'), 2000);
}

if (document.getElementById('formConnexion')) {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const formConn = document.getElementById('formConnexion');
    const formInsc = document.getElementById('formInscription');
    if (formConn && formConn.style.display !== 'none') handleLogin();
    else if (formInsc && formInsc.style.display !== 'none') handleRegister();
  });
}


// ================================
// GALERIE
// ================================
let galleryIndex = 0;

function initGallery() {
  const track = document.getElementById('galleryTrack');
  const dotsContainer = document.getElementById('galleryDots');
  if (!track || typeof GALLERY_DATA === 'undefined') return;


  track.innerHTML = GALLERY_DATA.map((img, i) => `
    <div class="gallery-slide${i === 0 ? ' active' : ''}">
      <img src="${escapeHTML(img.src)}" alt="${escapeHTML(img.alt)}" />
    </div>
  `).join('');


  dotsContainer.innerHTML = GALLERY_DATA.map((_, i) => `
    <span class="gdot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})"></span>
  `).join('');

  updateGallery();
}

function updateGallery() {
  const track = document.getElementById('galleryTrack');
  const dots = document.querySelectorAll('.gdot');
  if (!track) return;

  track.style.transform = `translateX(-${galleryIndex * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === galleryIndex));
}

function goToSlide(index) {
  galleryIndex = index;
  updateGallery();
}

document.getElementById('galleryPrev')?.addEventListener('click', () => {
  galleryIndex = (galleryIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
  updateGallery();
});

document.getElementById('galleryNext')?.addEventListener('click', () => {
  galleryIndex = (galleryIndex + 1) % GALLERY_DATA.length;
  updateGallery();
});

// Pour initialiser la galerie
if (document.getElementById('galleryTrack')) {
  initGallery();
}


// ================================
// CARROUSEL TOURNOIS
// ================================

const CAROUSEL_PER_PAGE = 3;
let carouselPage = 0;

function getCarouselEvents() {
  const visible = EVENTS_DATA.filter(ev => ev.visible);
  while (visible.length % CAROUSEL_PER_PAGE !== 0) {
    visible.push(null);
  }
  return visible;
}

function renderCarousel() {
  const container = document.getElementById('tournamentCards');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!container) return;

  const events = getCarouselEvents();
  const totalPages = Math.ceil(events.length / CAROUSEL_PER_PAGE);
  const pageEvents = events.slice(
    carouselPage * CAROUSEL_PER_PAGE,
    (carouselPage + 1) * CAROUSEL_PER_PAGE
  );

  container.innerHTML = pageEvents.map(ev => {
    if (!ev) return `
      <div class="tournament-card empty-card">
        <div class="game-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <p style="color: var(--text-muted); font-size: 13px; opacity: 0.5;">Bientôt disponible</p>
      </div>`;

    return `
      <a href="event-detail.html?id=${ev.id}" class="tournament-card-link" style="text-decoration:none; color:inherit; display:block;">
        <div class="tournament-card${ev.statut === 'en_cours' ? ' featured' : ''}">
            <div class="card-badge ${ev.statut === 'valide' ? 'validated' : ev.statut === 'en_cours' ? 'live' : 'pending'}">
                ${badgeLabel(ev.statut)}
            </div>
            <div class="game-icon">
             ${gameSVG(ev.titre)}
            </div>
            <h3 class="card-title">${escapeHTML(ev.titre)}</h3>
            <div class="card-meta">
                <span>👥 ${ev.joueurs} joueurs</span>
                <span>📅 ${new Date(ev.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
            </div>
        </div>
     </a>`;
  }).join('');


  if (dotsContainer) { //tibo in shape voice: rien à foutre de ton argument
    dotsContainer.innerHTML = Array.from({ length: totalPages }, (_, i) => `
      <span class="dot${i === carouselPage ? ' active' : ''}" onclick="goToCarouselPage(${i})"></span>
    `).join('');
  }

  
  document.getElementById('prevBtn')?.classList.toggle('active', carouselPage > 0);
  document.getElementById('nextBtn')?.classList.toggle('active', carouselPage < totalPages - 1);
}

function goToCarouselPage(page) {
  const events = getCarouselEvents();
  const totalPages = Math.ceil(events.length / CAROUSEL_PER_PAGE);
  carouselPage = Math.max(0, Math.min(page, totalPages - 1));
  renderCarousel();
}

document.getElementById('prevBtn')?.addEventListener('click', () => goToCarouselPage(carouselPage - 1));
document.getElementById('nextBtn')?.addEventListener('click', () => goToCarouselPage(carouselPage + 1));

if (document.getElementById('tournamentCards')) {
  renderCarousel();
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

function gameSVG(titre) {
  const t = titre.toLowerCase();
  if (t.includes('valorant')) return GAME_ICONS.valorant;
  if (t.includes('legend'))   return GAME_ICONS.league;
  if (t.includes('cs2') || t.includes('counter')) return GAME_ICONS.cs2;
  if (t.includes('fortnite')) return GAME_ICONS.fortnite;
  if (t.includes('rocket'))   return GAME_ICONS.rocket;
  if (t.includes('fifa'))     return GAME_ICONS.fifa;
  return GAME_ICONS.default;
}


// ================================
// FAVORIS
// ================================
const FAVORIS = new Set();

function toggleFavori(eventId, btnEl) {
  if (!USER_SESSION.connecte) {
    showToast(`
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
      <a href="connexion.html">Connecte-toi</a> pour sauvegarder cet événement
    `);
    return;
  }

  if (FAVORIS.has(eventId)) {
    FAVORIS.delete(eventId);
    btnEl.classList.remove('active');
    btnEl.title = "Ajouter aux favoris";
    showToast('Retiré des favoris');
  } else {
    FAVORIS.add(eventId);
    btnEl.classList.add('active');
    btnEl.title = "Retirer des favoris";
    showToast('Ajouté aux favoris ★');
    // Plus tard : fetch('/api/favoris', { method: 'POST', body: JSON.stringify({ eventId }) })
  }
}

let toastTimeout;
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
        ? `<img class="elc-image" src="${ev.image}" alt="${escapeHTML(ev.titre)}" />`
        : `<div class="elc-image-placeholder">${gameSVG(ev.titre)}</div>`
      }
      <div class="elc-body">
        <div class="elc-header">
            <h2 class="elc-title">${escapeHTML(ev.titre)}</h2>
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="elc-badge badge-${ev.statut}">${badgeLabel(ev.statut)}</span>
                <button class="btn-favori${FAVORIS.has(ev.id) ? ' active' : ''}" 
                    title="Ajouter aux favoris"
                    onclick="event.preventDefault(); toggleFavori(${ev.id}, this)">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="${FAVORIS.has(ev.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
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
        ? `<img class="elc-image" src="${ev.image}" alt="${escapeHTML(ev.titre)}" />`
        : `<div class="elc-image-placeholder">${gameSVG(ev.titre)}</div>`
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
  <div class="action-btns">
    ${ev.organisateur === ORGA_PSEUDO
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

if (document.getElementById('eventsList')) {
  renderEvents(EVENTS_DATA.filter(ev => ev.visible));
  document.getElementById('filterSort').addEventListener('change', applyFilters);
  document.getElementById('filterStatut').addEventListener('change', applyFilters);
  document.getElementById('filterSearch').addEventListener('input', applyFilters);
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

  const discussion = DISCUSSION_DATA[ev.id] || []; //FAILLE DE SECURITER ICI AVEC INPUT NON SANITIZE 

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
              <span class="info-value blue">${ev.organisateur}</span>
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
          <div class="discussion-list" id="discussionList">
            ${discussion.map(msg => `
              <div class="discussion-msg">
                <div class="msg-avatar">${msg.auteur.slice(0,2).toUpperCase()}</div>
                <div class="msg-content">
                  <div class="msg-header">
                    <strong class="msg-auteur">${escapeHTML(msg.auteur)}</strong>
                    <span class="msg-date">${formatDateShort(msg.date)}</span>
                  </div>
                  <p class="msg-text">${escapeHTML(msg.message)}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="discussion-form">
            <input type="text" id="msgInput" placeholder="Écris un message..." />
            <button onclick="postMessage(${ev.id})">Envoyer</button>
          </div>
        </div>
        ` : ''}
      </div>

      <div class="detail-sidebar">
        <div class="detail-cta-card">
          <p class="cta-price">Gratuit</p>
          <p class="cta-spots">${ev.joueurs} places disponibles</p>
          <a href="connexion.html" class="btn-join" style="display:block; text-align:center; padding: 12px; border-radius: 8px; font-size:14px;">
            S'inscrire au tournoi
          </a>
          <button class="btn-favori${FAVORIS.has(ev.id) ? ' active' : ''}"
          style="width:100%; margin-top:0.75rem; height:38px; border-radius:6px;"
          title="Ajouter aux favoris"
          onclick="toggleFavori(${ev.id}, this)">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="${FAVORIS.has(ev.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
    ${FAVORIS.has(ev.id) ? 'Retiré des favoris' : 'Ajouter aux favoris'}
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
}


document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const input = document.getElementById('msgInput');

  // Vérifie que l'input existe et qu'il est focus
  if (input && document.activeElement === input) {
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));

    postMessage(eventId);
  }
});


function postMessage(eventId) {
  const input = document.getElementById('msgInput');
  const val = input.value.trim();
  if (!val) return;

  const list = document.getElementById('discussionList');
  const now = new Date().toISOString();
  const div = document.createElement('div');
  div.className = 'discussion-msg new-msg';
  div.innerHTML = `
    <div class="msg-avatar">MOI</div>
    <div class="msg-content">
      <div class="msg-header">
        <strong class="msg-auteur">Moi</strong>
        <span class="msg-date">${formatDateShort(now)}</span>
      </div>
      <p class="msg-text">${escapeHTML(val)}</p>
    </div>
  `;
  list.appendChild(div);
  input.value = ''; 
  list.scrollTop = list.scrollHeight;
}

if (document.getElementById('eventDetail')) {
  renderDetail();
}

// ================================
// DASHBOARD ORGANISATEUR
// ================================
const ORGA_PSEUDO = "ExpresSohin";

function canStart(dateDebutStr) {
  const now = new Date();
  const debut = new Date(dateDebutStr);
  const diff = debut - now;
  return diff <= 30 * 60 * 1000 && diff > -2 * 60 * 60 * 1000;
}

function renderOrgaEvents() {
  const tbody = document.getElementById('orgaEventsList');
  if (!tbody) return;

  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === ORGA_PSEUDO);

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
        <td>${ev.titre}</td>
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
  alert(`Modification de l'événement #${id} — à connecter au formulaire.`);
}

function deleteEvent(id) {
  if (!confirm('Supprimer cet événement ?')) return;
  const idx = EVENTS_DATA.findIndex(e => e.id === id);
  if (idx !== -1) EVENTS_DATA.splice(idx, 1);
  renderOrgaEvents();
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
          ? `<button class="action-btn btn-stop" style="font-size:11px; padding:5px 12px;"
               onclick="rejectParticipant(${p.eventId}, ${p.idx})">Refuser</button>`
          : `<span style="font-size:12px; color:var(--text-muted);">Ne peut plus s'inscrire</span>`
        }
      </td>
    </tr>
  `).join('');
}

function rejectParticipant(eventId, idx) {
  if (!confirm('Refuser ce joueur ? Il ne pourra plus se réinscrire.')) return;
  PARTICIPANTS_DATA[eventId][idx].statut = 'refuse';
  renderParticipants();
}

function initParticipantSelect() {
  const select = document.getElementById('participantEventFilter');
  if (!select) return;
  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === ORGA_PSEUDO);
  select.innerHTML =
    `<option value="tous">Tous les événements</option>` +
    mesEvents.map(ev =>
      `<option value="${ev.id}">${ev.titre}</option>`
    ).join('');
  renderParticipants();
}

function renderStatsBars() {
  const container = document.getElementById('statsBars');
  if (!container) return;
  const mesEvents = EVENTS_DATA.filter(ev => ev.organisateur === ORGA_PSEUDO);
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
function createEvent() {
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
  const newEvent = {
    id: EVENTS_DATA.length + 1,
    titre, description: desc, joueurs,
    organisateur: ORGA_PSEUDO,
    dateDebut, dateFin,
    statut: 'en_attente',
    visible: false,
    image, discussion
  };
  EVENTS_DATA.push(newEvent);
  hideCreateModal();
  renderOrgaEvents();
}

if (document.getElementById('orgaEventsList')) {
  renderOrgaEvents();
  renderAllEvents();
  initParticipantSelect();
  renderStatsBars();

  document.getElementById('sidebarDashboard')?.addEventListener('click', e => {
    e.preventDefault(); switchDashboardView('dashboard');
  });
  document.getElementById('sidebarEvents')?.addEventListener('click', e => {
    e.preventDefault(); switchDashboardView('tous-events');
  });
  document.getElementById('sidebarParticipants')?.addEventListener('click', e => {
    e.preventDefault(); switchDashboardView('participants');
  });
  document.getElementById('sidebarStats')?.addEventListener('click', e => {
    e.preventDefault(); switchDashboardView('statistiques');
  });
  document.getElementById('sidebarParams')?.addEventListener('click', e => {
    e.preventDefault(); switchDashboardView('parametres');
  });
}


// ================================
// ESPACE JOUEUR
// ================================
function renderMesEvents() {
  const tbody = document.getElementById('mesEventsList');
  if (!tbody) return;

  tbody.innerHTML = MES_EVENTS_DATA.map(ev => {
    const badgeClass = ev.statut === 'valide' ? 'badge-valide'
      : ev.statut === 'en_attente' ? 'badge-en_attente'
      : 'badge-non_valide';
    const badgeText = ev.statut === 'valide' ? 'Validé'
      : ev.statut === 'en_attente' ? 'En attente'
      : 'Non validé';

    return `
      <tr>
        <td>${escapeHTML(ev.titre)}</td>
        <td>${formatDateShort(ev.dateDebut)}</td>
        <td><span class="elc-badge ${badgeClass}">${badgeText}</span></td>
        <td>
          ${ev.modifiable
            ? `<button class="action-btn btn-start" style="font-size:11px; padding:5px 12px;"
                 onclick="editJoueurEvent(${ev.id})">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                 Modifier
               </button>`
            : `<span style="font-size:12px; color:var(--text-muted);">Non modifiable</span>`
          }
        </td>
      </tr>`;
  }).join('');
}

function renderScores() {
  const tbody = document.getElementById('scoresTable');
  if (!tbody) return;

  tbody.innerHTML = MES_SCORES_DATA.map(s => {
    const couleur = s.position === 1 ? 'var(--blue)'
      : s.position <= 3 ? 'var(--purple)'
      : 'var(--text-muted)';
    return `
      <tr>
        <td>${escapeHTML(s.evenement)}</td>
        <td>${new Date(s.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
        <td style="font-family: var(--font-heading); font-size: 18px; color: ${couleur};">#${s.position}</td>
        <td style="color: var(--blue); font-weight: 600;">${s.points} pts</td>
        <td><span class="elc-badge ${s.position === 1 ? 'badge-en_cours' : s.position <= 3 ? 'badge-valide' : 'badge-en_attente'}">${s.resultat}</span></td>
      </tr>`;
  }).join('');
}

function editJoueurEvent(id) {
  alert(`Modification de l'événement #${id} — à connecter au formulaire.`);
}

function showJoueurCreateModal() {
  document.getElementById('joueurCreateModal').style.display = 'flex';
}
function hideJoueurCreateModal() {
  document.getElementById('joueurCreateModal').style.display = 'none';
}
function submitJoueurEvent() {
  const titre  = document.getElementById('joueurTitre').value.trim();
  const joueurs = parseInt(document.getElementById('joueurJoueurs').value);
  const desc   = document.getElementById('joueurDescription').value.trim();
  const dateDebut = document.getElementById('joueurDateDebut').value;
  const dateFin   = document.getElementById('joueurDateFin').value;
  const image     = document.getElementById('joueurImage').value.trim() || null;

  if (!titre || !joueurs || !desc || !dateDebut || !dateFin) {
    alert('Merci de remplir tous les champs obligatoires (*).');
    return;
  }

  MES_EVENTS_DATA.push({
    id: MES_EVENTS_DATA.length + 1,
    titre, dateDebut,
    statut: 'en_attente',
    modifiable: true
  });

  hideJoueurCreateModal();
  renderMesEvents();
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

if (document.getElementById('vue-home')) {
  renderMesEvents();
  renderScores();

  document.getElementById('sidebarHome')?.addEventListener('click', e => {
    e.preventDefault(); switchJoueurView('home');
  });
  document.getElementById('sidebarEvents')?.addEventListener('click', e => {
    e.preventDefault(); switchJoueurView('events');
  });
  document.getElementById('sidebarFavoris')?.addEventListener('click', e => {
    e.preventDefault(); switchJoueurView('favoris');
  });
  document.getElementById('sidebarClassement')?.addEventListener('click', e => {
    e.preventDefault(); switchJoueurView('classement');
  });
  document.getElementById('sidebarParams')?.addEventListener('click', e => {
    e.preventDefault(); switchJoueurView('params-joueur');
  });
}


// ================================
// DASHBOARD ADMIN
// ================================


function moderationAction(id, action) {
  const ev = EVENTS_DATA.find(e => e.id === id);
  if (!ev) return;

  if (action === 'valider') {
    ev.statut = 'valide';
    ev.visible = true;
    showToast('Événement validé — maintenant visible publiquement');
  } else if (action === 'refuser') {
    ev.statut = 'refuse';
    ev.visible = false;
    showToast('Événement refusé');
  } else if (action === 'suspendre') {
    ev.statut = 'suspendu';
    ev.visible = false;
    showToast('Événement suspendu');
  }

  renderModeration();
  renderAdminDashboard();
}

function promouvoir(pseudo, nouveauRole) {
  const user = USERS_DATA.find(u => u.pseudo === pseudo);
  if (!user) return;
  const ancienRole = user.role;
  user.role = nouveauRole;
  showToast(`${pseudo} promu ${nouveauRole}`);
  renderUtilisateurs();
}

function renderAdminDashboard() {
  const attente = EVENTS_DATA.filter(ev => ev.statut === 'en_attente').length;
  const suspendus = EVENTS_DATA.filter(ev => ev.statut === 'suspendu').length;

  const elAttente = document.getElementById('adminCountAttente');
  const elUsers = document.getElementById('adminCountUsers');
  const elSuspendus = document.getElementById('adminCountSuspendus');
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
        <td>${ev.titre}</td>
        <td style="color:var(--blue)">${ev.organisateur}</td>
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
        <td>${ev.titre}</td>
        <td style="color:var(--blue)">${ev.organisateur}</td>
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
                      onclick="promouvoir('${u.pseudo}', '${r}')">
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
        ? `<img class="elc-image" src="${ev.image}" alt="${ev.titre}" />`
        : `<div class="elc-image-placeholder">${gameSVG(ev.titre)}</div>`
      }
      <div class="elc-body">
        <div class="elc-header">
          <h2 class="elc-title">${ev.titre}</h2>
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
          <span class="elc-organisateur">Par <strong>${ev.organisateur}</strong></span>
          <div class="action-btns" onclick="event.preventDefault()">
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
  if (totalEl) totalEl.textContent = EVENTS_DATA.length;

  const orgas = [...new Set(EVENTS_DATA.map(ev => ev.organisateur))];
  if (orgasEl) orgasEl.textContent = orgas.length;

  const container = document.getElementById('adminStatsBars');
  if (!container) return;

  const max = Math.max(...orgas.map(o => EVENTS_DATA.filter(ev => ev.organisateur === o).length));
  const colors = ['blue', 'purple', 'green'];
  container.innerHTML = orgas.map((orga, i) => {
    const count = EVENTS_DATA.filter(ev => ev.organisateur === orga).length;
    return `
      <div class="stats-bar-item">
        <div class="stats-bar-label">
          <span>${orga}</span>
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

// Init admin
if (document.getElementById('admin-vue-dashboard')) {
  renderAdminDashboard();
  renderModeration();
  renderUtilisateurs();
  renderAdminAllEvents();
  renderAdminStats();

  document.getElementById('adminSidebarDashboard')?.addEventListener('click', e => {
    e.preventDefault(); switchAdminView('dashboard');
  });
  document.getElementById('adminSidebarModeration')?.addEventListener('click', e => {
    e.preventDefault(); switchAdminView('moderation');
  });
  document.getElementById('adminSidebarUtilisateurs')?.addEventListener('click', e => {
    e.preventDefault(); switchAdminView('utilisateurs');
  });
  document.getElementById('adminSidebarEvenements')?.addEventListener('click', e => {
    e.preventDefault(); renderAdminAllEvents(); switchAdminView('evenements');
  });
  document.getElementById('adminSidebarStats')?.addEventListener('click', e => {
    e.preventDefault(); renderAdminStats(); switchAdminView('stats');
  });
  document.getElementById('adminSidebarParams')?.addEventListener('click', e => {
    e.preventDefault(); switchAdminView('params');
  });
}
