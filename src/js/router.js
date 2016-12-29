(function() {
    if(window.location.hash) {
        var tag = window.location.hash.split('#')[1];
        filter(tag);
    }
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
