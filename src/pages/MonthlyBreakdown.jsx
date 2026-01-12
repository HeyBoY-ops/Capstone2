import React, { useState, useEffect } from 'react';
import { db } from '../LoginPage/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useUser } from "../context/UserContext";
import Card from '../components/ui/Card';
import PowerBIContainer from '../components/PowerBI/PowerBIContainer';
import { powerBiTheme as PowerBITheme } from '../components/PowerBI/PowerBITheme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BsFunnel, BsArrowUpRight, BsTable } from 'react-icons/bs';

const MonthlyBreakdown = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [filteredMonth, setFilteredMonth] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // PowerBI State
  const [focusChart, setFocusChart] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
       if(!user) {
          setIsDemoMode(true);
          setBudgets([
            { id: 1, category: "Food", total: 10000, spent: 4500, month: "January" },
            { id: 2, category: "Rent", total: 25000, spent: 25000, month: "January" },
            { id: 3, category: "Entertainment", total: 5000, spent: 6500, month: "January" },
            { id: 4, category: "Food", total: 12000, spent: 8000, month: "February" },
            { id: 5, category: "Rent", total: 25000, spent: 25000, month: "February" },
          ]);
          return;
       }
       try {
           const q = query(collection(db, "users", user.uid, "budgets"));
           const querySnapshot = await getDocs(q);
           const loadedBudgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setBudgets(loadedBudgets);
           setIsDemoMode(false);
       } catch (error) {
           console.error("Error fetching data:", error);
       }
    };
    fetchBudgets();
  }, [user]);

  // Derived Logic
  const uniqueMonths = [...new Set(budgets.map(b => b.month))];
  const uniqueCategories = [...new Set(budgets.map(b => b.category))];

  const filteredBudgets = budgets.filter(item => {
    const matchMonth = filteredMonth ? item.month === filteredMonth : true;
    const matchCategory = filteredCategory ? item.category === filteredCategory : true;
    return matchMonth && matchCategory;
  });

  const handleExportCSV = (data) => {
    const headers = ["Category", "Month", "Total Budget", "Total Spent", "Remaining"];
    const rows = data.map(item => [item.category, item.month, item.total, item.spent, item.total - item.spent]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `breakdown_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderChart = (data) => (
     <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="category" stroke="#64748b" tick={{fill: '#64748b'}} />
          <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
          <Tooltip 
             contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: 'none' }}
             cursor={{fill: 'rgba(0,0,0,0.05)'}}
          />
          <Legend />
          <Bar dataKey="total" name="Budget" fill={PowerBITheme.colors[0]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="spent" name="Spent" fill={PowerBITheme.colors[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
     </ResponsiveContainer>
  );

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: 'var(--color-bg-app)', minHeight: '100vh' }}>
      
      {/* Zoom Modal */}
      {focusChart && (
        <div className="animate-scale-in" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          backdropFilter: 'blur(8px)'
        }} onClick={() => setFocusChart(null)}>
          <div style={{ width: '90%', height: '80%', maxWidth: '1200px' }} onClick={e => e.stopPropagation()}>
            <PowerBIContainer 
               title="Budget Analysis (Detail View)" 
               onCollapse={() => setFocusChart(null)}
               onExport={() => handleExportCSV(filteredBudgets)}
               height="100%"
            >
               {renderChart(filteredBudgets)}
            </PowerBIContainer>
          </div>
        </div>
      )}

      <header style={{ marginBottom: '3rem' }}>
        <div className="animate-fade-in-up">
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            Monthly Analytics
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
            Deep dive into your spending and visualize trends.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Filters */}
        <div style={{ gridColumn: 'span 3', minWidth: '250px' }}>
          <Card className="sticky" style={{ top: '6rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)', border: 'none', background: 'var(--color-bg-surface)', padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.02em' }}>
                  <BsFunnel /> Filters
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>MONTH</label>
                <div style={{ position: 'relative' }}>
                    <select 
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem 1rem 0.75rem 2.5rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-app)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: '500',
                        appearance: 'none',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '0.65em auto'
                    }}
                    value={filteredMonth} 
                    onChange={(e) => setFilteredMonth(e.target.value)}
                    >
                    <option value="">All Months</option>
                    {uniqueMonths.map((m, i) => <option key={i} value={m}>{m}</option>)}
                    </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>CATEGORY</label>
                <div style={{ position: 'relative' }}>
                    <select 
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem 1rem 0.75rem 2.5rem', 
                        borderRadius: 'var(--radius-md)', 
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-app)',
                        color: 'var(--color-text-primary)',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        outline: 'none',
                        fontWeight: '500',
                        appearance: 'none',
                        boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '0.65em auto'
                    }}
                    value={filteredCategory} 
                    onChange={(e) => setFilteredCategory(e.target.value)}
                    >
                    <option value="">All Categories</option>
                    {uniqueCategories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Charts & Data */}
        <div style={{ gridColumn: 'span 9', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
           
           {/* Chart */}
           <div className="animate-fade-in-right" style={{ height: '480px' }}>
              <PowerBIContainer 
                 title="Performance Metrics" 
                 height="100%"
                 onExpand={() => setFocusChart(true)}
                 onExport={() => handleExportCSV(filteredBudgets)}
              >
                 {filteredBudgets.length > 0 ? renderChart(filteredBudgets) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                       <h3>No data for chart</h3>
                    </div>
                 )}
              </PowerBIContainer>
           </div>

           {/* Detailed Cards */}
           <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <BsTable /> Detailed Breakdown
              </h3>
              
              {filteredBudgets.length > 0 ? (
                <div className="animate-stagger" style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {filteredBudgets.map(item => {
                     const percentage = Math.min(100, (item.spent / item.total) * 100);
                     const remaining = item.total - item.spent;
                     let progressColor = 'var(--color-success)';
                     if (percentage > 80) progressColor = '#eab308'; 
                     if (percentage > 95) progressColor = 'var(--color-danger)';
                     
                     return (
                        <Card 
                           key={item.id}
                           className="hover-lift"
                           style={{ 
                             borderRadius: '16px',
                             border: '1px solid #e2e8f0', 
                             backgroundColor: '#ffffff',
                             boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)',
                             transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                             overflow: 'hidden'
                           }}
                           onMouseEnter={e => {
                               e.currentTarget.style.transform = 'translateY(-4px)';
                               e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)';
                           }}
                           onMouseLeave={e => {
                               e.currentTarget.style.transform = 'none';
                               e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)';
                           }}
                        >
                           <div style={{ padding: '1.5rem' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                               <div>
                                  <div style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      padding: '4px 10px', 
                                      backgroundColor: '#f1f5f9', 
                                      borderRadius: '20px', 
                                      marginBottom: '0.75rem' 
                                  }}>
                                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                          {item.month}
                                      </span>
                                  </div>
                                  <h4 style={{ 
                                      fontSize: '1.25rem', 
                                      fontWeight: '800', 
                                      color: '#1e293b', 
                                      letterSpacing: '-0.02em',
                                      margin: 0
                                  }}>{item.category}</h4>
                               </div>
                            </div>

                            {/* Progress Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                                        {percentage.toFixed(0)}% <span style={{ fontWeight: '400', color: '#94a3b8' }}>used</span>
                                    </span>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>
                                        Target: ₹{item.total.toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        height: '100%', 
                                        width: `${percentage}%`, 
                                        backgroundColor: progressColor, 
                                        borderRadius: '4px',
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }} />
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f8fafc' }}>
                               <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Spent</div>
                                  <div style={{ fontWeight: '700', color: '#334155', fontSize: '1.1rem', fontFeatureSettings: '"tnum" on, "lnum" on' }}>₹{item.spent.toLocaleString()}</div>
                               </div>
                               <div style={{ flex: 1, borderLeft: '1px solid #f8fafc', paddingLeft: '1.5rem' }}>
                                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Available</div>
                                  <div style={{ fontWeight: '700', color: remaining < 0 ? '#ef4444' : '#10b981', fontSize: '1.1rem', fontFeatureSettings: '"tnum" on, "lnum" on' }}>
                                     {remaining < 0 ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
                                  </div>
                               </div>
                            </div>
                           </div>
                        </Card>
                     );
                  })}
                </div>
              ) : (
                <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                   No data available.
                </Card>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyBreakdown;
