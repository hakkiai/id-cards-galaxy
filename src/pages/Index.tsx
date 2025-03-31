
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
        backgroundImage: `url('/lovable-uploads/84c05854-c10e-4139-a89b-6eda5aa9532b.png')`,
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
