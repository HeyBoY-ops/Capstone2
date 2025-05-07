import './App.css';
import Home from './Component/Home_Page/home';
import Login from './LoginPage/login';
import SignUp from './SignUpPage/signup';
import BudgetPage from './Component/Budget/BudgetPage';
import Navbar from './Component/Navbar/navbar';
import About from './Component/About_Page/About';



import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* <Route path="/budget" element={<BudgetPage />} /> */}
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

export default App;
