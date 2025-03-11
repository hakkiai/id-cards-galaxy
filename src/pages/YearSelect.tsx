
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ListFilter, User, FileSpreadsheet } from 'lucide-react';

const GenerateCards = () => {
  const navigate = useNavigate();
  const { category, year } = useParams<{ category: string; year: string }>();
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
  
  const handleGenerateOption = (option: string) => {
    navigate(`/generate/${category}/${year}/${option}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/category/${category}`)} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Generate {category === 'student' ? 'Student' : category === 'faculty' ? 'Faculty' : 'Bus Student'} ID Cards - {year}
          </h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Generation Method</h2>
          <p className="text-gray-600 mb-4">
            Choose how you want to generate ID cards for {year.toLowerCase()} {category === 'student' || category === 'bus' ? 'students' : 'faculty members'}.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleGenerateOption('range')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ListFilter className="h-5 w-5 mr-2 text-blue-500" />
                Generate by Roll Number Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Generate ID cards for all students within a specified roll number range.
              </p>
              <Button className="w-full mt-4" onClick={(e) => { e.stopPropagation(); handleGenerateOption('range'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleGenerateOption('individual')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2 text-green-500" />
                Generate for Individual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Generate an ID card for a specific student by entering their details.
              </p>
              <Button className="w-full mt-4" variant="outline" onClick={(e) => { e.stopPropagation(); handleGenerateOption('individual'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => handleGenerateOption('excel')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileSpreadsheet className="h-5 w-5 mr-2 text-amber-500" />
                Upload Excel File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-sm">
                Generate ID cards by uploading an Excel file containing student details.
              </p>
              <Button className="w-full mt-4" variant="outline" onClick={(e) => { e.stopPropagation(); handleGenerateOption('excel'); }}>
                Select
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateCards;
