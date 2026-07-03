document.addEventListener('dataReady', () => {
  if (document.getElementById('eventsList')) {
  renderEvents(EVENTS_DATA.filter(ev => ev.visible));
  document.getElementById('filterSort').addEventListener('change', applyFilters);
  document.getElementById('filterStatut').addEventListener('change', applyFilters);
  document.getElementById('filterSearch').addEventListener('input', applyFilters);
}
  if (document.getElementById('orgaEventsList')) {
      if (!checkAuth(3)) return;
  renderStatsOrga();
  renderOrgaEvents();
  renderAllEvents();
  initParticipantSelect();
  renderStatsBars();
  fillParamsForm()

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
  if (document.getElementById('vue-home')) {
    if (!checkAuth(1)) return;

    const pseudo = sessionStorage.getItem('pseudo');
    const profileName = document.querySelector('.profile-name');
    if (profileName) profileName.textContent = pseudo?.toUpperCase() || 'JOUEUR';

  renderStatsJoueur();
  renderHomeCards();
  renderFavoris();
  renderMesEvents();
  renderScores();
  fillParamsForm()

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
  if (document.getElementById('admin-vue-dashboard')) {
  renderAdminDashboard();
  renderModeration();
  renderUtilisateurs();
  renderAdminAllEvents();
  renderAdminStats();
  fillParamsForm()

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
  if (document.getElementById('tournamentCards')) {
  renderCarousel();
}
  if (document.getElementById('eventDetail')) {
    renderDetail();
}
  if (document.getElementById('orgaEventsList')) {
    if (!checkAuth(3)) return; // 3 = organisateur
    renderOrgaEvents();
  }

  if (document.getElementById('admin-vue-dashboard')) {
    if (!checkAuth(2)) return; // 2 = admin
    renderAdminDashboard();
  }

  if (document.getElementById('formConnexion')) {
    renderStatsConnexion();
}

});


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

let toastTimeout;

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

async function handleLogin() {
  hideAuthError('loginError');
  const identifiant = document.getElementById('loginIdentifiant').value.trim();
  const password    = document.getElementById('loginPassword').value;

  if (!identifiant || !password) {
    showAuthError('loginError', 'Merci de remplir tous les champs.');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, //on utilise ce content type pour les login en Oauth2PasswordRequestForm
      credentials: 'include', // envoie et reçoit les cookies
      body: new URLSearchParams({ username: identifiant, password: password })
    });

    if (!response.ok) {
      showAuthError('loginError', 'Identifiant ou mot de passe incorrect.');
      return;
    }

    const data = await response.json();

    // On stocke les infos users non sensibles comme dans auth.py
    sessionStorage.setItem('token', data.access_token);
    sessionStorage.setItem('pseudo', data.pseudo);
    sessionStorage.setItem('id', data.id);
    sessionStorage.setItem('id_role', data.id_role);

    showToast(`Bienvenue ${data.pseudo} !`);

    console.log("Login OK, data reçue:", data);

    setTimeout(() => {
      if (data.id_role === 2)      window.location.href = 'dashboard-admin.html';
      else if (data.id_role === 3) window.location.href = 'dashboard-organisateur.html';
      else                         window.location.href = 'espace-joueur.html';
    }, 800);

  } catch(error) {
    showAuthError('loginError', 'Erreur de connexion au serveur.');
    console.error(error);
  }
}


async function handleRegister() {
  hideAuthError('registerError');
  const pseudo    = document.getElementById('regPseudo').value.trim();
  const email     = document.getElementById('regEmail').value.trim();
  const password  = document.getElementById('regPassword').value;
  const confirm   = document.getElementById('regPasswordConfirm').value;
  const cgu       = document.getElementById('regCGU').checked;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!pseudo || !email || !password || !confirm) {
    showAuthError('registerError', 'Merci de remplir tous les champs obligatoires.');
    return;
  }
  if (password !== confirm) {
    showAuthError('registerError', 'Les mots de passe ne correspondent pas.');
    return;
  }
  if (!passwordRegex.test(password)) {
    showAuthError('registerError', 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, et un caractère spécial (@,$,!,%,*,?,&).');
    return;
  }
  if (!cgu) {
    showAuthError('registerError', "Merci d'accepter les conditions d'utilisation.");
    return;
  }

  try {
    console.log("Envoi vers API...", { pseudo, email, password });

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ pseudo, email, password })
    });

    console.log("Réponse reçue:", response.status);

    if (!response.ok) {
      const err = await response.json();
      console.log("Erreur API:", err);
      showAuthError('registerError', err.detail || 'Erreur lors de la création du compte.');
      return;
    }

  showToast('Compte créé ! Tu peux maintenant te connecter.');
  setTimeout(() => switchAuthTab('connexion'), 2000);
    }
    catch(error) {
    showAuthError('registerError', 'Erreur de connexion au serveur.');
    console.error("Erreur catch:", error);
  }
}

if (document.getElementById('formConnexion')) {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const formConn = document.getElementById('formConnexion');
    const formInsc = document.getElementById('formInscription');
    if (formConn && formConn.style.display !== 'none') handleLogin();
    else if (formInsc && formInsc.style.display !== 'none') handleRegister();
  });
  const params = new URLSearchParams(window.location.search);
  const reason = params.get('reason');
  
  if (reason === 'not_logged_in') {
    showToast('Connecte-toi pour accéder à cette page.');
  } else if (reason === 'unauthorized') {
    showToast("Tu n'as pas accès à cette page.");
  }
}


async function handleLogout() {
  await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  sessionStorage.clear();
  window.location.href = 'connexion.html';
}


//Pour verifier si le user est bien connecté sinon pas d'acces au dashboard
function checkAuth(roleRequis) {
  const id = sessionStorage.getItem('id');
  const role = sessionStorage.getItem('id_role');

  if (!id) {
    window.location.href = 'connexion.html?reason=not_logged_in';
    return false;
  }

  if (roleRequis && String(role) !== String(roleRequis)) {
    window.location.href = 'connexion.html?reason=unauthorized';
    return false;
  }

  return true;
}


function updateNavbar() {
  const pseudo = sessionStorage.getItem('pseudo');
  const role = sessionStorage.getItem('id_role');
  const btnJoin = document.querySelector('.btn-join');
  
  if (!btnJoin) return;
  
  if (pseudo) {
    // User connecté
    if (role == 2) {
      btnJoin.textContent = 'ADMIN';
      btnJoin.href = 'dashboard-admin.html';
      btnJoin.style.background = 'var(--purple)';
    } else if (role == 3) {
      btnJoin.textContent = 'MON ESPACE';
      btnJoin.href = 'dashboard-organisateur.html';
    } else {
      btnJoin.textContent = 'MON ESPACE';
      btnJoin.href = 'espace-joueur.html';
    }
  }
  // Si pas connecté — le bouton reste "NOUS REJOINDRE" par défaut
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

async function toggleFavori(eventId, btnEl) {
  if (!sessionStorage.getItem('id')) { //a supprimer et remplacer
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

  events.forEach(ev => {
    if (typeof ev.titre !== 'string') console.log("titre pas string:", ev.id, ev.titre);
    if (typeof ev.organisateur !== 'string') console.log("organisateur pas string:", ev.id, ev.organisateur);
  });

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

  const discussion = DISCUSSION_DATA[ev.id] || [];
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


document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;

  const input = document.getElementById('msgInput');

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

  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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
      `<option value="${ev.id}">${ev.titre}</option>`
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

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
      : 'badge-non_valide';

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

  try {
    const response = await fetch(`${API_URL}/inscriptions/${inscriptionId}`, {
      method: 'DELETE',
      credentials: 'include'
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

function editJoueurEvent(id) {
  alert(`Modification de l'événement #${id} — à connecter au formulaire.`);
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

  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  console.log("favoris filtrés:", FAVORIS_DATA.filter(f => f.id_utilisateur === userId));
 

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

  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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

function promouvoir(pseudo, nouveauRole) {
  const user = USERS_DATA.find(u => u.pseudo === pseudo);
  if (!user) return;
  const ancienRole = user.role;
  user.role = nouveauRole;
  showToast(`${pseudo} promu ${nouveauRole}`);
  renderUtilisateurs();
}

function renderAdminDashboard() {
  const attente = EVENTS_DATA.filter(ev => ev.statut === 'en_attente').length; //a remplacer par les id statuts?
  const suspendus = EVENTS_DATA.filter(ev => ev.statut === 'suspendu').length; //ca aussi?

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
    .filter(ev => ev.statut === 'en_attente' || ev.statut === 'suspendu') //si oui et pareil ici, relecture total du code pour enlever tout ça
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

/////////////////////////////

function fillParamsForm() {
  const pseudo = sessionStorage.getItem('pseudo');
  const pseudoInput = document.getElementById('paramsPseudo');
  const emailInput = document.getElementById('paramsEmail');
  
  if (pseudoInput) pseudoInput.value = pseudo || '';
  
  const user = USERS_DATA.find(u => u.pseudo === pseudo);
  if (emailInput && user) emailInput.value = user.email || '';
}

async function updateProfile() {
  const id = sessionStorage.getItem('id');
  const pseudo = document.getElementById('paramsPseudo').value.trim();
  const email = document.getElementById('paramsEmail').value.trim();
  const password = document.getElementById('paramsPassword').value;
  const confirm = document.getElementById('paramsPasswordConfirm').value;

  const errorEl = document.getElementById('paramsError');
  errorEl.style.display = 'none';

  if (password && password !== confirm) {
    errorEl.textContent = 'Les mots de passe ne correspondent pas.';
    errorEl.style.display = 'block';
    return;
  }

  const payload = { pseudo, email };
  if (password) payload.password = password;

  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const err = await response.json();
      errorEl.textContent = err.detail || 'Erreur lors de la mise à jour.';
      errorEl.style.display = 'block';
      return;
    }

    sessionStorage.setItem('pseudo', pseudo);
    showToast('Profil mis à jour !');

  } catch(error) {
    console.error(error);
    errorEl.textContent = 'Erreur de connexion au serveur.';
    errorEl.style.display = 'block';
  }
}