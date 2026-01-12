import React, { useState, useEffect } from 'react';
import { db } from '../../LoginPage/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query } from 'firebase/firestore';
import { useUser } from "../../context/UserContext";
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import BudgetChart from './BudgetChart';
import { BsTrash, BsWallet2, BsCalendar, BsCurrencyRupee, BsFunnel, BsPencil } from 'react-icons/bs';

const BudgetPage = () => {
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', total: '', spent: '', month: '' });
  const [editId, setEditId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errors, setErrors] = useState({});

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Fetch Budgets
  useEffect(() => {
    const fetchBudgets = async () => {
       if(!user) {
          setIsDemoMode(true);
          // Demo Data
          setBudgets([
            { id: 1, category: "Food", total: 10000, spent: 8000, month: "January" },
            { id: 2, category: "Entertainment", total: 5000, spent: 6500, month: "January" },
            { id: 3, category: "Rent", total: 20000, spent: 20000, month: "January" },
            { id: 4, category: "Food", total: 12000, spent: 7000, month: "February" },
          ]);
          return;
       }
       try {
           // Firestore fetch
           const q = query(collection(db, "users", user.uid, "budgets"));
           const querySnapshot = await getDocs(q);
           const loadedBudgets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
           setBudgets(loadedBudgets);
           setIsDemoMode(false);
       } catch (error) {
           console.error("Error fetching budgets:", error);
       }
    };
    fetchBudgets();
  }, [user]);

  const validate = () => {
      let tempErrors = {};
      if(!formData.category) tempErrors.category = "Category is required";
      if(!formData.total) tempErrors.total = "Total allocation is required";
      if(!formData.month) tempErrors.month = "Month is required";
      setErrors(tempErrors);
      return Object.keys(tempErrors).length === 0;
  };

  const handleAddOrUpdate = async () => {
    if(!validate()) return;
    
    const budgetData = {
        category: formData.category,
        total: parseFloat(formData.total),
        spent: parseFloat(formData.spent) || 0,
        month: formData.month
    };

    if (user) {
      if (editId) {
        await updateDoc(doc(db, "users", user.uid, "budgets", editId), budgetData);
        setBudgets(budgets.map(b => b.id === editId ? { ...b, ...budgetData } : b));
      } else {
        const docRef = await addDoc(collection(db, "users", user.uid, "budgets"), budgetData);
        setBudgets([...budgets, { id: docRef.id, ...budgetData }]);
      }
    } else {
       // Demo Logic
       if(editId) {
          setBudgets(budgets.map(b => b.id === editId ? { ...b, ...budgetData } : b));
       } else {
          setBudgets([...budgets, { id: Date.now(), ...budgetData }]);
       }
    }
    clearForm();
  };

  const handleEdit = (item) => {
    if (editId === item.id) {
        clearForm();
        return;
    }
    setFormData({ category: item.category, total: item.total, spent: item.spent, month: item.month });
    setEditId(item.id);
    setErrors({});
  };

  const handleDelete = async () => {
    if (user && editId) {
       await deleteDoc(doc(db, "users", user.uid, "budgets", editId));
    }
    setBudgets(budgets.filter(b => b.id !== editId));
    clearForm();
  };

  const clearForm = () => {
    setFormData({ category: '', total: '', spent: '', month: '' });
    setEditId(null);
    setErrors({});
  };

  const filteredBudgets = selectedMonth ? budgets.filter(b => b.month === selectedMonth) : budgets;

  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '1400px', margin: '0 auto', backgroundColor: 'var(--color-bg-app)', minHeight: '100vh' }}>
      
      {/* Header */}
      <header style={{ marginBottom: '3rem' }}>
        <div className="animate-fade-in-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              Budget Planner
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
              Allocating your resources efficiently.
            </p>
          </div>
          {isDemoMode && (
             <span style={{ 
                 backgroundColor: '#fef3c7', color: '#d97706', 
                 padding: '0.5rem 1rem', borderRadius: '99px', 
                 fontSize: '0.875rem', fontWeight: '600',
                 border: '1px solid #fcd34d'
             }}>
                 Demo Mode
             </span>
          )}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Column: Form & Filters */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Form Card */}
          <Card className="sticky" style={{ top: '6rem', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)', border: 'none', background: 'var(--color-bg-surface)', padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>

                {editId ? 'Edit Budget' : 'New Budget'}
             </h3>
             
             {/* Form Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Row 1: Category & Month */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>CATEGORY</label>
                        <Input 
                            placeholder="e.g. Groceries" 
                            name="category" 
                            value={formData.category} 
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            error={errors.category}
                            icon={<BsWallet2 />}
                        />
                    </div>
                    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>MONTH</label>
                        <div style={{ position: 'relative' }}>
                            <select 
                            className="transition-smooth form-select"
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: `1px solid ${errors.month ? 'var(--color-danger)' : 'var(--color-border)'}`,
                                backgroundColor: 'var(--color-bg-surface)',
                                color: formData.month ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                                outline: 'none',
                                appearance: 'none',
                                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 1rem center',
                                backgroundSize: '0.65em auto'
                            }}
                            name="month"
                            value={formData.month}
                            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-primary)';
                                e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.month ? 'var(--color-danger)' : 'var(--color-border)';
                                e.target.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
                            }}
                            >
                            <option value="" disabled>Select</option>
                            {months.map(m => <option key={m} value={m} style={{color: 'black'}}>{m}</option>)}
                            </select>
                            <span style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1rem', color: 'var(--color-text-tertiary)', pointerEvents: 'none', display: 'flex' }}>
                                <BsCalendar size={16} />
                            </span>
                        </div>
                        {errors.month && <span style={{color: 'var(--color-danger)', fontSize: '0.75rem', display: 'block', fontWeight: '500'}}>{errors.month}</span>}
                    </div>
                </div>

                {/* Row 2: Amounts */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>BUDGET LIMIT</label>
                        <Input 
                            placeholder="0.00" 
                            name="total" 
                            type="number" 
                            onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                            error={errors.total}
                            icon={<BsCurrencyRupee />}
                            min="0"
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-secondary)', marginLeft: '0.1rem' }}>SPENT SO FAR</label>
                        <Input 
                            placeholder="0.00" 
                            name="spent" 
                            type="number" 
                            onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                            icon={<BsCurrencyRupee />}
                            min="0"
                        />
                    </div>
                </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  onClick={handleAddOrUpdate} 
                  style={{ 
                    flex: 1, 
                    padding: '0.875rem', 
                    fontWeight: '600',
                    fontSize: '0.90rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'var(--color-primary)',
                    color: 'white',
                    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2), 0 4px 6px -2px rgba(79, 70, 229, 0.1)',
                    transition: 'all 0.2s ease',
                    letterSpacing: '0.01em'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
                  {editId ? 'Save Changes' : 'Create Budget'}
                </button>
                {editId && (
                  <button 
                    onClick={handleDelete}
                    style={{ 
                      padding: '0 1rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid #fee2e2', 
                      backgroundColor: '#fef2f2', 
                      color: '#ef4444',
                      cursor: 'pointer'
                    }}
                  >
                    <BsTrash size={18} />
                  </button>
                )}
                <button 
                  onClick={clearForm} 
                  style={{ 
                    padding: '0 1.25rem', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--color-border)', 
                    backgroundColor: 'white', 
                    color: 'var(--color-text-secondary)',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                   Reset
                </button>
              </div>
            </div>
          </Card>
          
          {/* Filters Card */}
          <Card className="shadow-sm border border-slate-200" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <h4 style={{ fontWeight: '700', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#334155' }}>
                <BsFunnel className="text-indigo-500" /> Filter View
                </h4>
            </div>
            <div style={{ padding: '1.25rem' }}>
             <div style={{ position: 'relative' }}>
                <select 
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem 1rem 0.75rem 2.5rem', 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--color-border)', 
                      outline: 'none',
                      backgroundColor: 'var(--color-bg-surface)',
                      appearance: 'none',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-primary)',
                      fontWeight: '500',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                      backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748b%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '0.65em auto'
                    }}
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                  <option value="">All Months</option>
                  {months.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>
             </div>
          </Card>
        </div>

        {/* Right Column: Charts & Grid */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <div className="animate-fade-in-right">
             <BudgetChart data={filteredBudgets} />
          </div>

          <div>
             <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Your Budgets <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', padding: '2px 8px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '12px' }}>{filteredBudgets.length}</span>
             </h3>
             <div className="animate-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
               {filteredBudgets.map((item) => {
                 const percentage = Math.min(100, (item.spent / item.total) * 100);
                 const remaining = item.total - item.spent;
                 const isOver = remaining < 0;
                 // Dynamic color based on percentage
                 let progressColor = '#22c55e'; // Green
                 if (percentage > 75) progressColor = '#eab308'; // Yellow
                 if (percentage > 95) progressColor = '#ef4444'; // Red

                 const isSelected = editId === item.id;

                 return (
                     <Card
                       key={item.id}
                       onClick={() => handleEdit(item)}
                       className="group"
                       style={{ 
                          cursor: 'pointer',
                          borderRadius: '16px',
                          border: isSelected ? '2px solid #6366f1' : '1px solid #e2e8f0',
                          backgroundColor: '#ffffff',
                          boxShadow: isSelected ? '0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(99, 102, 241, 0.1)' : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)',
                          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          transform: isSelected ? 'translateY(-2px)' : 'none'
                       }}
                       onMouseEnter={e => {
                           if (!isSelected) {
                               e.currentTarget.style.transform = 'translateY(-4px)';
                               e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)';
                           }
                       }}
                       onMouseLeave={e => {
                           if (!isSelected) {
                               e.currentTarget.style.transform = 'none';
                               e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.06)';
                           }
                       }}
                     >
                        <div style={{ padding: '1.5rem' }}>
                            {/* Header Row */}
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
                                    }}>
                                        {item.category}
                                    </h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                                        Remaining
                                    </span>
                                    <span style={{ 
                                        fontSize: '1.125rem', 
                                        fontWeight: '700', 
                                        color: isOver ? '#ef4444' : '#10b981',
                                        fontFeatureSettings: '"tnum" on, "lnum" on'
                                    }}>
                                        ₹{Math.abs(remaining).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Section */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>
                                        {percentage.toFixed(0)}% <span style={{ fontWeight: '400', color: '#94a3b8' }}>used</span>
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ 
                                        height: '100%', 
                                        width: `${percentage}%`, 
                                        backgroundImage: `linear-gradient(90deg, ${progressColor}, ${progressColor})`, 
                                        borderRadius: '4px', 
                                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
                                    }} />
                                </div>
                            </div>

                            {/* Footer Stats */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f8fafc' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spent</span>
                                    <span style={{ fontSize: '0.925rem', fontWeight: '600', color: '#475569' }}>₹{Number(item.spent).toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Limit</span>
                                    <span style={{ fontSize: '0.925rem', fontWeight: '600', color: '#1e293b' }}>₹{Number(item.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Selection Indicator */}
                        {isSelected && (
                            <div style={{ 
                                position: 'absolute', 
                                top: 0, 
                                right: 0,
                                margin: '12px',
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                backgroundColor: '#6366f1',
                                boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)'
                            }} />
                        )}
                     </Card>
                 );
               })}
             </div>
             </div>
             {filteredBudgets.length === 0 && (
                <div style={{ 
                    textAlign: 'center', 
                    padding: '3rem', 
                    backgroundColor: 'var(--color-bg-surface)', 
                    borderRadius: 'var(--radius-lg)',
                    border: '1px dashed var(--color-border)',
                    color: 'var(--color-text-tertiary)'
                }}>
                    <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                        <BsWallet2 size={32} />
                    </div>
                    <p style={{ fontSize: '1.125rem', fontWeight: '500' }}>No budgets found</p>
                    <p style={{ fontSize: '0.875rem' }}>Try adjusting your filters or create a new budget.</p>
                </div>
             )}
          </div>
        </div>
      </div>
  );
};

export default BudgetPage;
