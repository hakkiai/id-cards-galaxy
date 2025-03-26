
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { db } from '@/utils/database';
import { LockKeyhole, User, LogIn } from 'lucide-react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple timeout to simulate network request
    setTimeout(() => {
      const isAuthenticated = db.authenticateUser(username, password);
      
      if (isAuthenticated) {
        toast({
          title: "Login successful",
          description: "Welcome to the ID Card Generation System",
          variant: "default",
        });
        
        // Save authenticated state to session storage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('username', username);
        
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl login-card animate-fade-in">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-4 animate-[float_4s_ease-in-out_infinite]" style={{ animationDelay: "200ms" }}>
          <div className="p-3 rounded-full transition-transform hover:scale-110 duration-300 animate-[pulse-glow_3s_ease-in-out_infinite]">
            <img 
              src="/lovable-uploads/57d8494a-a5a9-4c02-817d-c38211f71f61.png" 
              alt="IDEAL Institute Logo" 
              className="h-20 w-20 object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-[#2a4b3c] animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: "300ms" }}>
          ID CARD GENERATION SYSTEM
        </CardTitle>
        <CardDescription className="text-center text-[#3a5a45] animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: "400ms" }}>
          Enter your credentials to access the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: "500ms" }}>
              <Label htmlFor="username" className="text-[#2a4b3c]">Username</Label>
              <div className="relative group">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-[#5d7052] transition-colors group-focus-within:text-[#2a4b3c]" />
                <Input 
                  id="username"
                  placeholder="admin"
                  className="pl-10 transition-all border-[#a3b18a] focus:border-[#5d7052] focus:ring-2 focus:ring-[#5d7052]/20 bg-white/60"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2 animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: "600ms" }}>
              <Label htmlFor="password" className="text-[#2a4b3c]">Password</Label>
              <div className="relative group">
                <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-[#5d7052] transition-colors group-focus-within:text-[#2a4b3c]" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••"
                  className="pl-10 transition-all border-[#a3b18a] focus:border-[#5d7052] focus:ring-2 focus:ring-[#5d7052]/20 bg-white/60"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="animate-[slide-up_0.6s_ease-out]" style={{ animationDelay: "700ms" }}>
              <Button 
                type="submit" 
                className="w-full group relative overflow-hidden transition-all duration-300 transform hover:translate-y-[-2px] bg-[#4a7a8c] hover:bg-[#3a6a7c]" 
                disabled={isLoading}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4 transition-transform group-hover:rotate-12" />
                      <span>Login</span>
                    </>
                  )}
                </span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-[#4a7a8c] to-[#5d7052] opacity-0 group-hover:opacity-20 transition-opacity"></span>
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-[#3a5a45] animate-[fade-in_1s_ease-out]" style={{ animationDelay: "800ms" }}>
        © {new Date().getFullYear()} IDEAL Institute of Technology
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
