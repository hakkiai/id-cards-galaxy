
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
        
        {/* Admin Dashboard Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="shadow-md p-4 animate-[fade-up_0.4s_ease-out]">
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Student Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center bg-blue-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">450</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-green-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">190</div>
                  <div className="text-sm text-gray-600">Bus Students</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Computer Science and Engineering</span>
                  <span className="font-semibold">240</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>Computer Science and Machine Learning</span>
                  <span className="font-semibold">210</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md p-4 animate-[fade-up_0.4s_ease-out]" style={{ animationDelay: "100ms" }}>
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Faculty Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center bg-purple-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">64</div>
                  <div className="text-sm text-gray-600">Total Faculty</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-pink-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600">12</div>
                  <div className="text-sm text-gray-600">Departments</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/64ae1059-ac2a-4e36-aa64-6c413fd422dc.png" 
                  alt="Faculty Group" 
                  className="h-28 object-contain rounded-lg shadow-sm border border-gray-200" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md p-4 animate-[fade-up_0.4s_ease-out]" style={{ animationDelay: "200ms" }}>
            <CardHeader className="p-0 pb-3">
              <CardTitle className="text-lg">Bus Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center bg-amber-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-amber-600">12</div>
                  <div className="text-sm text-gray-600">Total Buses</div>
                </div>
                <div className="flex flex-col items-center justify-center bg-orange-50 p-3 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">190</div>
                  <div className="text-sm text-gray-600">Bus Students</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="relative w-full h-28 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-amber-100">
                  <div className="absolute inset-0 bus-animation"></div>
                  <img 
                    src="/lovable-uploads/a545a42a-b17b-4c50-9599-5574346a185f.png" 
                    alt="Institute Bus" 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-16 object-contain" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
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
                <div className="flex -space-x-4 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Venkata+Sai&background=random" 
                    alt="Student" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                  <img 
                    src="https://ui-avatars.com/api/?name=Durga+Prasad&background=random" 
                    alt="Student" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                  <img 
                    src="https://ui-avatars.com/api/?name=Lakshmi+Narayana&background=random" 
                    alt="Student" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                </div>
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
                <div className="flex -space-x-4 overflow-hidden">
                  <img 
                    src="https://ui-avatars.com/api/?name=Dr+Ramesh&background=random" 
                    alt="Faculty" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                  <img 
                    src="https://ui-avatars.com/api/?name=Prof+Suresh&background=random" 
                    alt="Faculty" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                  <img 
                    src="https://ui-avatars.com/api/?name=Dr+Padma&background=random" 
                    alt="Faculty" 
                    className="h-20 w-20 rounded-full border-2 border-white object-cover" 
                  />
                </div>
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
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center h-32 overflow-hidden relative">
                <div className="bus-route-animation absolute inset-0 opacity-20"></div>
                <div className="flex -space-x-4 overflow-hidden relative z-10">
                  <div className="h-20 w-20 rounded-full border-2 border-white overflow-hidden bus-student-avatar">
                    <img 
                      src="https://ui-avatars.com/api/?name=Sai+Kumar&background=random" 
                      alt="Bus Student" 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute bottom-0 w-full bg-amber-500 text-white text-[8px] font-bold text-center">BUS</div>
                  </div>
                  <div className="h-20 w-20 rounded-full border-2 border-white overflow-hidden bus-student-avatar">
                    <img 
                      src="https://ui-avatars.com/api/?name=Priya+Reddy&background=random" 
                      alt="Bus Student" 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute bottom-0 w-full bg-amber-500 text-white text-[8px] font-bold text-center">BUS</div>
                  </div>
                  <div className="h-20 w-20 rounded-full border-2 border-white overflow-hidden bus-student-avatar">
                    <img 
                      src="https://ui-avatars.com/api/?name=Srikanth+T&background=random" 
                      alt="Bus Student" 
                      className="h-full w-full object-cover" 
                    />
                    <div className="absolute bottom-0 w-full bg-amber-500 text-white text-[8px] font-bold text-center">BUS</div>
                  </div>
                </div>
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
