import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../LoginPage/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useUser } from "../../context/UserContext";
import { FaGithub, FaWallet, FaChartPie, FaLightbulb, FaShieldAlt, FaArrowRight } from "react-icons/fa";
import Card from "../../components/ui/Card";
import BudgetChart from "../Budget/BudgetChart";
import useScrollAnimation from "../../hooks/useScrollAnimation";

function Home() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalBudget: 0,
    totalSpent: 0,
    totalRemaining: 0,
    overspentCount: 0,
  });
  const [demoBudgets, setDemoBudgets] = useState([
     { category: "Housing", total: 20000, spent: 18500, month: "Current" },
     { category: "Food", total: 8000, spent: 4200, month: "Current" },
     { category: "Fun", total: 5000, spent: 1200, month: "Current" },
     { category: "Savings", total: 10000, spent: 10000, month: "Current" },
  ]);

  const fetchBudgetStats = async () => {
    try {
      let budgets = [];
      if (user) {
        const userBudgetRef = collection(db, "users", user.uid, "budgets");
        const snapshot = await getDocs(userBudgetRef);
        budgets = snapshot.docs.map((doc) => doc.data());
        if (budgets.length > 0) {
           setDemoBudgets(budgets.slice(0, 4));
        }
      }

      const totalCategories = budgets.length;
      const totalBudget = budgets.reduce((sum, item) => sum + Number(item.total || 0), 0);
      const totalSpent = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
      const totalRemaining = totalBudget - totalSpent;
      const overspentCount = budgets.filter(item => Number(item.spent) > Number(item.total)).length;

      setStats({ totalCategories, totalBudget, totalSpent, totalRemaining, overspentCount });
    } catch (error) {
      console.error("Error fetching budget stats:", error);
    }
  };

  const [heroTextRef, heroTextVisible] = useScrollAnimation({ threshold: 0.1 });
  const [heroChartRef, heroChartVisible] = useScrollAnimation({ threshold: 0.1 });
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [featuresRef, featuresVisible] = useScrollAnimation({ threshold: 0.1 });

  useEffect(() => {
    fetchBudgetStats();
  }, [user]);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'var(--font-sans)' }} className="bg-pattern">
      
      {/* Hero Section */}
      <section style={{ 
         padding: '6rem 2rem 4rem 2rem', 
         maxWidth: '1400px', 
         margin: '0 auto', 
         display: 'grid', 
         gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
         gap: '5rem',
         alignItems: 'center'
      }}>
         {/* Text Content */}
         <div ref={heroTextRef} className={`animate-on-scroll ${heroTextVisible ? 'visible' : ''}`} style={{ opacity: heroTextVisible ? 1 : 0 }}>
            <h1 style={{ 
               fontSize: '4.5rem', 
               fontWeight: '800', 
               lineHeight: 1.05, 
               color: '#1e293b',
               marginBottom: '1.5rem',
               letterSpacing: '-0.03em'
            }}>
               Master Your Money <br/>
               <span className="text-gradient" style={{ 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
               }}>
                  Without the Stress.
               </span>
            </h1>
            <p style={{ 
               fontSize: '1.25rem', 
               color: '#64748b', 
               marginBottom: '3rem', 
               lineHeight: 1.6,
               maxWidth: '550px'
            }}>
               Stop guessing where your money goes. Plan your budget, track expenses, and reach your financial goals with our smart, beautiful dashboard.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
               <Link to="/budget">
                  <button className="btn-smooth hover-lift" style={{ 
                     padding: '1rem 2.5rem', 
                     fontSize: '1.125rem', 
                     fontWeight: '600',
                     backgroundColor: '#4f46e5',
                     color: 'white',
                     border: 'none',
                     borderRadius: '99px',
                     cursor: 'pointer',
                     boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '0.5rem',
                     position: 'relative'
                  }}
                  onMouseEnter={e => {
                     const icon = e.currentTarget.querySelector('svg');
                     if (icon) icon.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                     const icon = e.currentTarget.querySelector('svg');
                     if (icon) icon.style.transform = 'translateX(0)';
                  }}
                  >
                     Start Budgeting <FaArrowRight size={14} style={{ transition: 'transform 0.3s', display: 'inline-block' }} />
                  </button>
               </Link>
               <Link to="/blog">
                  <button className="transition-smooth" style={{ 
                     padding: '1rem 2.5rem', 
                     fontSize: '1.125rem',
                     fontWeight: '600',
                     backgroundColor: 'white',
                     color: '#475569',
                     border: '1px solid #cbd5e1',
                     borderRadius: '99px',
                     cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                     e.currentTarget.style.backgroundColor = '#f8fafc';
                     e.currentTarget.style.borderColor = '#94a3b8';
                     e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                     e.currentTarget.style.backgroundColor = 'white';
                     e.currentTarget.style.borderColor = '#cbd5e1';
                     e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  >
                     Read Advice
                  </button>
               </Link>
            </div>
         </div>

         {/* Visual/Chart Demo */}
         <div ref={heroChartRef} className={`animate-on-scroll ${heroChartVisible ? 'visible' : ''}`} style={{ position: 'relative', perspective: '1000px' }}>
            <div className="hover-scale transition-slow" style={{ 
               position: 'relative', 
               zIndex: 1, 
               transform: 'rotateY(-5deg) rotateX(2deg)',
               backgroundColor: 'white',
               borderRadius: '24px',
               padding: '1.5rem',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
               border: '1px solid rgba(255, 255, 255, 0.8)',
               transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={e => {
               e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1.02)';
               e.currentTarget.style.boxShadow = '0 30px 60px -12px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={e => {
               e.currentTarget.style.transform = 'rotateY(-5deg) rotateX(2deg)';
               e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.15)';
            }}
            >
               <div style={{ 
                  marginBottom: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '1rem'
               }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
                     <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#eab308' }}></div>
                     <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Live Preview</div>
               </div>
               <BudgetChart data={demoBudgets} />
            </div>
         </div>
      </section>


      {/* Quick Stats Pulse */}
      <section ref={statsRef} className={`animate-on-scroll ${statsVisible ? 'visible' : ''}`} style={{ padding: '4rem 2rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 className="animate-fade-in-up" style={{ fontSize: '2.25rem', fontWeight: '800', color: '#1e293b' }}>Your Financial Pulse</h2>
                <p className="animate-fade-in-up" style={{ color: '#64748b', animationDelay: '0.1s' }}>Live snapshot of your current financial health.</p>
            </div>
            
            <div className="animate-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
               {[
                  { icon: <FaWallet />, label: "Total Budget", value: stats.totalBudget, color: "blue" },
                  { icon: <FaChartPie />, label: "Total Spent", value: stats.totalSpent, color: "green" },
                  { icon: <FaLightbulb />, label: "Available", value: stats.totalRemaining, color: "amber" }
               ].map((item, idx) => (
                  <Card key={idx} className="card-hover hover-lift" style={{ 
                     display: 'flex', 
                     alignItems: 'center', 
                     padding: '2rem', 
                     gap: '1.5rem',
                     border: '1px solid #f1f5f9',
                     boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}>
                     <div className="transition-smooth" style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '16px', 
                        backgroundColor: `var(--color-${item.color}-50, #f0f9ff)`, 
                        color: `var(--color-${item.color}-600, #0284c7)`, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '1.5rem',
                        transition: 'transform 0.3s'
                     }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                     >
                        {item.icon}
                     </div>
                     <div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</p>
                        <h3 className="transition-fast" style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>₹{item.value.toLocaleString()}</h3>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Features Grid */}
      <section ref={featuresRef} className={`animate-on-scroll ${featuresVisible ? 'visible' : ''}`} style={{ padding: '6rem 2rem', background: 'radial-gradient(circle at top right, #f8fafc, #f1f5f9)' }}>
         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
               <h2 className="animate-fade-in-up" style={{ fontSize: '3rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>Why SmartBudget?</h2>
               <p className="animate-fade-in-up" style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', animationDelay: '0.1s' }}>
                  Three powerful tools combined into one seamless experience.
               </p>
            </div>

            <div className="animate-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem' }}>
               <Link to="/budget" style={{ textDecoration: 'none' }}>
                  <Card className="card-hover hover-lift hover-shine h-full" style={{ padding: '2.5rem', borderTop: '4px solid #4f46e5', position: 'relative', overflow: 'hidden' }}>
                     <div className="transition-smooth" style={{ marginBottom: '1.5rem', width: '50px', height: '50px', backgroundColor: '#e0e7ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', fontSize: '1.5rem' }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                     >
                        <FaWallet />
                     </div>
                     <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>Smart Planner</h3>
                     <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                        Create unlimited budgets, set spending limits, and track expenses with our intuitive form. Real-time updates keep you honest.
                     </p>
                  </Card>
               </Link>

               <Link to="/monthly-breakdown" style={{ textDecoration: 'none' }}>
                  <Card className="card-hover hover-lift hover-shine h-full" style={{ padding: '2.5rem', borderTop: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
                     <div className="transition-smooth" style={{ marginBottom: '1.5rem', width: '50px', height: '50px', backgroundColor: '#d1fae5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: '1.5rem' }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                     >
                        <FaChartPie />
                     </div>
                     <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>Visual Analytics</h3>
                     <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                        See exactly where your money goes. Our PowerBI-style charts let you zoom, filter, and export your data for deep analysis.
                     </p>
                  </Card>
               </Link>

               <Link to="/blog" style={{ textDecoration: 'none' }}>
                  <Card className="card-hover hover-lift hover-shine h-full" style={{ padding: '2.5rem', borderTop: '4px solid #f59e0b', position: 'relative', overflow: 'hidden' }}>
                     <div className="transition-smooth" style={{ marginBottom: '1.5rem', width: '50px', height: '50px', backgroundColor: '#fef3c7', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706', fontSize: '1.5rem' }}
                     onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)'}
                     onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
                     >
                        <FaLightbulb />
                     </div>
                     <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1e293b' }}>Financial Wisdom</h3>
                     <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                        Not just a tool, but a teacher. Access our library of expert articles to learn about investing, debt management, and more.
                     </p>
                  </Card>
               </Link>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '5rem 2rem 2rem 2rem' }}>
         <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
               <div style={{ gridColumn: 'span 2' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                     SmartBudget
                  </h3>
                  <p style={{ color: '#64748b', maxWidth: '300px', lineHeight: 1.6 }}>
                     The modern way to manage your personal finances. Built for speed, privacy, and peace of mind.
                  </p>
               </div>
               
               <div>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Product</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <Link to="/budget" style={{ color: '#64748b', textDecoration: 'none' }}>Planner</Link>
                     <Link to="/monthly-breakdown" style={{ color: '#64748b', textDecoration: 'none' }}>Analytics</Link>
                     <Link to="/blog" style={{ color: '#64748b', textDecoration: 'none' }}>Blog</Link>
                  </div>
               </div>

               <div>
                  <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', color: '#0f172a' }}>Resources</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Help Center</a>
                     <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Privacy Policy</a>
                     <a href="#" style={{ color: '#64748b', textDecoration: 'none' }}>Terms of Service</a>
                  </div>
               </div>
            </div>

            <div style={{ pt: '2rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
               <div>© {new Date().getFullYear()} SmartBudget Inc.</div>
               <div style={{ display: 'flex', gap: '1.5rem' }}>
                  <FaGithub size={20} style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => window.open("https://github.com/HeyBoY-ops/Capstone2", "_blank")} />
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}

export default Home;
