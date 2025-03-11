
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Calendar, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const YearSelect = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();
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
    
    // Validate category
    if (category !== 'student' && category !== 'faculty' && category !== 'bus') {
      toast({
        title: "Invalid category",
        description: "The selected category is not valid",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast, category]);
  
  const categoryTitle = () => {
    switch(category) {
      case 'student': return 'Students';
      case 'faculty': return 'Faculty';
      case 'bus': return 'Bus Students';
      default: return 'Unknown Category';
    }
  };
  
  const handleYearSelect = (year: string) => {
    navigate(`/year/${category}/${year}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            {categoryTitle()} ID Cards
          </h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Academic Year</h2>
          <p className="text-gray-600 mb-4">
            Choose the academic year for which you want to generate ID cards.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {category !== 'faculty' ? (
            <>
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleYearSelect('First Year')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                    First Year
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-gray-500">2024-2027</div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleYearSelect('Second Year')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
                    Second Year
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-gray-500">2023-2026</div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleYearSelect('Third Year')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-amber-500" />
                    Third Year
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-gray-500">2022-2025</div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
              
              <Card 
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => handleYearSelect('Fourth Year')}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-purple-500" />
                    Fourth Year
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-gray-500">2021-2024</div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card 
              className="cursor-pointer transition-all hover:shadow-md col-span-2"
              onClick={() => handleYearSelect('All Faculty')}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-red-500" />
                  All Faculty Members
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div className="text-gray-500">Current Academic Year</div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearSelect;
