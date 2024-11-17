import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';
import SignInUpForm from './components/auth/SignInUpForm';
import MyDashboard from './components/MyDashboard';
import LandingPage from './components/LandingPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mode, setMode] = useState('dark');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark' ? {
            background: {
              default: '#121212',
              paper: '#1e1e1e',
            },
          } : {
            background: {
              default: '#ffffff',
              paper: '#f5f5f5',
            },
          }),
        },
      }),
    [mode]
  );

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            element={<MyDashboard />} 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
