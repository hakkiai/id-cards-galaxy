import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Grid2X2, User, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import CardTemplate from '@/components/CardTemplate';
import { Student } from '@/utils/database';
import ColorPicker from '@/components/ColorPicker';
import html2canvas from 'html2canvas';

const CardPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [templateColor, setTemplateColor] = useState('#1e3c8c');
  const [downloading, setDownloading] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
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
      // Initialize card refs
      cardRefs.current = students.map(() => null);
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
  
  // Function to download a single card as JPEG
  const handleDownloadCard = async (index: number) => {
    const cardElement = cardRefs.current[index];
    if (!cardElement) {
      toast({
        title: "Error",
        description: "Could not find card element to download",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const canvas = await html2canvas(cardElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `ID_Card_${students[index].rollNumber}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download complete",
        description: `ID card for ${students[index].name} downloaded successfully`,
      });
    } catch (error) {
      console.error("Error generating JPEG:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the JPEG file",
        variant: "destructive",
      });
    }
  };
  
  // Function to download all cards as JPEG
  const handleDownloadAll = async () => {
    if (downloading) return;
    
    setDownloading(true);
    toast({
      title: "Preparing download",
      description: `Processing ${students.length} ID cards for download`,
    });
    
    try {
      // Use a delay between downloads to prevent browser from freezing
      for (let i = 0; i < students.length; i++) {
        const cardElement = cardRefs.current[i];
        if (!cardElement) continue;
        
        const canvas = await html2canvas(cardElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          logging: false
        });
        
        const link = document.createElement('a');
        link.download = `ID_Card_${students[i].rollNumber}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Add a small delay between downloads
        if (i < students.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      toast({
        title: "Download complete",
        description: `All ${students.length} ID cards downloaded successfully`,
      });
    } catch (error) {
      console.error("Error generating JPEGs:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating the JPEG files",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
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
              <Button 
                onClick={handleDownloadAll}
                disabled={downloading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                {downloading ? "Processing..." : "Download All as JPEG"}
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
            <div>
              <div 
                ref={el => cardRefs.current[currentIndex] = el}
                className="card-container"
              >
                <CardTemplate 
                  student={students[currentIndex]} 
                  templateColor={templateColor}
                  showControls={false}
                />
              </div>
              
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
                  onClick={() => handleDownloadCard(currentIndex)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as JPEG
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
              {students.map((student, index) => (
                <div key={student.rollNumber} className="relative group">
                  <div 
                    ref={el => cardRefs.current[index] = el}
                    className="card-container"
                  >
                    <CardTemplate 
                      student={student} 
                      templateColor={templateColor}
                      showControls={false}
                    />
                  </div>
                  
                  {/* Download button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                    <Button 
                      onClick={() => handleDownloadCard(index)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Hidden container to keep all cards rendered for download */}
          <div className="hidden">
            {students.map((student, index) => (
              viewMode === 'grid' || index !== currentIndex ? (
                <div
                  key={`hidden-${student.rollNumber}`}
                  ref={el => {
                    // Only update ref if it's not already set
                    if (!cardRefs.current[index]) {
                      cardRefs.current[index] = el;
                    }
                  }}
                  className="card-container"
                >
                  <CardTemplate 
                    student={student} 
                    templateColor={templateColor}
                    showControls={false}
                  />
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
