import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import BookList from '../components/BookList';
import { useSiteMetadata } from '../hooks';
import { books2019, books2018 } from '../constants/books';

const BookTemplate = ({ data }) => {
  const { title: siteTitle, subtitle: siteSubtitle } = useSiteMetadata();
  const { frontmatter } = data.markdownRemark;
  const { title: pageTitle, description: pageDescription, socialImage } = frontmatter;
  const metaDescription = pageDescription !== null ? pageDescription : siteSubtitle;

  return (
    <Layout title={`${pageTitle} - ${siteTitle}`} description={metaDescription} socialImage={socialImage} >
      <Sidebar />
      <Page title="Books">
        <p style={{ fontSize: '18px' }}>A collection of books I've read.</p>

        <h2>2019</h2>
       <BookList books={books2019} />

        <h2>2018</h2>
        <BookList books={books2018} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query Books($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      frontmatter {
        title
        socialImage
      }
    }
  }
`;

export default BookTemplate;
