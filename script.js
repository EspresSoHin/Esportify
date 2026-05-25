document.getElementById('galleryNext').addEventListener('click', function() {
    const slider = document.querySelector('.gallery-track');
    slider.scrollBy({ left: 300, behavior: 'smooth' });
    document.getElementById('galleryPrev').classList.remove('active');
    document.getElementById('galleryNext').classList.add('active');
});