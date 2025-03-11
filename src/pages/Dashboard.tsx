
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
    navigate(`/category/${category}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ID Card Generation System</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, {sessionStorage.getItem('username') || 'Admin'}</h2>
          <p className="text-gray-600">
            Select a category below to generate ID cards. You can generate cards for students,
            faculty members, or bus students.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleCategorySelect('student')}>
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
              <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center">
                <img 
                  src="/lovable-uploads/ebc7bd20-493f-4bc4-bf90-6e19427ad00d.png" 
                  alt="Student ID Card Example" 
                  className="h-32 object-contain" 
                />
              </div>
              <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); handleCategorySelect('student'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleCategorySelect('faculty')}>
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
              <div className="bg-red-50 p-4 rounded-lg flex items-center justify-center h-32">
                <div className="text-5xl text-red-300">
                  <Users className="h-12 w-12" />
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={(e) => { e.stopPropagation(); handleCategorySelect('faculty'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer transition-all hover:shadow-md" onClick={() => handleCategorySelect('bus')}>
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
              <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center h-32">
                <div className="text-5xl text-green-300">
                  <Bus className="h-12 w-12" />
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" onClick={(e) => { e.stopPropagation(); handleCategorySelect('bus'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
