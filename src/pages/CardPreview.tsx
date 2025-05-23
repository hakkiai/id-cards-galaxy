
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Printer, Home, Download, Grid2X2, Grid3X3, Image } from 'lucide-react';
import CardTemplate from '@/components/CardTemplate';
import FacultyCardTemplate from '@/components/FacultyCardTemplate';
import EnhancedColorPicker from '@/components/EnhancedColorPicker';
import { downloadElementAsJpeg, downloadElementsAsZippedJpegs } from '@/utils/cardExport';
import BusCardTemplate from '@/components/BusCardTemplate';
import { useToast } from '@/hooks/use-toast';

const CardPreview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cardsData, setCardsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardColor, setCardColor] = useState('#1e3c8c');
  const [gridView, setGridView] = useState('single'); // single, grid-3x3
  const [downloading, setDownloading] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/');
      return;
    }
    
    // Get cards data from session storage
    const storedCards = sessionStorage.getItem('generatedCards');
    if (!storedCards) {
      navigate('/dashboard');
      return;
    }
    
    try {
      const parsedData = JSON.parse(storedCards);
      // Set the template color if it exists
      if (parsedData.template) {
        setCardColor(parsedData.template);
      }
      setCardsData(parsedData);
      setLoading(false);
    } catch (err) {
      console.error("Error parsing cards data", err);
      navigate('/dashboard');
    }
  }, [navigate]);

  // Calculate total pages based on grid view mode
  const totalPages = useMemo(() => {
    if (!cardsData) return 0;
    
    const cardsPerPage = gridView === 'single' ? 1 : 9; // 1 for single view, 9 for 3x3 grid
    const items = cardsData.students || cardsData.faculty || [];
    return Math.ceil(items.length / cardsPerPage);
  }, [cardsData, gridView]);

  // Get current cards to display
  const currentCards = useMemo(() => {
    if (!cardsData) return [];
    
    const cardsPerPage = gridView === 'single' ? 1 : 9; // 1 for single view, 9 for 3x3 grid
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    
    if (cardsData.type === 'faculty') {
      return cardsData.faculty.slice(start, end);
    }
    
    return cardsData.students.slice(start, end);
  }, [cardsData, currentPage, gridView]);

  const handlePrint = () => {
    if (!cardsRef.current) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = cardsRef.current.innerHTML;
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>ID Card Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              .card-container {
                margin: 10px;
                page-break-inside: avoid;
              }
              @media print {
                body * {
                  visibility: hidden;
                }
                .card-container, .card-container * {
                  visibility: visible;
                }
                .card-container {
                  position: absolute;
                  left: 0;
                  top: 0;
                }
              }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };
  
  const handleDownloadJpeg = async (singleCardIndex?: number) => {
    if (!cardsRef.current) return;
    setDownloading(true);
    
    try {
      if (singleCardIndex !== undefined) {
        // Download a single card
        const cardElements = cardsRef.current.querySelectorAll('.card-container');
        if (cardElements[singleCardIndex]) {
          const success = await downloadElementAsJpeg(
            cardElements[singleCardIndex] as HTMLElement, 
            `id_card_${singleCardIndex + 1}.jpeg`
          );
          
          if (success) {
            toast({
              title: "Download Complete",
              description: "ID card has been downloaded successfully.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Download Failed",
              description: "There was an issue downloading the ID card.",
            });
          }
        }
      } else {
        // Download all cards as a zip
        const allCards = cardsData.students || cardsData.faculty || [];
        const cardType = cardsData.type === 'faculty' ? 'faculty' : 'student';
        const cardElements = Array.from(cardsRef.current.querySelectorAll('.card-container')) as HTMLElement[];
        
        // Show download progress toast
        toast({
          title: "Preparing Download",
          description: `Creating ${cardElements.length} ID cards for download...`,
        });
        
        const success = await downloadElementsAsZippedJpegs(
          cardElements,
          `all_${cardType}_cards.zip`,
          cardType
        );
        
        if (success) {
          toast({
            title: "Download Complete",
            description: `All ${cardElements.length} ID cards have been downloaded.`,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Download Failed",
            description: "There was an issue downloading the ID cards.",
          });
        }
      }
    } catch (error) {
      console.error('Error downloading cards:', error);
      toast({
        variant: "destructive",
        title: "Download Error",
        description: "An unexpected error occurred during download.",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-background p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">ID Card Preview</h1>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading cards preview...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div className="animate-fade-in">
                  <CardTitle>ID Card Preview</CardTitle>
                  <CardDescription>Preview and download your generated ID cards</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 p-2 border rounded-md">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">Card Color:</span>
                    <EnhancedColorPicker 
                      initialColor={cardColor} 
                      onChange={(color) => {
                        setCardColor(color);
                        // Update in session storage
                        if (cardsData) {
                          const updatedData = {...cardsData, template: color};
                          sessionStorage.setItem('generatedCards', JSON.stringify(updatedData));
                        }
                      }} 
                    />
                  </div>
                  
                  <div className="flex items-center p-2 border rounded-md animate-fade-in">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setGridView('single')}
                      className={gridView === 'single' ? 'bg-primary/10' : ''}
                      title="Single Card View"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setGridView('grid-3x3')}
                      className={gridView === 'grid-3x3' ? 'bg-primary/10' : ''}
                      title="3x3 Grid View"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 animate-fade-in">
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="rounded-r-none"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-l-none"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handlePrint} className="ml-2 whitespace-nowrap">
                      <Printer className="h-4 w-4 mr-2" />
                      Print Cards
                    </Button>
                    <Button 
                      onClick={() => handleDownloadJpeg()} 
                      disabled={downloading}
                      className="bg-green-600 hover:bg-green-700 whitespace-nowrap"
                    >
                      {downloading ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Image className="h-4 w-4 mr-2" />
                      )}
                      Download All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={cardsRef}
                  className={`${
                    gridView === 'grid-3x3' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex justify-center'
                  }`}
                >
                  {currentCards.map((card: any, index: number) => (
                    <div key={index} className="card-container group relative mb-6">
                      {/* Download button for individual card */}
                      <Button 
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownloadJpeg(index)}
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-black/70"
                        title="Download this card"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <div className="animate-[fade-in_0.5s_ease-out,scale-in_0.5s_ease-out] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                        {cardsData.type === 'faculty' ? (
                          <FacultyCardTemplate 
                            faculty={card}
                            templateColor={cardColor}
                          />
                        ) : cardsData.cardType === 'bus' ? (
                          <BusCardTemplate 
                            student={card}
                            templateColor={cardColor}
                          />
                        ) : (
                          <CardTemplate 
                            student={card}
                            templateColor={cardColor}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between animate-fade-in">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-4 w-4 mr-2" />
                Return to Dashboard
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Page
                </Button>
                <Button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next Page
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardPreview;
