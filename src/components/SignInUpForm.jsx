/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './css/SignInUpForm.css'; 
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL; 

const SignInUpForm = ({ onSignIn }) => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState({ email: '', username: '', role: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    const savedToken = JSON.parse(sessionStorage.getItem('token'));
    if (savedToken) setToken(savedToken);
  }, []);

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData({ ...signInData, [name]: value });
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, signUpData);
      console.log("Sign-Up successful:", response.data);

      if (response.data.token) {
        setToken(response.data.token);
        sessionStorage.setItem('token', JSON.stringify(response.data.token));
      }
    } catch (error) {
      setError('Sign Up failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const requestBody = {
      email: signInData.email.trim().toLowerCase(),
      password: signInData.password,
    };

    try {
      const response = await axios.post(`${baseUrl}/auth/signin`, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Sign-In successful:', response.data);

      if (response.data.token) {
        setToken(response.data.token);
        sessionStorage.setItem('token', JSON.stringify(response.data.token));
        onSignIn(); 
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        setError(error.response.status === 401 
          ? 'Sign In failed: Unauthorized. Please check your credentials.' 
          : `Sign In failed: ${error.response.data.message}`);
      } else {
        console.error('Error:', error.message);
        setError('Sign In failed: Network error.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
     
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignUpSubmit}>
          <h1>Create Account</h1>
          <span>or use your email for registration</span>
          <input type="text" name="email" placeholder="Email" onChange={handleSignUpChange} required />
          <input type="text" name="username" placeholder="Username" onChange={handleSignUpChange} required />
          <input type="text" name="role" placeholder="Role" onChange={handleSignUpChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleSignUpChange} required />
          <button type="submit" disabled={isLoading}>Sign Up</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={handleSignInSubmit}>
          <img src="/src/assets/componentsRes/hkotiskLogo.png" alt="Logo" className='Logo' />
          <h1 className='sign-in-text'>Sign in</h1>
          <div className='marg'></div>
          <input type="email" name="email" placeholder="Email" onChange={handleSignInChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleSignInChange} required />
          <div className='marg'></div>
          <button type="submit" disabled={isLoading}>Sign In</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your personal details and start your journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default SignInUpForm;


const MyLogOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`${baseUrl}/auth/signout`);
      console.log('SignOut successful:', response.data);
      setSuccessMessage('You have been successfully signed out.');
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to sign out. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSignInSubmit}>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing out...' : 'Sign Out'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </>
  );
};



