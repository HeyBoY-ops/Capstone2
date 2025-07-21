import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { db } from '../../LoginPage/firebase';
import { collection, addDoc } from 'firebase/firestore';

const BudgetForm = () => {
  const { user } = useUser();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !amount || !user?.uid) return;

    const newBudget = {
      category,
      totalBudget: Number(amount),
      spent: 0,
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, 'users', user.uid, 'budgets'), newBudget);
      setCategory('');
      setAmount('');
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Budget</button>
    </form>
  );
};

export default BudgetForm;




{/*
import React, { useState } from 'react';

const BudgetForm = ({ onAdd }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    onAdd({ category, amount: Number(amount) });
    setCategory('');
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="number"
        placeholder="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button type="submit">Add Budget</button>
    </form>
  );
};

export default BudgetForm;
*/}