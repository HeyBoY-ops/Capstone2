import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogPosts } from './blogData';
import { BsArrowLeft, BsCalendar, BsClock } from 'react-icons/bs';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Post not found</h2>
        <button 
           onClick={() => navigate('/blog')}
           style={{
             padding: '0.5rem 1rem',
             backgroundColor: 'var(--color-primary)',
             color: 'white',
             borderRadius: '6px',
             border: 'none',
             cursor: 'pointer',
             fontWeight: '600'
           }}
        >
          Back to Articles
        </button>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: "'Charter', 'Georgia', serif" }}>
      
      {/* Back Button - Styled cleanly */}
      <button 
        onClick={() => navigate('/blog')} 
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '2rem', 
          padding: '0.5rem 1rem',
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: '1px solid var(--color-border)',
          borderRadius: '99px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-sans)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => {
           e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)';
           e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
           e.currentTarget.style.backgroundColor = 'transparent';
           e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        <BsArrowLeft /> Back to Articles
      </button>

      <header style={{ marginBottom: '3rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
         <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', fontSize: '0.875rem', flexWrap: 'wrap' }}>
            <span style={{ 
               padding: '4px 12px', 
               backgroundColor: 'var(--color-primary-light)', 
               color: 'var(--color-primary)', 
               borderRadius: '99px',
               fontWeight: '700',
               letterSpacing: '0.025em',
               textTransform: 'uppercase',
               fontSize: '0.75rem'
            }}>
              {post.category}
            </span>
            <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <BsCalendar /> {post.date}
            </span>
            <span style={{ color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <BsClock /> {post.readTime}
            </span>
         </div>
         <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: '800', 
            color: 'var(--color-text-primary)', 
            lineHeight: 1.1,
            letterSpacing: '-0.025em'
         }}>
           {post.title}
         </h1>
      </header>
      
      {/* Content Rendering */}
      <div 
         style={{ 
           fontSize: '1.25rem', 
           lineHeight: 1.8, 
           color: 'var(--color-text-primary)',
         }}
         className="prose"
         dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <hr style={{ border: '0', borderTop: '1px solid var(--color-border)', margin: '4rem 0' }} />

      <div style={{ textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
         <h3 style={{ marginBottom: '1rem', fontWeight: '700', fontSize: '1.5rem' }}>Ready to master your budget?</h3>
         <button 
           onClick={() => navigate('/blog')}
           style={{
             padding: '0.75rem 2rem',
             backgroundColor: 'var(--color-primary)',
             color: 'white',
             borderRadius: '99px',
             border: 'none',
             cursor: 'pointer',
             fontSize: '1rem',
             fontWeight: '600',
             boxShadow: '0 4px 6px -1px var(--color-primary-light)',
             transition: 'transform 0.2s'
           }}
           onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
           onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
         >
            Go to Dashboard
         </button>
      </div>

    </article>
  );
};

export default BlogDetail;
