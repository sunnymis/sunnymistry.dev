import React from 'react';
import Helmet from 'react-helmet';
import { withPrefix } from 'gatsby';
import { useSiteMetadata } from '../../hooks';
import styles from './Layout.module.scss';

const Layout = ({
  children,
  title,
  description,
  socialImage
}) => {
  const { author, url } = useSiteMetadata();
  const metaImage = socialImage != null ? socialImage : author.photo;
  const metaImageUrl = url + withPrefix(metaImage);

  return (
    <div className={styles.layout}>
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:image" content={metaImageUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaImageUrl} />
        <link href="https://fonts.googleapis.com/css?family=Lato|Raleway:100,300,400,700,900&display=swap" rel="stylesheet" />
      </Helmet>
      {children}
    </div>
  );
};

export default Layout;
