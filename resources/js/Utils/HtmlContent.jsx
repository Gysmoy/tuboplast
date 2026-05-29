import React from 'react';

const HtmlContent = ({ html, properties }) => {
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} {...properties} />
  );
};

export default HtmlContent;