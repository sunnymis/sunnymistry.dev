var landingContainer = document.getElementById('landing-container');
var aboutContainer = document.getElementById('about-container');

(function() {
    landingContainer = document.getElementById('landing-container');
    landingContainer.removeAttribute('hidden');
})();

function swap(newContainer, oldContainer) {
    newContainer.removeAttribute('hidden');
    oldContainer.setAttribute('hidden','true');
}
function onAboutClick() {
    swap(aboutContainer,landingContainer);
}

function onTitleClick() {
    swap(landingContainer,aboutContainer);
}
