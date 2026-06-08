//Je vais m'en servir de JSON et stocker mes petites datas hehehehehehheehehehe

// ================================
// AUTH PROVISOIRE
// ================================

const USER_SESSION = {
  connecte: false,
  pseudo: null
};

// ================================
// PHOTOS GALERIE
// ================================

const GALLERY_DATA = [
  { src: "Assets/gallerie1.webp", alt: "Freestyle event" },
  { src: "Assets/gallerie2.webp", alt: "Ravo esport" },
  { src: "Assets/gallerie3.webp", alt: "Fortnite tournament" },
  { src: "Assets/gallerie4.webp", alt: "Gamers united" },
  { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80", alt: "Gaming tournament moment" },
];

// ================================
// DONNÉES EVENTS
// ================================
const EVENTS_DATA = [
  {
    id: 1,
    titre: "Valorant Open Cup",
    description: "Tournoi ouvert à tous les niveaux. Format best-of-3, bracket simple élimination. Rejoins ton équipe et prouve ta valeur sur la scène compétitive.",
    joueurs: 32,
    organisateur: "ExpresSohin",
    dateDebut: "2026-08-10T18:00",
    dateFin: "2026-08-10T23:00",
    statut: "valide",
    visible: true,
    image: "Assets/valorant-thumb.webp",
    discussion: true
  },
  {
    id: 2,
    titre: "League of Legends 5V5",
    description: "Clash inter-communautés en 5v5. Toutes les lignes représentées. Format suisse sur 4 rounds puis top 8 en élimination directe.",
    joueurs: 10,
    organisateur: "RavoGaming",
    dateDebut: "2026-08-28T20:00",
    dateFin: "2026-08-28T23:30",
    statut: "en_cours",
    visible: true,
    image: "Assets/leagueoflegend-thumb.webp",
    discussion: true
  },
  {
    id: 3,
    titre: "CS2 Pro Series",
    description: "Compétition semi-pro réservée aux joueurs Master Guardian et au-dessus. Maps en rotation officielle. Prix : 150€ pour le gagnant.",
    joueurs: 64,
    organisateur: "ExpresSohin",
    dateDebut: "2026-09-04T15:00",
    dateFin: "2026-09-04T21:00",
    statut: "en_attente",
    visible: true,
    image: "Assets/cs2-thumb.webp",
    discussion: false
  },
  {
    id: 4,
    titre: "Fortnite Solo Cup",
    description: "Battle royale solo, 100 joueurs, 3 parties comptabilisées. Score = éliminations × 3 + placement. Rejoins le lobby 15 minutes avant le début.",
    joueurs: 100,
    organisateur: "Syluskitten109",
    dateDebut: "2026-09-12T19:00",
    dateFin: "2026-09-12T22:00",
    statut: "en_attente",
    visible: true,
    image: "Assets/fortnite-thumb.webp",
    discussion: true
  },
  {
    id: 5,
    titre: "Rocket League 2v2",
    description: "Duos uniquement. Format round-robin puis playoffs. Classement basé sur les points de buts et victoires. Inscription par équipe obligatoire.",
    joueurs: 24,
    organisateur: "RavoGaming",
    dateDebut: "2026-08-20T17:00",
    dateFin: "2026-08-20T20:00",
    statut: "valide",
    visible: true,
    image: "Assets/rocketleague-thumb.webp",
    discussion: false
  },
  {
    id: 6,
    titre: "FIFA 26 Weekend League",
    description: "Tournoi FIFA du weekend. Poules de 4 puis élimination directe. Tous niveaux acceptés, ambiance décontractée garantie.",
    joueurs: 16,
    organisateur: "Syluskitten109",
    dateDebut: "2026-09-20T14:00",
    dateFin: "2026-09-20T18:00",
    statut: "valide",
    visible: true,
    image: "Assets/fifa26-thumb.webp",
    discussion: true
  }
];


// ================================
// PAGE DÉTAIL EVENT
// ================================
const DISCUSSION_DATA = {
  1: [
    { auteur: "RavoGaming", date: "2026-08-01T14:32", message: "Hâte de participer, quelqu'un cherche une équipe ?" },
    { auteur: "Syluskitten109", date: "2026-08-02T09:15", message: "Moi ! Je suis main duelist, DM moi sur Discord." },
    { auteur: "ExpresSohin", date: "2026-08-03T18:44", message: "Rappel : le check-in ouvre 30 minutes avant le début. Soyez ponctuels !" }
  ],
  2: [
    { auteur: "Syluskitten109", date: "2026-08-10T11:00", message: "On cherche un support pour compléter notre roster, Bronze+ accepté." },
    { auteur: "RavoGaming", date: "2026-08-10T12:30", message: "GG à tous les participants du round 1 !" }
  ],
  4: [
    { auteur: "ExpresSohin", date: "2026-08-15T20:00", message: "Les builds recommandés pour ce meta ? Perso je pars full aggro." },
    { auteur: "Syluskitten109", date: "2026-08-16T08:10", message: "Sniper + heal c'est OP en fin de game, à tester." }
  ],
  6: [
    { auteur: "RavoGaming", date: "2026-08-20T15:00", message: "Qui joue quel club ? J'ai pris le PSG pour représenter 🔵🔴" }
  ]
};


// ================================
// DASHBOARD ORGANISATEUR
// ================================

const PARTICIPANTS_DATA = {
  1: [
    { joueur: "Syluskitten109", dateInscription: "2026-07-28T10:15", statut: "accepte" },
    { joueur: "RavoGaming",     dateInscription: "2026-07-29T14:32", statut: "accepte" },
    { joueur: "NightFox99",     dateInscription: "2026-07-30T09:00", statut: "en_attente" },
    { joueur: "BladeStrike",    dateInscription: "2026-07-31T17:45", statut: "en_attente" },
    { joueur: "ZeroLag",        dateInscription: "2026-08-01T11:20", statut: "refuse" },
  ],
  2: [
    { joueur: "Syluskitten109", dateInscription: "2026-08-05T08:00", statut: "accepte" },
    { joueur: "NightFox99",     dateInscription: "2026-08-06T12:10", statut: "en_attente" },
  ],
  3: [
    { joueur: "BladeStrike",    dateInscription: "2026-08-10T16:00", statut: "accepte" },
    { joueur: "ZeroLag",        dateInscription: "2026-08-11T09:30", statut: "en_attente" },
    { joueur: "RavoGaming",     dateInscription: "2026-08-12T14:00", statut: "accepte" },
  ]
};


// ================================
// JOUEUR EVENTS ET SCORE
// ================================

const MES_EVENTS_DATA = [
  {
    id: 1,
    titre: "Valorant Open Cup",
    dateDebut: "2026-08-10T18:00",
    statut: "valide",
    modifiable: true
  },
  {
    id: 2,
    titre: "CS2 Amateur Series",
    dateDebut: "2026-07-01T15:00",
    statut: "non_valide",
    modifiable: false
  },
  {
    id: 3,
    titre: "Fortnite Solo Cup",
    dateDebut: "2026-09-12T19:00",
    statut: "en_attente",
    modifiable: true
  }
];

const MES_SCORES_DATA = [
  { evenement: "Valorant Open Cup",    date: "2026-06-10", position: 3,  points: 450, resultat: "Top 3" },
  { evenement: "League of Legends 5V5", date: "2026-05-28", position: 1,  points: 800, resultat: "Victoire" },
  { evenement: "CS2 Pro Series",        date: "2026-04-04", position: 12, points: 120, resultat: "Éliminé" },
  { evenement: "Rocket League 2v2",     date: "2026-03-20", position: 2,  points: 600, resultat: "Top 3" },
];


// ================================
// SVG ICONS
// ================================


const GAME_ICONS = {
  valorant: `<svg width="28" height="28" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path d="M467.51,248.83c-18.4-83.18-45.69-136.24-89.43-149.17A91.5,91.5,0,0,0,352,96c-26.89,0-48.11,16-96,16s-69.15-16-96-16a99.09,99.09,0,0,0-27.2,3.66C89,112.59,61.94,165.7,43.33,248.83c-19,84.91-15.56,152,21.58,164.88,26,9,49.25-9.61,71.27-37,25-31.2,55.79-40.8,119.82-40.8s93.62,9.6,118.66,40.8c22,27.41,46.11,45.79,71.42,37.16C487.1,399.86,486.52,334.74,467.51,248.83Z" fill="none" stroke="#45ACF7" stroke-miterlimit="10" stroke-width="32"/>
    <circle cx="292" cy="224" r="20" fill="#45ACF7"/>
    <path d="M336,288a20,20,0,1,1,20-19.95A20,20,0,0,1,336,288Z" fill="#45ACF7"/>
    <circle cx="336" cy="180" r="20" fill="#45ACF7"/>
    <circle cx="380" cy="224" r="20" fill="#45ACF7"/>
    <line x1="160" y1="176" x2="160" y2="272" stroke="#45ACF7" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
    <line x1="208" y1="224" x2="112" y2="224" stroke="#45ACF7" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/>
  </svg>`,

  league: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 16 16" fill="none">
    <path d="M3 0L6.58579 3.58579L3.58579 6.58579L0 3V0H3Z" fill="#B734BE"/>
    <path d="M6.70711 12.2929L8.20711 13.7929L6.79289 15.2071L4.5 12.9142L2.99771 14.4165C2.99923 14.4441 3 14.472 3 14.5C3 15.3284 2.32843 16 1.5 16C0.671573 16 0 15.3284 0 14.5C0 13.6716 0.671573 13 1.5 13C1.52802 13 1.55586 13.0008 1.5835 13.0023L3.08579 11.5L0.792893 9.20711L2.20711 7.79289L3.70711 9.29289L13 0H16V3L6.70711 12.2929Z" fill="#B734BE"/>
    <path d="M14.5 16C13.6716 16 13 15.3284 13 14.5C13 14.472 13.0008 14.4441 13.0023 14.4165L10.0858 11.5L13.7929 7.79289L15.2071 9.20711L12.9142 11.5L14.4165 13.0023C14.4441 13.0008 14.472 13 14.5 13C15.3284 13 16 13.6716 16 14.5C16 15.3284 15.3284 16 14.5 16Z" fill="#B734BE"/>
  </svg>`,

  cs2: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.9999 8.16234L21.9999 8.23487C21.9999 9.09561 21.9999 9.52598 21.7927 9.8781C21.5855 10.2302 21.2093 10.4392 20.4569 10.8572L19.6636 11.298C20.2102 9.44984 20.3926 7.46414 20.4601 5.76597C20.4629 5.69316 20.4662 5.61945 20.4695 5.54497L20.4718 5.49279C21.1231 5.71896 21.4887 5.88758 21.7168 6.20408C22 6.59692 22 7.11873 21.9999 8.16234Z" fill="#45ACF7"/>
    <path d="M2 8.16234L2 8.23487C2.00003 9.09561 2.00004 9.52598 2.20723 9.8781C2.41442 10.2302 2.79063 10.4392 3.54305 10.8572L4.33681 11.2982C3.79007 9.45001 3.60767 7.46422 3.54025 5.76597C3.53736 5.69316 3.5341 5.61945 3.53081 5.54497L3.5285 5.49266C2.87701 5.7189 2.51126 5.88752 2.2831 6.20408C1.99996 6.59692 1.99997 7.11873 2 8.16234Z" fill="#45ACF7"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.3771 2.34674C15.2531 2.15709 13.7837 2 12.0002 2C10.2166 2 8.74724 2.15709 7.62318 2.34674C6.48445 2.53887 5.91508 2.63494 5.43937 3.22083C4.96365 3.80673 4.98879 4.43998 5.03907 5.70647C5.21169 10.0544 6.14996 15.4851 11.25 15.9657V19.5H9.8198C9.34312 19.5 8.93271 19.8365 8.83922 20.3039L8.65 21.25H6C5.58579 21.25 5.25 21.5858 5.25 22C5.25 22.4142 5.58579 22.75 6 22.75H18C18.4142 22.75 18.75 22.4142 18.75 22C18.75 21.5858 18.4142 21.25 18 21.25H15.35L15.1608 20.3039C15.0673 19.8365 14.6569 19.5 14.1802 19.5H12.75V15.9657C17.8503 15.4853 18.7886 10.0545 18.9612 5.70647C19.0115 4.43998 19.0367 3.80673 18.5609 3.22083C18.0852 2.63494 17.5159 2.53887 16.3771 2.34674Z" fill="#45ACF7"/>
  </svg>`,

  fortnite: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#45ACF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>`,

  rocket: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#45ACF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 2C12 2 7 6 7 13l5 3 5-3c0-7-5-11-5-11z"/><path d="M7 13c-2 1-3 3-3 5h16c0-2-1-4-3-5"/><line x1="12" y1="16" x2="12" y2="21"/>
  </svg>`,

  fifa: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#45ACF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
  </svg>`,

  default: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#45ACF7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="M6 12h4M8 10v4M15 11h.01M18 11h.01"/>
  </svg>`
};


// ================================
// DATAS ADMIN
// ================================

const USERS_DATA = [
  { pseudo: "ExpresSohin",    role: "organisateur", eventsOrganises: 3 },
  { pseudo: "RavoGaming",     role: "organisateur", eventsOrganises: 2 },
  { pseudo: "Syluskitten109", role: "joueur",        eventsOrganises: 0 },
  { pseudo: "NightFox99",     role: "joueur",        eventsOrganises: 0 },
  { pseudo: "BladeStrike",    role: "joueur",        eventsOrganises: 0 },
  { pseudo: "ZeroLag",        role: "joueur",        eventsOrganises: 0 },
  { pseudo: "AdminEsportify", role: "admin",         eventsOrganises: 0 },
];

function badgeLabel(statut) {
  const labels = {
    valide: 'Validé',
    en_cours: 'En cours',
    en_attente: 'En attente',
    suspendu: 'Suspendu',
    refuse: 'Refusé'
  };
  return labels[statut] || statut;
}