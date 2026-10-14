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


  if (dotsContainer) {
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

