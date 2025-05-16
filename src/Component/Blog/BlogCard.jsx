// src/Component/Blog/BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";

function BlogCard({ post }) {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p className="text-gray-600">{post.description}</p>
        <Link to={`/blog/${post.id}`}>
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
