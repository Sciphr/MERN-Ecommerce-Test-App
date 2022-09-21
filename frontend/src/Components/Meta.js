import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'The Berry Shop',
  description: 'Place to get a bunch of cool stuff',
  keywords: 'Awesomesauce, Berry, React stuff',
};

export default Meta;
