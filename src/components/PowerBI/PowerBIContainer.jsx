import React from 'react';
import { BsFilter, BsThreeDots, BsArrowsFullscreen } from 'react-icons/bs';
import Card from '../ui/Card';

const PowerBIContainer = ({ 
  title, 
  children, 
  className = '', 
  height = 350, 
  onExpand, 
  onCollapse,
  onExport,
  onFilter 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Card className={`p-0 ${className}`} style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* PowerBI-style Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--color-border)',
        padding: '0.75rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: '600',
          color: 'var(--color-text-primary)',
          fontFamily: "'Segoe UI', sans-serif" // PowerBI font preference
        }}>
          {title}
        </h3>
        
        {/* Mock Toolbar Icons */}
        <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
          <div style={{position: 'relative'}}>
             <BsFilter 
                style={{ cursor: 'pointer' }} 
                title="Filters" 
                onClick={(e) => {
                   e.stopPropagation();
                   // If onFilter prop is provided, call it. Otherwise just toggle visual state or ignore.
                   if(onFilter) onFilter();
                }}
             />
          </div>

          {onCollapse ? (
             <BsArrowsFullscreen style={{ cursor: 'pointer', color: 'var(--color-primary)' }} title="Exit Focus Mode" onClick={onCollapse} />
          ) : (
             <BsArrowsFullscreen style={{ cursor: 'pointer' }} title="Focus Mode" onClick={onExpand} />
          )}

          <div style={{position: 'relative'}}>
            <BsThreeDots 
               style={{ cursor: 'pointer' }} 
               title="More Options" 
               onClick={(e) => {
                 e.stopPropagation();
                 setShowMenu(!showMenu);
               }}
            />
            {showMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 50,
                minWidth: '150px'
              }}>
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    fontSize: '14px', 
                    color: 'var(--color-text-primary)',
                    display: 'flex', alignItems: 'center', gap: '8px'
                  }}
                  className="hover:bg-slate-50"
                  onClick={() => {
                    setShowMenu(false);
                    if(onExport) onExport();
                  }}
                >
                  <span>Export data</span>
                </div>
                <div 
                  style={{ 
                    padding: '8px 12px', 
                    cursor: 'pointer', 
                    fontSize: '14px', 
                    color: 'var(--color-text-secondary)', 
                    borderTop: '1px solid var(--color-border)' 
                  }}
                  onClick={() => setShowMenu(false)}
                >
                  Cancel
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div style={{ 
        padding: '1rem', 
        height: (onCollapse || height === '100%') ? 'auto' : height, 
        backgroundColor: '#FAFAFA', 
        flexGrow: 1,
        minHeight: 0, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        {children}
      </div>
    </Card>
  );
};

export default PowerBIContainer;
