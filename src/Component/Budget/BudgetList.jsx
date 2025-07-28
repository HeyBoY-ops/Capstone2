import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { db } from '../../LoginPage/firebase';
import { collection, getDocs } from 'firebase/firestore';

const BudgetList = () => {
  const { user } = useUser();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!user?.uid) return;
      try {
        const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'budgets'));
        const data = querySnapshot.docs.map(doc => {
          const item = doc.data();
          return {
            category: item.category,
            spent: item.spent,
            limit: item.totalBudget
          };
        });
        setCategories(data);
      } catch (err) {
        console.error("Error fetching budgets:", err);
      }
    };

    fetchBudgets();
  }, [user]);

  return (
    <div className="budget-list">
      <h3>Budget Summary</h3>
      {categories.map((cat, i) => (
        <div key={i} className={`category-box ${cat.spent > cat.limit ? 'over-budget' : ''}`}>
          <strong>{cat.category}</strong><br />
          Spent: ₹{cat.spent} / ₹{cat.limit}
        </div>
      ))}
    </div>
  );
};

export default BudgetList;


