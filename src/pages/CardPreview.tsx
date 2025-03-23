
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Grid2X2, User, Printer, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import CardTemplate from '@/components/CardTemplate';
import { Student } from '@/utils/database';
import ColorPicker from '@/components/ColorPicker';

const CardPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [templateColor, setTemplateColor] = useState('#1e3c8c');
  
  useEffect(() => {
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
      if (template) {
        setTemplateColor(template);
      }
    } catch (error) {
      toast({
        title: "Error loading cards",
        description: "Failed to load generated cards",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [navigate, toast]);

  const handleColorChange = (color: string) => {
    setTemplateColor(color);
  };
  
  const handlePrintAll = () => {
    window.print();
  };
  
  const handleDownloadAll = () => {
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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 no-print">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <ColorPicker initialColor={templateColor} onChange={handleColorChange} />
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
        </div>
        
        <div className="flex justify-between items-center mb-6 no-print">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {viewMode === 'single' ? `Showing card ${currentIndex + 1} of ${students.length}` : `Showing all ${students.length} cards`}
            </span>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'single' ? 'default' : 'outline'}
                onClick={() => setViewMode('single')}
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                Single View
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                size="sm"
              >
                <Grid2X2 className="h-4 w-4 mr-2" />
                Grid View
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          {/* Single card view */}
          {viewMode === 'single' && (
            <div className="no-print">
              <CardTemplate 
                student={students[currentIndex]} 
                templateColor={templateColor}
                showControls={false}
              />
              
              <div className="flex justify-center space-x-4 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
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
          )}
          
          {/* Grid view */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div key={student.rollNumber}>
                  <CardTemplate 
                    student={student} 
                    templateColor={templateColor}
                    showControls={false}
                  />
                </div>
              ))}
            </div>
          )}
          
          {/* Print layout - two cards per page with proper page breaks */}
          <div className="hidden print:block">
            <style type="text/css" media="print">
              {`
                @page {
                  size: A4;
                  margin: 0;
                }
                .print-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                  padding: 20px;
                }
                .print-card {
                  break-inside: avoid;
                  page-break-inside: avoid;
                }
                /* Force two cards per page */
                .print-card:nth-child(2n) {
                  page-break-after: always;
                }
              `}
            </style>
            <div className="print-grid">
              {students.map((student, index) => (
                <div 
                  key={student.rollNumber} 
                  className="print-card"
                >
                  <CardTemplate 
                    student={student} 
                    templateColor={templateColor}
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
