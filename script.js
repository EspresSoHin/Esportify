let gallerypics = [
    //voir pour simplifier le html et faire array d'image ou json
]

document.getElementById('galleryNext').addEventListener('click', function() {
    const slider = document.querySelector('.gallery-track');
    slider.scrollBy({ left: 300, behavior: 'smooth' });
    imageIndex++;
});



//les trucs à faire:
// - faire le slider de la gallerie d'images carroussel
// - faire le slider des events à venir
// - toggle de la langue
// - faire le changement d'onglet dans le sidebar
// - faire le menu hamburger
// - faire le formulaire de connexion
// - faire le formulaire d'inscription
// - faire le formulaire de contact