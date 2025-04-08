
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is already authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div 
      className="login-page flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ 
        backgroundImage: `url('/lovable-uploads/738d48d9-0459-4cf0-a162-a4b676708c0f.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </div>
  );
};

export default Index;

