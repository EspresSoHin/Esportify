//Je vais m'en servir de JSON et stocker mes petites datas hehehehehehheehehehe

// ================================
// PHOTOS GALERIE
// ================================

const GALLERY_DATA = [
  { src: "Assets/gallerie1.jpg", alt: "Freestyle event" },
  { src: "Assets/gallerie2.jpg", alt: "Ravo esport" },
  { src: "Assets/gallerie3.jpg", alt: "Fortnite tournament" },
  { src: "Assets/gallerie4.jpg", alt: "Gamers united" },
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
    image: "Assets/valorant-thumb.jpg",
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
    image: "Assets/leagueoflegend-thumb.png",
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
    image: "Assets/cs2-thumb.png",
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
    image: "Assets/fortnite-thumb.jpg",
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
    image: "Assets/rocketleague-thumb.png",
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
    image: "Assets/fifa26-thumb.avif",
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