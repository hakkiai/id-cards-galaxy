
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Printer, Download, ChevronRight, ChevronLeft as ChevronLeftIcon } from 'lucide-react';
import CardTemplate from '@/components/CardTemplate';
import { Student } from '@/utils/database';

const CardPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [template, setTemplate] = useState<'blue' | 'red' | 'green'>('blue');
  const [currentIndex, setCurrentIndex] = useState(0);
  
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
      return;
    }
    
    // Get generated cards data from session storage
    const generatedCardsJSON = sessionStorage.getItem('generatedCards');
    if (!generatedCardsJSON) {
      toast({
        title: "No cards to preview",
        description: "Please generate cards first",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    try {
      const { students, template } = JSON.parse(generatedCardsJSON);
      setStudents(students);
      setTemplate(template as 'blue' | 'red' | 'green');
    } catch (error) {
      toast({
        title: "Error loading cards",
        description: "Failed to load generated cards",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);
  
  const handlePrintAll = () => {
    window.print();
  };
  
  const handleDownloadAll = () => {
    // In a real application, you would implement a proper PDF generation
    // and download functionality here. For this demo, we'll just show a toast.
    toast({
      title: "Download initiated",
      description: `Downloading ${students.length} ID cards as PDF`,
    });
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < students.length - 1 ? prev + 1 : prev));
  };
  
  if (students.length === 0) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8 no-print">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            ID Card Preview
          </h1>
        </div>
        
        <div className="flex justify-between items-center mb-6 no-print">
          <div>
            <span className="text-sm text-gray-500">
              Showing card {currentIndex + 1} of {students.length}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handlePrintAll}>
              <Printer className="h-4 w-4 mr-2" />
              Print All
            </Button>
            <Button onClick={handleDownloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {/* Single card view for screen */}
          <div className="no-print">
            <CardTemplate 
              student={students[currentIndex]} 
              templateColor={template}
              showControls={true}
            />
            
            <div className="flex justify-center space-x-4 mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button 
                variant="outline" 
                onClick={handleNext}
                disabled={currentIndex === students.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          
          {/* Multiple cards for printing */}
          <div className="hidden print:block">
            <div className="grid grid-cols-2 gap-4">
              {students.map((student) => (
                <div key={student.rollNumber} className="page-break">
                  <CardTemplate 
                    student={student} 
                    templateColor={template}
                    showControls={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
