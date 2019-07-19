import React from 'react';
import '../../styles/nav.scss';

const Nav = () => {
  const mobileNavItem = (menuItem) => (
    <div class="mobile-menu-item" key={menuItem.id}>
      <a href="/" class="mobile-menu-text">
        <img class="mobile-menu-icon" src={menuItem.icon} />
        { menuItem.name }
      </a>
    </div>
  );

  const desktopNavitem = (menuItem) => <a>{ menuItem.name }</a>

  const navItems = [
    {
      id: 1,
      name: 'Home',
      icon: 'icons/home-icon.png',
    },
    {
      id: 2,
      name: 'Work',
      icon: 'icons/resume-icon.png',
    },
    {
      id: 3,
      name: 'Projects',
      icon: 'icons/projects-icon.png',
    },
    {
      id: 4,
      name: 'Blog',
      icon: 'icons/blog-icon.png',
    },
  ];

  return (
    <React.Fragment>
      <div id="desktop-nav">
        <h1>Sunny Mistry</h1>
        <h2>Software Engineer</h2>

        <nav>
         {
           navItems.map(item => desktopNavitem(item))
         }
        </nav>
      </div>

      <nav id="mobile-nav">
        {
          navItems.map(item => mobileNavItem(item))
        }
      </nav>

    </React.Fragment>
  )
}

export default Nav;
