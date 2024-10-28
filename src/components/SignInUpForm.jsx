import { useState } from 'react';
import './css/SignInUpForm.css'; 
import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL; 

const SignInUpForm = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [signUpData, setSignUpData] = useState({ email: '',username: '',  role: '', password: ''});
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    const requestBody = {
      email: signUpData.email,
      username: signUpData.username,
      role:signUpData.role,
      password: signUpData.password
    };
    
    console.log('This is Request body:', requestBody);
    try {
      const response = await axios.post(`${baseUrl}/auth/signup`, signUpData);
      console.log(response.data);
      console.log("You are all set");
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
      password: signInData.password
    };
    
    console.log('This is Request body:', requestBody);

    try {
      const response = await axios.post(`${baseUrl}/auth/signin`, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Response:', response.data);
    
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Sign In failed: Unauthorized. Please check your credentials.');
          console.log(signInData.email)
          console.log(signInData.password)
        } else {
          setError(`Sign In failed: ${error.response.data.message}`);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('Sign In failed: No response from the server.');
      } else {
        console.error('Error message:', error.message);
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
          <button type="submit"onClick={handleSignInClick} disabled={isLoading}>Sign Up</button>
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
          <button type="submit" disabled={isLoading} >Sign In</button>
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
