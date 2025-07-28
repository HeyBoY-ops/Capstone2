import React from 'react';
import { blogPosts } from './blogData';
import './BlogPage.css';

const BlogPage = () => {
  return (
    <main className="blog-page">
      <h1 className="blog-header">Our Latest Blog Posts</h1>
      
      <section className="blog-list">
        {blogPosts.map((post) => (
          <article className="blog-card" key={post.id}>
            <h2 className="blog-title">{post.title}</h2>
            <p className="blog-summary">{post.summary}</p>
            <a
              className="read-more"
              href={`https://www.google.com/search?q=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read More →
            </a>
          </article>
        ))}
      </section>
    </main>
  );
};

export default BlogPage;
