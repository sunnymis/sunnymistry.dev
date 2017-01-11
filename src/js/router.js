(function() {
    if(window.location.hash) {
        var tag = window.location.hash.split('#')[1];
        filter(tag);
    }
    var nav = document.getElementsByClassName('navigation-header')[0];
    var sunnyNavTitle = document.getElementById('sunny-name');
    window.addEventListener('scroll',function(evt) {
        console.log(window.pageYOffset);
       if (window.pageYOffset >= 400) {
           nav.style.transition = "background-color 1s linear";
           nav.style.backgroundColor = "#000";
           sunnyNavTitle.style.transition = "opacity 1s linear";
           sunnyNavTitle.style.opacity = "1";
       } else {
           nav.style.backgroundColor = "transparent";
           sunnyNavTitle.style.opacity = "0";
       }
    });
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
    var ul = document.getElementsByClassName('side-nav-list')[0];
    var socialMediaUl = document.getElementsByClassName('social-media-list')[0];
    ul.className = "side-nav-list";
    socialMediaUl.className = "social-media-list";
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
    console.log(tag);
}
