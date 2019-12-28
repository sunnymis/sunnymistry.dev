import React from 'react';
import styles from './Author.module.scss';

const Author = () => (
  <div className={styles['author']}>
    <p className={styles['author__bio']}>
      {/* {author.bio}
      <a
        className={styles['author__bio-twitter']}
        href={getContactHref('twitter', author.contacts.twitter)}
        rel="noopener noreferrer"
        target="_blank"
      >
        <strong>{author.name}</strong> on Twitter
      </a> */}
    </p>
  </div>
);

export default Author;
