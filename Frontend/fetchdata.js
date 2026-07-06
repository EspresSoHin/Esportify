// ================================
// INITIALISATION POUR API
// ================================

const API_URL = 'https://esportify-qr3z.onrender.com' // je changerai avec le lien render après

// ================================
// DONNÉES GÉNÉRALES
// ================================

let EVENTS_DATA = [];
let USERS_DATA = [];
let PARTICIPANTS_DATA = {};
let INSCRIPTIONS_DATA = [];
let FAVORIS_DATA = [];
let SCORES_DATA = [];
let STATUTS_EVENEMENT = [];
let ROLES_DATA = [];


// ================================
// MAPPING DES DONNÉES
// ================================

function mapEvent(ev, usersData, statutsData) {
  return {
    id: ev.id,
    titre: ev.titre,
    description: ev.description,
    joueurs: ev.nb_joueurs_max,
    dateDebut: ev.date_debut,
    dateFin: ev.date_fin,
    visible: ev.visible,
    discussion: ev.discussion_active,
    image: ev.image_url,
    statut: statutsData.find(s => s.id === ev.id_statut)?.nom || 'inconnu',
    organisateur: usersData
      ? usersData.find(u => u.id === ev.id_organisateur)?.pseudo || 'inconnu'
      : sessionStorage.getItem('pseudo')
  };
}

// ================================
// FETCH API
// ================================

async function fetchAllData(){
    try{
        const [responseEvents, responseUsers, responseInscriptions, responseFavoris, responseScores, responseStatutsEv, responseRoles] = await Promise.all([ 
            fetch(`${API_URL}/events`).then(r => {
                if (!r.ok) throw new Error(`Events API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/users`).then(r => {
                if (!r.ok) throw new Error(`Users API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/inscriptions`).then(r => {
                if (!r.ok) throw new Error(`Inscriptions API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/favoris`).then(r => {
                if (!r.ok) throw new Error(`Favoris API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/scores`).then(r => {
                if (!r.ok) throw new Error(`Scores API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/statuts_evenement`).then(r => {
                if (!r.ok) throw new Error(`Statut evenement API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/roles`).then(r => {
                if (!r.ok) throw new Error(`Roles API erreur ${r.status}`);
                return r.json();
            })
        ]);

        EVENTS_DATA = responseEvents.map(ev => mapEvent(ev, responseUsers, responseStatutsEv));

        USERS_DATA = responseUsers.map(u => {
            const role = responseRoles.find(r => r.id === u.id_role);
            return {
                id: u.id,
                pseudo: u.pseudo,
                email: u.email,
                role: role?.nom.toLowerCase() || 'joueur',
                eventsOrganises: responseEvents.filter(ev => ev.id_organisateur === u.id).length
            };
    });

        INSCRIPTIONS_DATA = responseInscriptions;
        FAVORIS_DATA = responseFavoris;
        SCORES_DATA = responseScores;
        STATUTS_EVENEMENT = responseStatutsEv;
        ROLES_DATA = responseRoles;

        responseInscriptions.forEach(insc => {
            const user = responseUsers.find(u => u.id === insc.id_utilisateur);
            if (!PARTICIPANTS_DATA[insc.id_evenement]) {
                PARTICIPANTS_DATA[insc.id_evenement] = [];
            }
            PARTICIPANTS_DATA[insc.id_evenement].push({
                id: insc.id,
                joueur: user?.pseudo || 'inconnu',
                dateInscription: insc.date_inscription,
                statut: insc.id_statut_inscription === 1 ? 'en_attente' : 
                        insc.id_statut_inscription === 2 ? 'accepte' : 'refuse'
            });
        });

        document.dispatchEvent(new CustomEvent('dataReady')); //on créer un event pour activer le script après
        
    }
    catch(error){
        console.error(error)
    }
}

// ================================
// CHECK SESSION STORAGE
// ================================

async function checkSession() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/me`, {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem('pseudo', data.pseudo);
            sessionStorage.setItem('id', data.id);
            sessionStorage.setItem('id_role', data.id_role);
        } else {
            sessionStorage.clear();
        }
    } catch(error) {
        console.error("Erreur checkSession:", error);
    }
}

async function init() {
    await checkSession();
    updateNavbar();
    await fetchAllData();
}

init();