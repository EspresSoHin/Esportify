// ================================
// INITIALISATION POUR API
// ================================

const API_URL = 'http://127.0.0.1:8000' // je changerai avec le lien render après

// ================================
// DONNÉES EVENTS
// ================================

let EVENTS_DATA = [];
let USERS_DATA = [];
let PARTICIPANTS_DATA = {};
let INSCRIPTIONS_DATA = [];
let FAVORIS_DATA = [];
let SCORES_DATA = [];


//Petit mapping des events

function mapEvent(ev, usersData) {
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
    statut: STATUTS_EVENEMENT[ev.id_statut] || 'inconnu',
    organisateur: usersData
      ? usersData.find(u => u.id === ev.id_organisateur)?.pseudo || 'inconnu'
      : sessionStorage.getItem('pseudo')
  };
}


//Les fetch API!

async function fetchAllData(){
    try{
        const [responseEvents, responseUsers, responseInscriptions, responseFavoris, responseScores] = await Promise.all([
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
        ]);

        EVENTS_DATA = responseEvents.map(ev => mapEvent(ev, responseUsers));

        USERS_DATA = responseUsers.map(u => ({
            pseudo: u.pseudo,
            role: ROLES[u.id_role] || 'joueur',
            eventsOrganises: responseEvents.filter(ev => ev.id_organisateur === u.id).length
        }));

        INSCRIPTIONS_DATA = responseInscriptions;
        FAVORIS_DATA = responseFavoris;
        SCORES_DATA = responseScores;

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

fetchAllData()