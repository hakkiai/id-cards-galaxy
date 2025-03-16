import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  ChevronLeft, FileDown, Search, Check, Database, UploadCloud, 
  ArrowRight, SlidersHorizontal, Edit, User, Download, Bus, Printer 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Student } from '@/utils/database';
import FileUpload from '@/components/FileUpload';
import CardTemplate from '@/components/CardTemplate';

// Sample student data for demonstration
const generateMockStudents = (year: string, category: string): Student[] => {
  const yearMap: Record<string, { prefix: string, yearRange: string }> = {
    '1st Year': { prefix: '246K1A', yearRange: '2024-2028' },
    '2nd Year': { prefix: '236K1A', yearRange: '2023-2027' },
    '3rd Year': { prefix: '226K1A', yearRange: '2022-2026' },
    '4th Year': { prefix: '216K1A', yearRange: '2021-2025' },
    'All': { prefix: '246K1A', yearRange: '2024-2028' }, // Default for 'All'
  };

  const namesPool = [
    'Venkata Sai Ram', 'Krishna Reddy', 'Srinivasa Rao', 'Prasad Reddy', 
    'Lakshmi Narayana', 'Surya Prakash', 'Durga Prasad', 'Ramakrishna',
    'Satyanarayana', 'Venkateswara Rao', 'Narasimha Rao', 'Siva Prasad',
    'Ravi Teja', 'Gopal Krishna', 'Sai Krishna', 'Murali Krishna',
    'Naga Babu', 'Pavan Kumar', 'Aditya Varma', 'Chandra Sekhar'
  ];

  if (!yearMap[year]) return [];

  const { prefix, yearRange } = yearMap[year];
  const dept = category === 'CSE' ? '05' : '42';
  
  return Array.from({ length: 20 }, (_, i) => {
    const rollSuffix = (i + 1).toString().padStart(2, '0');
    return {
      id: i + 1,
      rollNumber: `${prefix}${dept}${rollSuffix}`,
      name: namesPool[i % namesPool.length].toUpperCase(),
      department: category,
      course: 'B.Tech',
      year: year === 'All' ? ['1st Year', '2nd Year', '3rd Year', '4th Year'][i % 4] : year,
      academicYear: yearRange,
      dob: `${10 + (i % 20)}-${1 + (i % 12)}-200${3 + (i % 5)}`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][i % 6],
      aadhaar: `${8000 + i} ${4400 + i} ${9200 + i}`,
      contact: `79932${40000 + i}`,
      address: `${i+1}-${i+10}-${i+15}/1/${i+30} SRI VENKATESHWARA COLONY, KAKINADA`,
      photo: '', // Will be handled by placeholder
      category: 'student',
      isBusStudent: category === 'bus' ? true : Math.random() > 0.7 // All bus category are bus students, for others 30% random
    };
  });
};

const GenerateCards = () => {
  const navigate = useNavigate();
  const { category, year, option } = useParams<{ category: string; year: string; option: string }>();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('#1e3c8c'); // Default blue
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabOption, setTabOption] = useState('excel');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Database selection states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  
  // Range selection states
  const [showRangeSelection, setShowRangeSelection] = useState(false);
  const [startRollNumber, setStartRollNumber] = useState('');
  const [endRollNumber, setEndRollNumber] = useState('');
  
  // Student edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editContact, setEditContact] = useState('');
  const [editAadhaar, setEditAadhaar] = useState('');
  const [editIsBusStudent, setEditIsBusStudent] = useState(false);
  
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
    
    // If we're on the bus category, load bus students immediately
    if (category === 'bus') {
      loadStudents();
    }
  }, [navigate, toast, category, year, option]);
  
  const loadStudents = () => {
    setIsLoading(true);
    
    // Filter students based on the category and year
    setTimeout(() => {
      let studentsData: Student[] = [];
      
      if (category === 'bus') {
        // For bus category, only get students with bus tag
        studentsData = db.getBusStudents();
      } else {
        // For other categories, get by category and year
        studentsData = db.getStudentsByCategoryAndYear(category || 'student', year || 'All');
      }
      
      if (studentsData.length === 0) {
        // If no data in DB, generate mock students
        studentsData = generateMockStudents(year || 'All', category || 'CSE');
      }
      
      setStudents(studentsData);
      setIsLoading(false);
      
      toast({
        title: "Students loaded",
        description: `Loaded ${studentsData.length} students for ${category} ${year === 'All' ? 'all years' : year}`,
      });
    }, 1000);
  };
  
  const handleExcelUpload = (uploadedStudents: Omit<Student, 'id'>[]) => {
    setIsLoading(true);
    setTimeout(() => {
      // For bus category, ensure all uploaded students have isBusStudent = true
      if (category === 'bus') {
        uploadedStudents = uploadedStudents.map(s => ({...s, isBusStudent: true}));
      }
      
      const newStudents = db.addMultipleStudents(uploadedStudents);
      setStudents(newStudents);
      
      toast({
        title: "Cards generated",
        description: `Generated ${newStudents.length} ID cards successfully`,
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedYear(null); // Reset year selection when category changes
    setStudents([]);
  };
  
  const handleYearSelect = (year: string) => {
    setIsLoading(true);
    setSelectedYear(year);
    setShowRangeSelection(false);
    setStartRollNumber('');
    setEndRollNumber('');
    
    // Generate mock students based on selected category and year
    setTimeout(() => {
      let mockStudents = generateMockStudents(year, selectedCategory || 'CSE');
      
      // For bus category, filter to only show bus students
      if (category === 'bus') {
        mockStudents = mockStudents.filter(s => s.isBusStudent === true);
      }
      
      setStudents(mockStudents);
      setIsLoading(false);
      setShowRangeSelection(true);
      
      toast({
        title: "Students loaded",
        description: `Loaded ${mockStudents.length} students from ${selectedCategory} ${year}`,
      });
    }, 1000);
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
    
    // Filter the current students based on roll number range
    setTimeout(() => {
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
  
  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditPhoto(student.photo);
    setEditDob(student.dob);
    setEditAddress(student.address);
    setEditContact(student.contact);
    setEditAadhaar(student.aadhaar);
    setEditIsBusStudent(student.isBusStudent || false);
    // Add data for all other student fields here
    setEditDialogOpen(true);
  };
  
  const saveStudentEdit = () => {
    if (!editingStudent) return;
    
    // Convert photoFile to base64 if available
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateStudentData(base64String);
      };
      reader.readAsDataURL(photoFile);
    } else {
      updateStudentData(editPhoto);
    }
  };
  
  const updateStudentData = (photoUrl: string) => {
    if (!editingStudent) return;
    
    const updatedStudent = {
      ...editingStudent,
      name: editName,
      photo: photoUrl,
      dob: editDob,
      address: editAddress,
      contact: editContact,
      aadhaar: editAadhaar,
      isBusStudent: editIsBusStudent
    };
    
    // Update in database
    db.updateStudent(editingStudent.id, updatedStudent);
    
    // Update in local state
    const updatedStudents = students.map(student => 
      student.id === editingStudent.id ? updatedStudent : student
    );
    
    // If this is the bus category and we're removing bus tag, filter this student out
    if (category === 'bus' && !editIsBusStudent) {
      setStudents(updatedStudents.filter(s => s.isBusStudent));
    } else {
      setStudents(updatedStudents);
    }
    
    setEditDialogOpen(false);
    setPhotoFile(null);
    
    toast({
      title: "Student updated",
      description: `Successfully updated ${editName}'s details`,
    });
  };
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }
    
    setPhotoFile(file);
    
    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handlePreviewCards = () => {
    // Store the generated cards data in session storage for the preview page
    sessionStorage.setItem('generatedCards', JSON.stringify({
      students,
      template: selectedTemplate,
      cardsPerPage: 2 // Ensure exactly 2 cards per page
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-[pulse_3s_ease-in-out_infinite]">
            Ideal Institute of Technology – Student Identity Card Portal
          </h1>
        </div>

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
            <Card className="transition-shadow duration-300 hover:shadow-md animate-[fade-up_0.6s_ease-out] relative overflow-hidden">
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none"></div>
              
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
                      {/* Category Selection */}
                      {!selectedCategory && (
                        <>
                          <h3 className="text-lg font-medium mb-2">Select a Category</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {['CSE', 'CSM'].map((cat) => (
                              <div
                                key={cat}
                                className="border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500 hover:bg-green-50 hover:transform hover:scale-105"
                                onClick={() => handleCategorySelect(cat)}
                              >
                                <h3 className="text-xl font-bold text-center mb-3">{cat}</h3>
                                <p className="text-gray-600 text-center">
                                  {cat === 'CSE' ? 'Computer Science and Engineering' : 'Computer Science and Machine Learning'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Year Selection - Only show if category is selected */}
                      {selectedCategory && !selectedYear && (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Select Year for {selectedCategory}</h3>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedCategory(null)}
                              className="text-blue-500 hover:bg-blue-50"
                            >
                              Change Category
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((yr, index) => (
                              <div
                                key={yr}
                                className="border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-500 hover:bg-blue-50"
                                onClick={() => handleYearSelect(yr)}
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <h3 className="text-lg font-bold text-center">{yr}</h3>
                                <p className="text-sm text-gray-600 text-center mt-1">
                                  {yr === '1st Year' ? '2024-2028' : 
                                   yr === '2nd Year' ? '2023-2027' : 
                                   yr === '3rd Year' ? '2022-2026' : '2021-2025'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Range Selection - Only show after year selection */}
                      {showRangeSelection && selectedYear && (
                        <div className="mt-6 border-t border-dashed border-gray-300 pt-4 animate-[fade-up_0.4s_ease-out]">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <SlidersHorizontal className="h-5 w-5 text-blue-500 mr-2" />
                              <h3 className="text-lg font-medium">Roll Number Range (Optional)</h3>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleYearSelect(selectedYear)}
                              className="text-blue-500 hover:bg-blue-50"
                            >
                              Reset Range
                            </Button>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                              <Label htmlFor="startRoll" className="text-sm font-medium mb-1 block">From</Label>
                              <Input
                                id="startRoll"
                                placeholder={`e.g. ${selectedYear === '1st Year' ? '246K1A0501' : 
                                                       selectedYear === '2nd Year' ? '236K1A0501' : 
                                                       selectedYear === '3rd Year' ? '226K1A0501' : '216K1A0501'}`}
                                value={startRollNumber}
                                onChange={(e) => setStartRollNumber(e.target.value)}
                                className="border-gray-300 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex-1">
                              <Label htmlFor="endRoll" className="text-sm font-medium mb-1 block">To</Label>
                              <Input
                                id="endRoll"
                                placeholder={`e.g. ${selectedYear === '1st Year' ? '246K1A0520' : 
                                                     selectedYear === '2nd Year' ? '236K1A0520' : 
                                                     selectedYear === '3rd Year' ? '226K1A0520' : '216K1A0520'}`}
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
                      <h3 className="text-lg font-medium">Student Records</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{students.length} student(s)</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handlePreviewCards}
                          className="flex items-center gap-1"
                        >
                          <Printer className="h-4 w-4" />
                          Print Cards
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const dataStr = JSON.stringify(students, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'students-data.json';
                            a.click();
                          }}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto border rounded-md p-2">
                      {students.map((student, index) => (
                        <div 
                          key={student.rollNumber} 
                          className={`flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors ${student.isBusStudent ? 'bus-student relative overflow-hidden' : ''}`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                              {student.photo ? (
                                <img 
                                  src={student.photo} 
                                  alt={student.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.name) + '&background=random';
                                  }}
                                />
                              ) : (
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                                  alt={student.name}
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                {student.name}
                                {student.isBusStudent && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                    Bus
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span>{student.rollNumber}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span>{student.department}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </div>
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
      
      {/* Edit Student Dialog with improved scrolling and all fields */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit Student Details</DialogTitle>
            <DialogDescription>
              Update student information for ID card generation
            </DialogDescription>
          </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2">
              {editPhoto ? (
                <img 
                  src={editPhoto} 
                  alt="Student"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editName)}&background=random`;
                  }}
                />
              ) : (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editName)}&background=random`} 
                  alt="Student"
                  className="w-full h-full object-cover" 
                />
              )}
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <Button 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={() => photoInputRef.current?.click()}
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Photo
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="studentName">Full Name</Label>
            <Input 
              id="studentName" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
              placeholder="Enter student name"
            />
          </div>
          
          {editingStudent && (
            <>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll
