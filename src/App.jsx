import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInUpForm from './components/SignInUpForm';
import MyDashboard from './components/MyDashboard';
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
          exact path="/"
          element={<SignInUpForm onSignIn={handleSignIn} />}
        />
        <Route
          exact path="/dashboard"
          element={isAuthenticated ? <MyDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  

  );
}

export default App;
