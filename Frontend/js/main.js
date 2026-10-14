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
  if (!checkAuth(2)) return;
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
  if (document.getElementById('formConnexion')) {
    renderStatsConnexion();
}

});