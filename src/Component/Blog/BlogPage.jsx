import React, { useState } from 'react';
import { blogPosts } from './blogData';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import { BsSearch, BsClock, BsArrowRight } from 'react-icons/bs';

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(blogPosts.map(post => post.category))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          color: 'var(--color-text-primary)',
          marginBottom: '1rem',
          letterSpacing: '-0.03em'
        }}>
          Financial Wisdom Hub
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: 'var(--color-text-secondary)',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Explore expert articles on budgeting, investing, and lifestyle to master your personal finances.
        </p>
      </div>

      {/* Modern Floating Search Bar */}
      <div style={{ 
        maxWidth: '700px', 
        margin: '0 auto 4rem auto',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ 
          position: 'relative', 
          backgroundColor: '#fff',
          borderRadius: '50px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 0.5rem 0.5rem 1.5rem',
          border: '1px solid var(--color-border)'
        }}>
          <BsSearch size={22} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0, marginRight: '1rem' }} />
          <input 
             type="text"
             placeholder="Search for 'investing', 'savings'..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             style={{
               border: 'none',
               outline: 'none',
               width: '100%',
               fontSize: '1.1rem',
               color: 'var(--color-text-primary)',
               backgroundColor: 'transparent',
               height: '48px',
               fontFamily: 'inherit'
             }}
          />
          <button style={{
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '50px',
            padding: '0.75rem 2rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            marginLeft: '0.5rem'
          }}>
            Search
          </button>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
          {categories.map(cat => (
            <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               style={{
                 padding: '0.625rem 1.25rem',
                 borderRadius: '999px',
                 fontSize: '0.9rem',
                 fontWeight: '600',
                 border: selectedCategory === cat ? 'none' : '1px solid var(--color-border)',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease',
                 backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : '#fff',
                 color: selectedCategory === cat ? '#fff' : 'var(--color-text-primary)',
                 boxShadow: selectedCategory === cat ? '0 4px 6px -1px var(--color-primary-light)' : 'none'
               }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
        gap: '2.5rem' 
      }}>
        {filteredPosts.map((post) => (
          <Card 
             key={post.id} 
             className="group"
             style={{ 
               display: 'flex', 
               flexDirection: 'column', 
               padding: 0, 
               overflow: 'hidden', 
               height: '100%',
               border: 'none',
               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
               transition: 'transform 0.3s ease, box-shadow 0.3s ease'
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = 'translateY(-8px)';
               e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
             }}
             onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
             }}
          >
             {/* Article Image - Hover Zoom Effect */}
             <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                 <img 
                   src={post.image} 
                   alt={post.title}
                   style={{ 
                     width: '100%', 
                     height: '100%', 
                     objectFit: 'cover',
                     transition: 'transform 0.5s ease'
                   }} 
                 />
                 <div style={{
                   position: 'absolute',
                   top: '1rem',
                   left: '1rem',
                   backgroundColor: 'rgba(255, 255, 255, 0.95)',
                   padding: '0.25rem 0.75rem',
                   borderRadius: '99px',
                   fontSize: '0.75rem',
                   fontWeight: '700',
                   color: 'var(--color-primary)',
                   textTransform: 'uppercase',
                   letterSpacing: '0.05em'
                 }}>
                   {post.category}
                 </div>
             </div>

             <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <BsClock size={14} />
                      <span>{post.readTime}</span>
                   </div>
                   <span>{post.date}</span>
                </div>

                <h2 style={{ 
                  fontSize: '1.35rem', 
                  fontWeight: '700', 
                  color: 'var(--color-text-primary)',
                  marginBottom: '1rem',
                  lineHeight: 1.3
                }}>
                  {post.title}
                </h2>
                
                <p style={{ 
                  fontSize: '1rem', 
                  color: 'var(--color-text-secondary)', 
                  marginBottom: '1.5rem',
                  lineHeight: 1.6,
                  flexGrow: 1
                }}>
                  {post.summary}
                </p>

                <button 
                  onClick={() => navigate(`/blog/${post.id}`)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    marginTop: 'auto'
                  }}
                  className="group-hover:translate-x-1 transition-transform"
                >
                  Read Article <BsArrowRight />
                </button>
             </div>
          </Card>
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-text-tertiary)' }}>
           No articles found for "{searchTerm}".
        </div>
      )}
    </div>
  );
};

export default BlogPage;
