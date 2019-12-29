import React from 'react';
import styles from './book-list.module.scss';

const BookList = ({ books }) => (
    <ul className={styles['book-list']}>
      { books.map((book) => (
        <li>
          <img className={styles['book']} alt={book.alt} src={book.src} />
        </li>
      ))}
    </ul>
);

export default BookList;
