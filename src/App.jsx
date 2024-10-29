import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInUpForm from './components/SignInUpForm';
import MyDashboard from './components/MyDashboard';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    // Assuming sign-in logic is successful
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<SignInUpForm onSignIn={handleSignIn} />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <MyDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
