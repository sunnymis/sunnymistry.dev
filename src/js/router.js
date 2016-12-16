var landingContainer = document.getElementById('landing-container');
var aboutContainer = document.getElementById('about-container');

(function() {
    landingContainer.style.display = "block";
    aboutContainer.style.display = "none";
})();

function swap(newContainer, oldContainer) {
    newContainer.style.display = "block";
    oldContainer.style.display = "none";
}
function onAboutClick() {
    swap(aboutContainer,landingContainer);
}

function onTitleClick() {
    swap(landingContainer,aboutContainer);
}
