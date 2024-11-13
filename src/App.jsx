import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInUpForm from './components/SignInUpForm';
import MyDashboard from './components/MyDashboard';
import LandingPage from './components/LandingPage';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        <Route 
          path="/auth" 
          element={<SignInUpForm onSignIn={handleSignIn} />} 
        />
        <Route 
          path="/dashboard" 
          element={<MyDashboard />       } 
        />
      </Routes>
    </Router>
   
  );
}

export default App;
