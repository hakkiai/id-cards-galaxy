
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Users, Bus } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleCategorySelect = (category: string) => {
    // Directly navigate to generate page with the default option
    if (category === 'student') {
      navigate('/generate/student/All/excel');
    } else if (category === 'faculty') {
      navigate('/generate/faculty/All Faculty/excel');
    } else {
      navigate('/generate/bus/All/excel');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">ID Card Generation System</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            Logout
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 transform hover:shadow-md transition-all duration-300 animate-[slide-up_0.6s_ease-out]">
          <h2 className="text-xl font-semibold mb-4">Welcome, {sessionStorage.getItem('username') || 'Admin'}</h2>
          <p className="text-gray-600">
            Select a category below to generate ID cards. You can generate cards for students,
            faculty members, or bus students.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="dashboard-card cursor-pointer transition-all hover:shadow-md duration-300 border-2 border-transparent hover:border-blue-200 animate-[fade-up_0.6s_ease-out]" 
            style={{ animationDelay: "200ms" }}
            onClick={() => handleCategorySelect('student')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-blue-500" />
                Students
              </CardTitle>
              <CardDescription>
                Generate ID cards for regular students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center h-32 overflow-hidden">
                <img 
                  src="/lovable-uploads/ebc7bd20-493f-4bc4-bf90-6e19427ad00d.png" 
                  alt="Student ID" 
                  className="h-full object-contain transition-transform hover:scale-105 duration-300" 
                />
              </div>
              <Button 
                className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition-colors group"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('student'); }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Generate
                  <span className="absolute h-full w-0 right-0 top-0 bg-blue-700 group-hover:w-full transition-all duration-300 -z-10 rounded-md"></span>
                </span>
              </Button>
            </CardContent>
          </Card>
          
          <Card 
            className="dashboard-card cursor-pointer transition-all hover:shadow-md duration-300 border-2 border-transparent hover:border-red-200 animate-[fade-up_0.6s_ease-out]" 
            style={{ animationDelay: "300ms" }}
            onClick={() => handleCategorySelect('faculty')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Users className="h-6 w-6 mr-2 text-red-500" />
                Faculty
              </CardTitle>
              <CardDescription>
                Generate ID cards for faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 p-4 rounded-lg flex items-center justify-center h-32 overflow-hidden">
                <img 
                  src="/lovable-uploads/64ae1059-ac2a-4e36-aa64-6c413fd422dc.png" 
                  alt="Faculty ID" 
                  className="h-full object-contain transition-transform hover:scale-105 duration-300" 
                />
              </div>
              <Button 
                className="w-full mt-4 bg-red-500 hover:bg-red-600 transition-colors group"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('faculty'); }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Generate
                  <span className="absolute h-full w-0 right-0 top-0 bg-red-700 group-hover:w-full transition-all duration-300 -z-10 rounded-md"></span>
                </span>
              </Button>
            </CardContent>
          </Card>
          
          <Card 
            className="dashboard-card cursor-pointer transition-all hover:shadow-md duration-300 border-2 border-transparent hover:border-green-200 animate-[fade-up_0.6s_ease-out]" 
            style={{ animationDelay: "400ms" }}
            onClick={() => handleCategorySelect('bus')}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <Bus className="h-6 w-6 mr-2 text-green-500" />
                Bus Students
              </CardTitle>
              <CardDescription>
                Generate ID cards for bus students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center h-32 overflow-hidden">
                <img 
                  src="/lovable-uploads/a545a42a-b17b-4c50-9599-5574346a185f.png" 
                  alt="Bus ID" 
                  className="h-full object-contain transition-transform hover:scale-105 duration-300" 
                />
              </div>
              <Button 
                className="w-full mt-4 bg-green-500 hover:bg-green-600 transition-colors group"
                onClick={(e) => { e.stopPropagation(); handleCategorySelect('bus'); }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Generate
                  <span className="absolute h-full w-0 right-0 top-0 bg-green-700 group-hover:w-full transition-all duration-300 -z-10 rounded-md"></span>
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
