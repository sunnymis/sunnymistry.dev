'use strict';

module.exports = {
  url: 'https://www.sunnymistry.dev',
  pathPrefix: '/',
  title: 'Blog by Sunny Mistry',
  subtitle: 'Software Engineer',
  copyright: '© All rights reserved.',
  disqusShortname: '',
  postsPerPage: 4,
  googleAnalyticsId: '', // TODO ADD THIS
  menu: [
    {
      label: 'Articles',
      path: '/'
    },
    {
      label: 'About',
      path: '/pages/about'
    },
    {
      label: 'Contact',
      path: '/pages/contacts'
    }
  ],
  author: {
    name: 'Sunny Mistry',
    photo: '/profile-photo.jpg',
    bio: 'I\'m a Software Engineer based in New York who loves building web apps and weightlifting.',
    contacts: {
      email: 'sunny.v.mistry@gmail.com',
      github: 'sunnymis',
      linkedin: 'sunnymistry',
      instagram: 'sunnmist'
    }
  }
};
