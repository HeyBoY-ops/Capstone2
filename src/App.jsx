import './App.css';
import Home from './Component/Home_Page/home';
import Login from './LoginPage/login';
import SignUp from './LoginPage/signup';
import BudgetPage from './Component/Budget/BudgetPage';
import Navbar from './Component/Navbar/navbar';
import BlogPage from './Component/Blog/BlogPage';
import BlogDetail from './Component/Blog/BlogDetail';
import MonthlyBreakdown from "./pages/MonthlyBreakdown";



import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/monthly-breakdown" element={<MonthlyBreakdown />} />
      </Routes>
    </>
  );
}

export default App;
