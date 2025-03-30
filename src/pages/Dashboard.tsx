
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Bus, GraduationCap, School, LogOut, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    
    if (isAuthenticated !== 'true') {
      toast({
        title: "Access denied",
        description: "Please login to access the dashboard",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);
  
  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ID Card Management Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <School className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">
                  Ideal Institute of Technology
                </h2>
                <p className="text-gray-500">
                  ID Card Generation System
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <p>Vidyut Nagar, Kakinada</p>
              <p>East Godavari, Andhra Pradesh</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-700">Student ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for students by batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Create student ID cards with complete details, photo, barcode, and QR code.
              </p>
              <div className="h-32 bg-blue-50 rounded-md flex items-center justify-center mb-3">
                <User className="h-16 w-16 text-blue-300" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/category/student")}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Student Cards
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700">Faculty ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Create faculty ID cards with complete details, photo, designation, and department.
              </p>
              <div className="h-32 bg-green-50 rounded-md flex items-center justify-center mb-3">
                <UserPlus className="h-16 w-16 text-green-300" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/generate/faculty/All Faculty/excel")}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Generate Faculty Cards
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-700">Bus ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for bus students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Create special ID cards for students using the college bus service.
              </p>
              <div className="h-32 bg-amber-50 rounded-md flex items-center justify-center mb-3">
                <Bus className="h-16 w-16 text-amber-300" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/generate/bus/All/excel")}
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                <Bus className="mr-2 h-4 w-4" />
                Generate Bus Cards
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
