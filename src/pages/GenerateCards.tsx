
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChevronLeft, FileDown, Search, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Student } from '@/utils/database';
import FileUpload from '@/components/FileUpload';

const GenerateCards = () => {
  const navigate = useNavigate();
  const { category, year, option } = useParams<{ category: string; year: string; option: string }>();
  const { toast } = useToast();
  const [startRoll, setStartRoll] = useState('');
  const [endRoll, setEndRoll] = useState('');
  const [individualRoll, setIndividualRoll] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blue');
  const [students, setStudents] = useState<Student[]>([]);
  
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
    
    // Validate option
    if (option !== 'range' && option !== 'individual' && option !== 'excel') {
      toast({
        title: "Invalid option",
        description: "The selected generation option is not valid",
        variant: "destructive",
      });
      navigate(`/year/${category}/${year}`);
    }
  }, [navigate, toast, category, year, option]);
  
  const handleGenerateByRange = () => {
    if (!startRoll || !endRoll) {
      toast({
        title: "Missing information",
        description: "Please provide both start and end roll numbers",
        variant: "destructive",
      });
      return;
    }
    
    const filteredStudents = db.getStudentsByRollNumberRange(startRoll, endRoll);
    
    if (filteredStudents.length === 0) {
      toast({
        title: "No students found",
        description: "No students found in the specified roll number range",
        variant: "destructive",
      });
      return;
    }
    
    setStudents(filteredStudents);
    
    toast({
      title: "Cards generated",
      description: `Generated ${filteredStudents.length} ID cards successfully`,
    });
  };
  
  const handleGenerateIndividual = () => {
    if (!individualRoll) {
      toast({
        title: "Missing information",
        description: "Please provide a roll number",
        variant: "destructive",
      });
      return;
    }
    
    const student = db.getStudentByRollNumber(individualRoll);
    
    if (!student) {
      toast({
        title: "Student not found",
        description: "No student found with the specified roll number",
        variant: "destructive",
      });
      return;
    }
    
    setStudents([student]);
    
    toast({
      title: "Card generated",
      description: "ID card generated successfully",
    });
  };
  
  const handleExcelUpload = (uploadedStudents: Omit<Student, 'id'>[]) => {
    const newStudents = db.addMultipleStudents(uploadedStudents);
    setStudents(newStudents);
    
    toast({
      title: "Cards generated",
      description: `Generated ${newStudents.length} ID cards successfully`,
    });
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/year/${category}/${year}`)} 
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">
            Generate ID Cards
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate ID Cards</CardTitle>
                <CardDescription>
                  {option === 'range' && 'Generate ID cards by roll number range'}
                  {option === 'individual' && 'Generate an ID card for an individual'}
                  {option === 'excel' && 'Generate ID cards by uploading an Excel file'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {option === 'range' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start-roll">Start Roll Number</Label>
                        <Input 
                          id="start-roll" 
                          placeholder="e.g. 246K5A0301" 
                          value={startRoll}
                          onChange={(e) => setStartRoll(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end-roll">End Roll Number</Label>
                        <Input 
                          id="end-roll" 
                          placeholder="e.g. 246K5A0310" 
                          value={endRoll}
                          onChange={(e) => setEndRoll(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleGenerateByRange} className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Generate Cards
                    </Button>
                  </div>
                )}
                
                {option === 'individual' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="individual-roll">Roll Number</Label>
                      <Input 
                        id="individual-roll" 
                        placeholder="e.g. 246K5A0301" 
                        value={individualRoll}
                        onChange={(e) => setIndividualRoll(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleGenerateIndividual} className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Generate Card
                    </Button>
                  </div>
                )}
                
                {option === 'excel' && (
                  <div className="space-y-4">
                    <FileUpload onUploadComplete={handleExcelUpload} />
                  </div>
                )}
                
                {students.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Generated Cards</h3>
                      <div className="text-sm text-gray-500">{students.length} card(s)</div>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                      {students.map((student) => (
                        <div 
                          key={student.rollNumber} 
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
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
                      className="w-full mt-4"
                      disabled={students.length === 0}
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      Preview ID Cards
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Card Template</CardTitle>
                <CardDescription>
                  Choose a template for your ID cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="blue" onValueChange={setSelectedTemplate}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="blue">Blue</TabsTrigger>
                    <TabsTrigger value="red">Red</TabsTrigger>
                    <TabsTrigger value="green">Green</TabsTrigger>
                  </TabsList>
                  
                  <div className="border rounded-md p-2 transition-all duration-300">
                    <div className={`w-full h-20 rounded ${
                      selectedTemplate === 'blue' ? 'bg-ideal-blue' : 
                      selectedTemplate === 'red' ? 'bg-ideal-red' : 
                      'bg-ideal-green'
                    }`}>
                      <div className="p-2 text-white text-center">
                        <div className="text-xs">IDEAL INSTITUTE</div>
                        <div className="text-xs mt-1">ID CARD TEMPLATE</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Template preview:</p>
                    <div className="aspect-[2/3] bg-white border rounded relative overflow-hidden">
                      <div className={`h-1/5 w-full ${
                        selectedTemplate === 'blue' ? 'bg-ideal-blue' : 
                        selectedTemplate === 'red' ? 'bg-ideal-red' : 
                        'bg-ideal-green'
                      }`}></div>
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
                      <div className={`h-1/5 w-full ${
                        selectedTemplate === 'blue' ? 'bg-ideal-lightBlue' : 
                        selectedTemplate === 'red' ? 'bg-ideal-red/80' : 
                        'bg-ideal-green/80'
                      }`}>
                        <div className="h-2 bg-white/20 rounded w-3/4 mx-auto mt-2"></div>
                      </div>
                    </div>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCards;
