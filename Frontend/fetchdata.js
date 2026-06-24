// ================================
// INITIALISATION POUR API
// ================================

const API_URL = 'http://127.0.0.1:8000' // je changerai avec le lien render après

// ================================
// DONNÉES EVENTS
// ================================

let EVENTS_DATA = [];

//TENTATIVE 1

async function fetchEvents(){
    try{
        const response = await fetch(`${API_URL}/events`)

        if(!response.ok) {
            throw new Error("API FAILED HAHA")
        }

        EVENTS_DATA = await response.json();
        EVENTS_DATA = EVENTS_DATA.map(ev => ({
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
            organisateur: ev.id_organisateur
}));

        document.dispatchEvent(new CustomEvent('dataReady')); //on créer un event pour activer le script après
        
        console.log("dataReady dispatché");
    }
    catch(error){
        console.error(error)
    }
}

fetchEvents()