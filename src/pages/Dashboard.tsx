
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Users, Bus, LogOut, Sun, Moon, Droplet } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Toggle } from '@/components/ui/toggle';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { updatePrimaryColor } = useTheme();
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      toast({
        title: "Access denied",
        description: "Please login to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, [navigate, toast]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('username');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      updatePrimaryColor('#ffffff');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      updatePrimaryColor('#4052b5');
    }
  };
  
  const handleCategorySelect = (category: string) => {
    // Navigate to the appropriate page based on the category selected
    if (category === 'student') {
      navigate('/generate/student/All/excel');
    } else if (category === 'faculty') {
      navigate('/generate/faculty/All Faculty/excel');
    } else {
      // For bus category, we only want students with the bus tag
      navigate('/generate/bus/All/excel');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-[pulse_3s_ease-in-out_infinite]">
            Ideal Institute of Technology – Student Identity Card Generation Portal
          </h1>
        </div>
        
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
          <div className="flex items-center gap-3">
            <Toggle 
              aria-label="Toggle theme" 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-400 animate-[spin_1s_ease-out]" />
              ) : (
                <Moon className="h-5 w-5 text-blue-700 animate-[spin_1s_ease-out]" />
              )}
            </Toggle>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="group relative overflow-hidden dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <span className="relative z-10 flex items-center gap-2 transition-transform duration-300 group-hover:translate-x-1">
                Logout
                <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-red-100 dark:bg-red-900/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm mb-8 transform hover:shadow-md transition-all duration-300 animate-[slide-up_0.6s_ease-out]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white admin-title">Welcome, {sessionStorage.getItem('username') || 'Admin'}</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Select a category below to generate ID cards. You can generate cards for students,
            faculty members, or bus students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Student Generation Card */}
          <Card 
            className="relative overflow-hidden cursor-pointer group dashboard-card before:animate-border-glow"
            onClick={() => handleCategorySelect('student')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            <CardContent className="p-6 relative z-10">
              <div className="h-40 mb-4 flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  <GraduationCap className="h-14 w-14 text-blue-500 dark:text-blue-400" />
                  <div className="absolute inset-0 bg-blue-200/30 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 flex items-center justify-center">
                    <GraduationCap className="h-14 w-14 text-blue-600 dark:text-blue-300 animate-[float_3s_ease-in-out_infinite]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4 text-blue-700 dark:text-blue-300 group-hover:scale-105 transition-transform duration-300">Student Generate</h3>
              </div>
              
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('student'); }}
              >
                Generate Student IDs
              </Button>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Generate ID cards for Computer Science and Engineering (CSE) and Computer Science and Machine Learning (CSM) students</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Faculty Generation Card */}
          <Card 
            className="relative overflow-hidden cursor-pointer group dashboard-card before:animate-border-glow"
            onClick={() => handleCategorySelect('faculty')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            <CardContent className="p-6 relative z-10">
              <div className="h-40 mb-4 flex flex-col items-center justify-center">
                <div className="w-28 h-28 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  <Users className="h-14 w-14 text-red-500 dark:text-red-400" />
                  <div className="absolute inset-0 bg-red-200/30 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 flex items-center justify-center">
                    <Users className="h-14 w-14 text-red-600 dark:text-red-300 animate-[float_3s_ease-in-out_infinite]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4 text-red-700 dark:text-red-300 group-hover:scale-105 transition-transform duration-300">Faculty Generate</h3>
              </div>
              
              <Button 
                className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('faculty'); }}
              >
                Generate Faculty IDs
              </Button>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Generate ID cards for teaching and administrative faculty members</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Bus Generation Card */}
          <Card 
            className="relative overflow-hidden cursor-pointer group dashboard-card before:animate-border-glow"
            onClick={() => handleCategorySelect('bus')}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
            
            <CardContent className="p-6 relative z-10">
              <div className="h-40 mb-4 flex flex-col items-center justify-center">
                <div className="w-28 h-28 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  <Bus className="h-14 w-14 text-amber-500 dark:text-amber-400" />
                  <div className="absolute inset-0 bg-amber-200/30 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 flex items-center justify-center">
                    <Bus className="h-14 w-14 text-amber-600 dark:text-amber-300 animate-[float_3s_ease-in-out_infinite]" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mt-4 text-amber-700 dark:text-amber-300 group-hover:scale-105 transition-transform duration-300">Bus Generate</h3>
              </div>
              
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('bus'); }}
              >
                Generate Bus IDs
              </Button>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p>Generate ID cards for students who use transportation services</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
