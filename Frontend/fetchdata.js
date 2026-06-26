// ================================
// INITIALISATION POUR API
// ================================

const API_URL = 'http://127.0.0.1:8000' // je changerai avec le lien render après

// ================================
// DONNÉES EVENTS
// ================================

let EVENTS_DATA = [];
let USERS_DATA = [];

async function fetchAllData(){
    try{
        const [responseEvents, responseUsers] = await Promise.all([
            fetch(`${API_URL}/events`).then(r => {
                if (!r.ok) throw new Error(`Events API erreur ${r.status}`);
                return r.json();
            }),
            fetch(`${API_URL}/users`).then(r => {
                if (!r.ok) throw new Error(`Users API erreur ${r.status}`);
                return r.json();
            }),
        ]);

        EVENTS_DATA = responseEvents.map(ev => ({
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
            organisateur: responseUsers.find(u => u.id === ev.id_organisateur)?.pseudo || 'inconnu'
}));

        USERS_DATA = responseUsers.map(u => ({
            pseudo: u.pseudo,
            role: ROLES[u.id_role] || 'joueur',
            eventsOrganises: responseEvents.filter(ev => ev.id_organisateur === u.id).length
        }));


        document.dispatchEvent(new CustomEvent('dataReady')); //on créer un event pour activer le script après
        
    }
    catch(error){
        console.error(error)
    }
}

fetchAllData()