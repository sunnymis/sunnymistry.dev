import React from 'react';
import moment from 'moment';
import styles from '../Feed/Feed.module.scss';

const TILFeed = ({ edges, html }) => (
  <div className={styles['feed']}>
    {
      edges.map((edge) => {
        const { html } = edge.node;

        return (
          <div className={styles['feed__item']} key={edge.node.fields.slug}>
            <div className={styles['feed__item-meta']}>
              <time className={styles['feed__item-meta-time']} dateTime={moment(edge.node.frontmatter.date).format('MMMM D, YYYY')}>
                {moment(edge.node.frontmatter.date).format('MMMM D, YYYY')}
              </time>
            </div>
            <h2 className={styles['feed__item-title']}>
              {edge.node.frontmatter.title}
            </h2>
            {/* <p className={styles['feed__item-description']}>{edge.node.frontmatter.description}</p> */}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        );
      })
    }
  </div>
);

export default TILFeed;
