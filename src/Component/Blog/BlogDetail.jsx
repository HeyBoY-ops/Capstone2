import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();

  return (
    <div className="blog-detail">
      <h1>Blog Post #{id}</h1>
      <p>This is a detailed view for blog post {id}.</p>
    </div>
  );
};

export default BlogDetail;
