import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleRegisterSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <>
      {currentPage === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onShowRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onShowLogin={() => setCurrentPage('login')}
        />
      )}

      {currentPage === 'dashboard' && user && (
        <DashboardPage user={user} onLogout={handleLogout} />
      )}
    </>
  );
}

export default App;
