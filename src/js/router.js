var landingContainer = document.getElementById('landing-container');
var aboutContainer = document.getElementById('about-container');
var portfolioContainer = document.getElementById('portfolio-container');
var contactContainer = document.getElementById('contact-container');
var currentContainer;
(function() {
    landingContainer.style.display = "block";
    aboutContainer.style.display = "none";
    portfolioContainer.style.display = "none";
    contactContainer.style.display = "none";
    currentContainer = landingContainer;
})();

function swap(newContainer) {
    newContainer.style.display = "block";
    currentContainer.style.display = "none";
    currentContainer = newContainer;
    closeMobileNav();
}
function onAboutClick() {
    swap(aboutContainer);
}
function onPortfolioClick() {
    swap(portfolioContainer);
}

function onTitleClick() {
    swap(landingContainer);
}
function onContactClick() {
    swap(contactContainer);
}

function closeMobileNav() {
    var ul = document.getElementsByClassName('side-nav-list')[0];
    var socialMediaUl = document.getElementsByClassName('social-media-list')[0];
    ul.className = "side-nav-list";
    socialMediaUl.className = "social-media-list";
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
