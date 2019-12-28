import React from 'react';
import moment from 'moment';
import styles from './Content.module.scss';

const Content = ({ body, title, date }) => (
  <div className={styles['content']}>
    <h1 className={styles['content__title']}>{title}</h1>
    <p className={styles['content__date']}>{moment(date).format('MMMM D, YYYY')}</p>
    <div className={styles['content__body']} dangerouslySetInnerHTML={{ __html: body }} />
  </div>
);

export default Content;
