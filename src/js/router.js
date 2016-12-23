function onAboutClick() {
    closeMobileNav();
}
function onPortfolioClick() {
    closeMobileNav();
}

function onTitleClick() {
    closeMobileNav();
}
function onContactClick() {
    closeMobileNav();
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
