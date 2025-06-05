// src/Component/Blog/BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

function BlogCard({ post }) {
  return (
    <div className="blog-card">
      <img src={post.image} alt={post.title} className="blog-card-image" />
      <div className="blog-card-content">
        <h2 className="blog-card-title">{post.title}</h2>
        <p className="blog-card-description">{post.description}</p>
        <Link to={`/blog/${post.id}`}>
          <button className="blog-card-button">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
