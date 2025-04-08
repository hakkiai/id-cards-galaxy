
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Bus, GraduationCap, School, LogOut, UserPlus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DarkModeToggle from "@/components/DarkModeToggle";
import GlobalSearch from "@/components/GlobalSearch";

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
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground animate-fade-in">ID Card Management Dashboard</h1>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Button 
              variant="outline" 
              onClick={handleLogout} 
              className="flex items-center gap-2 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive animate-fade-in"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
        
        <div className="mb-6 animate-fade-in">
          <GlobalSearch placeholder="Search any student across all departments..." searchType="all" />
        </div>
        
        <div className="bg-card rounded-lg shadow-sm p-6 mb-8 animate-[fade-up_0.6s_ease-out]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-[pulse_3s_ease-in-out_infinite]">
                <School className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Ideal Institute of Technology
                </h2>
                <p className="text-muted-foreground">
                  ID Card Generation System
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground text-right">
              <p>Vidyut Nagar, Kakinada</p>
              <p>East Godavari, Andhra Pradesh</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] animate-[fade-up_0.8s_ease-out]">
            <CardHeader className="pb-2">
              <CardTitle className="text-blue-700 dark:text-blue-400">Student ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for students by batch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create student ID cards with complete details, photo, barcode, and QR code.
              </p>
              <div className="h-32 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-center mb-3 group">
                <User className="h-16 w-16 text-blue-300 dark:text-blue-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/generate/student/All/excel")}
                className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-300"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Generate Student Cards
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] animate-[fade-up_1s_ease-out]">
            <CardHeader className="pb-2">
              <CardTitle className="text-green-700 dark:text-green-400">Faculty ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for faculty members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create faculty ID cards with complete details, photo, designation, and department.
              </p>
              <div className="h-32 bg-green-50 dark:bg-green-900/20 rounded-md flex items-center justify-center mb-3 group">
                <UserPlus className="h-16 w-16 text-green-300 dark:text-green-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/generate/faculty/All Faculty/excel")}
                className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-300"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                Generate Faculty Cards
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-all duration-300 hover:translate-y-[-5px] animate-[fade-up_1.2s_ease-out]">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-700 dark:text-amber-400">Bus ID Cards</CardTitle>
              <CardDescription>
                Generate ID cards for bus students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create special ID cards for students using the college bus service.
              </p>
              <div className="h-32 bg-amber-50 dark:bg-amber-900/20 rounded-md flex items-center justify-center mb-3 group">
                <Bus className="h-16 w-16 text-amber-300 dark:text-amber-400 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate("/generate/bus/All/excel")}
                className="w-full bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 transition-all duration-300"
              >
                <Bus className="mr-2 h-4 w-4" />
                Generate Bus Cards
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate("/settings")} 
            className="flex items-center gap-2 animate-fade-in"
          >
            <Settings size={16} />
            <span>App Settings</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
