
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SignInUpForm from './components/SignInUpForm';

const baseUrl = import.meta.env.VITE_BASE_URL; 

function App() {
  console.log('VITE_BASE_URL:', baseUrl)

  return (
    <>
      <SignInUpForm/>
    </>
  );
}

export default App;
