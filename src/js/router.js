(function() {
    if(window.location.hash) {
        var tag = window.location.hash.split('#')[1];
        filter(tag);
    }

    var nav = document.getElementsByClassName('navigation-header')[0];
    var sunnyNavTitle = document.getElementById('sunny-name');

    if (window.location.pathname !== "/") {
        nav.style.backgroundColor = "#000";
        nav.style.removeProperty('transition');
        sunnyNavTitle.style.removeProperty('transition');
        sunnyNavTitle.style.opacity = "1";

    }

    window.addEventListener('scroll',function(evt) {
       if (window.pageYOffset >= 400 && window.location.pathname === '/') {
           //console.log(window.location.pathname);
           nav.style.transition = "background-color 0.4s linear";
           nav.style.backgroundColor = "#000";
           sunnyNavTitle.style.transition = "opacity 0.4s linear";
           sunnyNavTitle.style.opacity = "1";
       } else {
           if (window.location.pathname === '/') {
               nav.style.backgroundColor = "transparent";
               sunnyNavTitle.style.opacity = "0";
           }
       }
    });

    var logoContainers = document.getElementsByClassName('logo-container');
    Array.prototype.forEach.call(logoContainers,function(logoContainer) {
        logoContainer.addEventListener('click', function() {
            logoContainer.focus();
        })
    })
})();
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
    var ul = document.getElementsByClassName('navigation')[0];
    ul.className = "navigation";
}

function onHamburgerClick() {
    var nav = document.getElementsByClassName('navigation-header')[0];
    var ul = document.getElementsByClassName('navigation')[0];
    if (ul.className === 'navigation') {
        ul.className += " responsive";
        nav.style.backgroundColor = "#000";
    } else {
        ul.className = "navigation";
    }
    // var socialMediaUl = document.getElementsByClassName('social-media-list')[0];
    // if (socialMediaUl.className === 'social-media-list') {
    //     socialMediaUl.className += " responsive";
    // } else {
    //     socialMediaUl.className = "social-media-list";
    // }
}

function filter(tag) {
    var blogPosts = document.getElementsByClassName('blog-post');
    Array.prototype.forEach.call(blogPosts, function(post) {
        if (tag === 'showall') {
            post.removeAttribute('hidden');
        } else {
            if (containsTag(post,tag)) {
                post.removeAttribute('hidden');
            } else {
                post.setAttribute('hidden','true')
            }
        }
    });
}

function containsTag(post,tag) {
    var hasTag = false;
    Array.prototype.forEach.call(post.getElementsByTagName('li'), function(t) {
        if (t.innerHTML === tag) {
            hasTag = true;
        }
    });
    return hasTag;
}

function setActive(tag) {
    var tagNames = document.getElementsByClassName('blog-post-tag');
    Array.prototype.forEach.call(tagNames, function(t) {
        t.classList.remove('active');
    });
    if (tag) {
        tag.classList.add('active');
    }
}

function redirectAndFilter(tag) {
    //console.log(tag);
}
