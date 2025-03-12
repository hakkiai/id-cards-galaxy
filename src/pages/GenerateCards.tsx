
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronLeft, FileDown, Search, Check, Database, UploadCloud, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Student } from '@/utils/database';
import FileUpload from '@/components/FileUpload';
import CardTemplate from '@/components/CardTemplate';

const GenerateCards = () => {
  const navigate = useNavigate();
  const { category, year, option } = useParams<{ category: string; year: string; option: string }>();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('blue');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tabOption, setTabOption] = useState('excel');
  
  // Range selection states
  const [showRangeSelection, setShowRangeSelection] = useState(false);
  const [startRollNumber, setStartRollNumber] = useState('');
  const [endRollNumber, setEndRollNumber] = useState('');
  
  // Mock batches for demonstration - in a real app, these would come from the database
  const batches = [
    { id: '1', name: 'ME 2024-A' },
    { id: '2', name: 'ME 2024-B' },
    { id: '3', name: 'CSE 2024-A' },
    { id: '4', name: 'CSE 2024-B' },
    { id: '5', name: 'ECE 2024-A' },
    { id: '6', name: 'ECE 2024-B' },
  ];
  
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
  }, [navigate, toast, category, year, option]);
  
  const handleExcelUpload = (uploadedStudents: Omit<Student, 'id'>[]) => {
    setIsLoading(true);
    setTimeout(() => {
      const newStudents = db.addMultipleStudents(uploadedStudents);
      setStudents(newStudents);
      
      toast({
        title: "Cards generated",
        description: `Generated ${newStudents.length} ID cards successfully`,
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const handleBatchSelect = (batchId: string) => {
    setIsLoading(true);
    setSelectedBatch(batchId);
    setShowRangeSelection(true); // Show range selection when batch is selected
    
    // Reset range inputs
    setStartRollNumber('');
    setEndRollNumber('');
    
    // Simulate database fetch
    setTimeout(() => {
      // In a real application, this would query the database based on batch ID
      // For now, let's generate some mock data
      const mockStudents = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        rollNumber: `246K5A0${i + 301}`,
        name: `STUDENT NAME ${i + 1}` + (i === 3 ? ' WITH A VERY LONG NAME THAT NEEDS TRUNCATION' : ''),
        department: 'ME',
        course: 'B.Tech',
        year: 'First Year',
        academicYear: '2024-2028',
        dob: '30-09-2005',
        bloodGroup: 'O+',
        aadhaar: '8908 4409 9285',
        contact: '7993245964',
        address: `2-8-15/1/38 SRI VENKATESHWARA COLONY OLD BUS STAND` + (i === 2 ? ' WITH A VERY LONG ADDRESS THAT EXCEEDS THE AVAILABLE SPACE AND NEEDS TO BE TRUNCATED' : ''),
        photo: '',
        category: 'student' as 'student' | 'faculty' | 'bus'
      }));
      
      setStudents(mockStudents);
      setIsLoading(false);
      
      toast({
        title: "Batch loaded",
        description: `Loaded ${mockStudents.length} students from batch ${batches.find(b => b.id === batchId)?.name}`,
      });
    }, 1500);
  };

  const handleRangeSelection = () => {
    if (!startRollNumber || !endRollNumber) {
      toast({
        title: "Invalid range",
        description: "Please enter both start and end roll numbers",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // In a real app, this would filter from the database
    setTimeout(() => {
      // Filter the current students based on roll number range
      const filteredStudents = students.filter(
        student => student.rollNumber >= startRollNumber && student.rollNumber <= endRollNumber
      );
      
      if (filteredStudents.length === 0) {
        toast({
          title: "No students found",
          description: "No students found in the specified range",
          variant: "destructive",
        });
      } else {
        setStudents(filteredStudents);
        
        toast({
          title: "Range applied",
          description: `Filtered to ${filteredStudents.length} students in the specified range`,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePreviewCards = () => {
    // Store the generated cards data in session storage for the preview page
    sessionStorage.setItem('generatedCards', JSON.stringify({
      students,
      template: selectedTemplate
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8 animate-[fade-in-right_0.5s_ease-out]">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="mr-4 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            Generate {category === 'student' ? 'Student' : category === 'faculty' ? 'Faculty' : 'Bus Student'} ID Cards
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="transition-shadow duration-300 hover:shadow-md animate-[fade-up_0.6s_ease-out]">
              <CardHeader>
                <CardTitle>Generate ID Cards</CardTitle>
                <CardDescription>
                  Choose a method to generate ID cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="excel" value={tabOption} onValueChange={setTabOption} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="excel" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <UploadCloud className="h-4 w-4 mr-2" />
                      Upload Excel
                    </TabsTrigger>
                    <TabsTrigger value="database" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                      <Database className="h-4 w-4 mr-2" />
                      From Database
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="excel" className="space-y-4 focus:outline-none">
                    <div className="p-1">
                      <FileUpload onUploadComplete={handleExcelUpload} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database" className="focus:outline-none">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium mb-2">Select a Batch</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className={`rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${
                              selectedBatch === batch.id 
                                ? 'border-green-500 bg-green-50 shadow-md' 
                                : 'border-gray-200 hover:border-green-200 hover:bg-gray-50'
                            }`}
                            onClick={() => handleBatchSelect(batch.id)}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{batch.name}</span>
                              {selectedBatch === batch.id && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Range Selection */}
                      {showRangeSelection && selectedBatch && (
                        <div className="mt-6 border-t border-dashed border-gray-300 pt-4 animate-[fade-up_0.4s_ease-out]">
                          <div className="flex items-center mb-3">
                            <SlidersHorizontal className="h-5 w-5 text-blue-500 mr-2" />
                            <h3 className="text-lg font-medium">Roll Number Range (Optional)</h3>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                              <Label htmlFor="startRoll" className="text-sm font-medium mb-1 block">From</Label>
                              <Input
                                id="startRoll"
                                placeholder="e.g. 246K5A0301"
                                value={startRollNumber}
                                onChange={(e) => setStartRollNumber(e.target.value)}
                                className="border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor="endRoll" className="text-sm font-medium mb-1 block">To</Label>
                              <Input
                                id="endRoll"
                                placeholder="e.g. 246K5A0310"
                                value={endRollNumber}
                                onChange={(e) => setEndRollNumber(e.target.value)}
                                className="border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex items-end">
                              <Button 
                                onClick={handleRangeSelection} 
                                className="bg-blue-500 hover:bg-blue-600"
                                disabled={!startRollNumber || !endRollNumber}
                              >
                                Apply Range
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Loading data...</p>
                  </div>
                )}
                
                {!isLoading && students.length > 0 && (
                  <div className="mt-6 border-t pt-6 animate-[fade-up_0.6s_ease-out]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Generated Cards</h3>
                      <div className="text-sm text-gray-500">{students.length} card(s)</div>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                      {students.map((student, index) => (
                        <div 
                          key={student.rollNumber} 
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded transition-colors"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-500">{student.rollNumber}</div>
                          </div>
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                    <Button 
                      onClick={handlePreviewCards} 
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group"
                      disabled={students.length === 0}
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Preview ID Cards</span>
                      <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {students.length > 0 && (
              <Card className="animate-[fade-up_0.8s_ease-out]">
                <CardHeader>
                  <CardTitle>Card Preview</CardTitle>
                  <CardDescription>Preview your generated ID card</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <CardTemplate 
                    student={students[0]} 
                    templateColor={selectedTemplate} 
                  />
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="transition-shadow duration-300 hover:shadow-md sticky top-6 animate-[fade-in-right_0.7s_ease-out]">
              <CardHeader>
                <CardTitle>Card Template</CardTitle>
                <CardDescription>
                  Choose a template color for your ID cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['#1e3c8c', '#e53935', '#4caf50', '#9c27b0', '#ff9800', '#795548'].map((color) => (
                      <div 
                        key={color}
                        className={`w-full h-12 rounded-md cursor-pointer border-2 transition-all duration-200 ${
                          selectedTemplate === color ? 'border-black shadow-md scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedTemplate(color)}
                      />
                    ))}
                  </div>
                  
                  <div className="border rounded-md p-3 mt-4">
                    <Label>Selected Color:</Label>
                    <div className="mt-2 flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full" 
                        style={{ backgroundColor: selectedTemplate }}
                      ></div>
                      <span className="text-sm font-mono">{selectedTemplate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Template preview:</p>
                    <div className="aspect-[2/3] bg-white border rounded relative overflow-hidden shadow-sm">
                      <div className="h-1/5 w-full" style={{ backgroundColor: selectedTemplate }}></div>
                      <div className="h-3/5 w-full bg-white p-3">
                        <div className="w-16 h-20 mx-auto bg-gray-200 mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4 mx-auto mb-1"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                        <div className="grid grid-cols-2 gap-1">
                          <div className="h-1.5 bg-gray-200 rounded"></div>
                          <div className="h-1.5 bg-gray-200 rounded"></div>
                          <div className="h-1.5 bg-gray-200 rounded"></div>
                          <div className="h-1.5 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-1/5 w-full" style={{ backgroundColor: selectedTemplate, opacity: 0.8 }}>
                        <div className="h-2 bg-white/20 rounded w-3/4 mx-auto mt-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCards;
