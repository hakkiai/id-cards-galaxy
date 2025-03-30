import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Printer, Home } from 'lucide-react';
import CardTemplate from '@/components/CardTemplate';
import FacultyCardTemplate from '@/components/FacultyCardTemplate';

const CardPreview = () => {
  const navigate = useNavigate();
  const [cardsData, setCardsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsRef = useRef<HTMLDivElement>(null);

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
      setCardsData(JSON.parse(storedCards));
      setLoading(false);
    } catch (err) {
      console.error("Error parsing cards data", err);
      navigate('/dashboard');
    }
  }, [navigate]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!cardsData) return 0;
    
    const cardsPerPage = cardsData.cardsPerPage || 2;
    const items = cardsData.students || cardsData.faculty || [];
    return Math.ceil(items.length / cardsPerPage);
  }, [cardsData]);

  // Get current cards to display
  const currentCards = useMemo(() => {
    if (!cardsData) return [];
    
    const cardsPerPage = cardsData.cardsPerPage || 2;
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    
    if (cardsData.type === 'faculty') {
      return cardsData.faculty.slice(start, end);
    }
    
    return cardsData.students.slice(start, end);
  }, [cardsData, currentPage]);

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

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
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
            <p className="text-gray-500">Loading cards preview...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>ID Card Preview</CardTitle>
                  <CardDescription>Preview and print your generated ID cards</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="text-sm text-gray-500">
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
                  <Button onClick={handlePrint} className="ml-2">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Cards
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  ref={cardsRef}
                  className="flex flex-col md:flex-row justify-center items-center gap-6 py-8"
                >
                  {currentCards.map((card: any, index: number) => (
                    <div key={index} className="card-container">
                      {cardsData.type === 'faculty' ? (
                        <FacultyCardTemplate 
                          faculty={card}
                          templateColor={cardsData.template}
                        />
                      ) : (
                        <CardTemplate 
                          student={card}
                          templateColor={cardsData.template}
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* Fill empty slots with blank cards */}
                  {Array.from({ length: (cardsData.cardsPerPage || 2) - currentCards.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="w-[350px] h-[550px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                      <p className="text-gray-400">Empty Slot</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between">
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
