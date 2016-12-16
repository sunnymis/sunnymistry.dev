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

function onHamburgerClick() {
    var ul = document.getElementsByClassName('side-nav-list')[0];
    if (ul.className === 'side-nav-list') {
        ul.className += " responsive";
    } else {
        ul.className = "side-nav-list";
    }
    var socialMediaUl = document.getElementsByClassName('social-media-list')[0];
    if (socialMediaUl.className === 'social-media-list') {
        socialMediaUl.className += " responsive";
    } else {
        socialMediaUl.className = "social-media-list";
    }
}
