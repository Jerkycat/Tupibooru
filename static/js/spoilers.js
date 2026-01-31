document.addEventListener('DOMContentLoaded', function() {
    const spoilers = document.querySelectorAll('span.spoiler');
    
    spoilers.forEach(spoiler => {
        spoiler.addEventListener('click', function() {
            this.classList.toggle('revealed');
        });
    });
});