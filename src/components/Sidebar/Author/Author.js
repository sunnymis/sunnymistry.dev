import React from 'react';
import { withPrefix, Link } from 'gatsby';
import styles from './Author.module.scss';

const Author = ({ author, isIndex }) => (
  <div className={styles['author']}>
    <Link to="/">
      <img
        src={withPrefix(author.photo)}
        className={styles['author__photo']}
        alt={author.name}
      />
    </Link>
    <h1 className={styles['author__title']}>
      <Link className={styles['author__title-link']} to="/">{author.name}</Link>
    </h1>
    <p className={styles['author__subtitle']}>{author.bio}</p>
  </div>
);

export default Author;
