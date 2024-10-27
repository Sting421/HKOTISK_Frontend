import  { useState } from 'react';
import './css/SignInUpForm.css'; // Import the CSS here


const SignInUpForm = () => {
  const [rightPanelActive, setRightPanelActive] = useState(false);

  const handleSignUpClick = () => setRightPanelActive(true);
  const handleSignInClick = () => setRightPanelActive(false);

  return (
    <div className={`container ${rightPanelActive ? 'right-panel-active' : ''}`} id="container">
      <div className="form-container sign-up-container">
        <form>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social"><i className="fab fa-google-plus-g"></i></a>
            <a href="#" className="social"><i className="fab fa-linkedin-in"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>

      <div className="form-container sign-in-container">
       
        <form>
        <img src="/src/assets/componentsRes/hkotiskLogo.png" alt="Logo" className='Logo' />
        <h1 className='sign-in-text'>Sign in</h1>
          <div className='marg'></div>
          <input type="email" placeholder="ID Number" />
          <input type="password" placeholder="Password" />
          <div className='marg'></div>
          <button>Sign In</button>
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
