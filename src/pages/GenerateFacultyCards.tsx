import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { 
  ChevronLeft, FileDown, Search, Check, Database, UploadCloud, 
  ArrowRight, SlidersHorizontal, Edit, User, Download, Printer, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Faculty } from '@/utils/database';
import FileUpload from '@/components/FileUpload';
import FacultyCardTemplate from '@/components/FacultyCardTemplate';

// Sample faculty data for demonstration
const generateMockFaculty = (department: string): Faculty[] => {
  const namesPool = [
    'Dr. Venkata Rao', 'Prof. Lakshmi Narayana', 'Dr. Surya Prakash', 'Prof. Durga Prasad', 
    'Dr. Ramakrishna', 'Prof. Satyanarayana', 'Dr. Venkateswara Rao', 'Prof. Narasimha Rao',
    'Dr. Siva Prasad', 'Prof. Ravi Teja', 'Dr. Gopal Krishna', 'Prof. Sai Krishna',
    'Dr. Murali Krishna', 'Prof. Naga Babu', 'Dr. Pavan Kumar', 'Prof. Aditya Varma'
  ];
  
  const designationsPool = [
    'Professor', 'Associate Professor', 'Assistant Professor', 'HOD', 
    'Dean', 'Principal', 'Director', 'Lecturer'
  ];
  
  const qualificationsPool = [
    'Ph.D in Computer Science', 'M.Tech in CSE', 'Ph.D in AI', 'M.Tech in IT',
    'Ph.D in Machine Learning', 'M.Tech in Data Science', 'Ph.D in Networking', 'M.Tech in Cyber Security'
  ];
  
  return Array.from({ length: 10 }, (_, i) => {
    return {
      id: i + 1,
      facultyId: `FAC-${department}-${100 + i}`,
      name: namesPool[i % namesPool.length],
      department: department,
      designation: designationsPool[i % designationsPool.length],
      qualification: qualificationsPool[i % qualificationsPool.length],
      joiningDate: `${10 + (i % 20)}-${1 + (i % 12)}-20${10 + (i % 10)}`,
      bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'][i % 6],
      contact: `98765${40000 + i}`,
      email: `faculty${i+1}@idealinstitute.edu.in`,
      address: `${i+1}-${i+10}-${i+15}/1/${i+30} PROFESSOR QUARTERS, KAKINADA`,
      photo: '', // Will be handled by placeholder
      category: 'faculty'
    };
  });
};

const GenerateFacultyCards = () => {
  const navigate = useNavigate();
  const { category, year, option } = useParams<{ category: string; year: string; option: string }>();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('#1e8e3e'); // Default green for faculty
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabOption, setTabOption] = useState('database'); // Default to database
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Database selection states
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  // Faculty creation dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState<Partial<Faculty>>({
    name: '',
    facultyId: '',
    department: '',
    designation: '',
    qualification: '',
    joiningDate: '',
    bloodGroup: '',
    contact: '',
    email: '',
    address: '',
    photo: '',
    category: 'faculty'
  });
  
  // Faculty edit dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  
  const cardRef = useRef<HTMLDivElement>(null);
  
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
    
    // If we have department and year in the URL, load faculty data
    if (category === 'faculty') {
      loadFacultyData();
    }
  }, [navigate, toast, category, year, option]);
  
  const loadFacultyData = () => {
    setIsLoading(true);
    
    // Get faculty data from database
    setTimeout(() => {
      let facultyData = db.getFacultyByDepartment('all');
      
      if (facultyData.length === 0) {
        // If no data in DB, generate mock faculty
        facultyData = generateMockFaculty('CSE');
      }
      
      setFaculty(facultyData);
      setIsLoading(false);
      
      toast({
        title: "Faculty data loaded",
        description: `Loaded ${facultyData.length} faculty members`,
      });
    }, 1000);
  };
  
  const handleExcelUpload = (uploadedFaculty: Omit<Faculty, 'id'>[]) => {
    setIsLoading(true);
    setTimeout(() => {
      // Ensure category is set to faculty
      uploadedFaculty = uploadedFaculty.map(f => ({...f, category: 'faculty'}));
      
      const newFaculty = db.addMultipleFaculty(uploadedFaculty);
      setFaculty(newFaculty);
      
      toast({
        title: "Faculty cards generated",
        description: `Generated ${newFaculty.length} faculty ID cards successfully`,
      });
      setIsLoading(false);
    }, 1000);
  };
  
  const handleDepartmentSelect = (department: string) => {
    setIsLoading(true);
    setSelectedDepartment(department);
    
    // Generate mock faculty based on selected department
    setTimeout(() => {
      const mockFaculty = generateMockFaculty(department);
      setFaculty(mockFaculty);
      setIsLoading(false);
      
      toast({
        title: "Faculty loaded",
        description: `Loaded ${mockFaculty.length} faculty members from ${department} department`,
      });
    }, 1000);
  };
  
  const handleCreateFaculty = () => {
    if (!newFaculty.name || !newFaculty.facultyId || !newFaculty.department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Convert photoFile to base64 if available
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        saveFacultyWithPhoto(base64String);
      };
      reader.readAsDataURL(photoFile);
    } else {
      saveFacultyWithPhoto(newFaculty.photo || '');
    }
  };
  
  const saveFacultyWithPhoto = (photoUrl: string) => {
    const facultyToAdd = {
      ...newFaculty,
      photo: photoUrl,
      category: 'faculty'
    } as Omit<Faculty, 'id'>;
    
    // Add to database
    const addedFaculty = db.addFaculty(facultyToAdd);
    
    // Update state
    setFaculty(prev => [...prev, addedFaculty]);
    
    // Reset form and close dialog
    setNewFaculty({
      name: '',
      facultyId: '',
      department: '',
      designation: '',
      qualification: '',
      joiningDate: '',
      bloodGroup: '',
      contact: '',
      email: '',
      address: '',
      photo: '',
      category: 'faculty'
    });
    setPhotoFile(null);
    setCreateDialogOpen(false);
    
    toast({
      title: "Faculty added",
      description: `Successfully added ${addedFaculty.name} to the database`,
    });
  };
  
  const handleEditFaculty = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setEditDialogOpen(true);
  };
  
  const saveEditedFaculty = () => {
    if (!editingFaculty) return;
    
    // Convert photoFile to base64 if available
    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateFacultyWithPhoto(base64String);
      };
      reader.readAsDataURL(photoFile);
    } else {
      updateFacultyWithPhoto(editingFaculty.photo);
    }
  };
  
  const updateFacultyWithPhoto = (photoUrl: string) => {
    if (!editingFaculty) return;
    
    const updatedFaculty = {
      ...editingFaculty,
      photo: photoUrl
    };
    
    // Update in database
    db.updateFaculty(editingFaculty.id, updatedFaculty);
    
    // Update in local state
    const updatedFacultyList = faculty.map(f => 
      f.id === editingFaculty.id ? updatedFaculty : f
    );
    
    setFaculty(updatedFacultyList);
    setEditDialogOpen(false);
    setPhotoFile(null);
    
    toast({
      title: "Faculty updated",
      description: `Successfully updated ${editingFaculty.name}'s details`,
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
      if (editingFaculty) {
        setEditingFaculty({
          ...editingFaculty,
          photo: reader.result as string
        });
      } else {
        setNewFaculty({
          ...newFaculty,
          photo: reader.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle preview cards - Store faculty data in session storage and navigate to preview
  const handlePreviewCards = () => {
    if (faculty.length === 0) {
      toast({
        title: "No faculty cards to preview",
        description: "Please generate faculty cards first",
        variant: "destructive",
      });
      return;
    }

    // Store the generated cards data in session storage for the preview page
    sessionStorage.setItem('generatedCards', JSON.stringify({
      students: faculty, // Using students key for compatibility with CardPreview
      template: selectedTemplate,
      cardsPerPage: 2 // Ensure exactly 2 cards per page
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };
  
  const handleDownloadAllCards = async () => {
    if (faculty.length === 0) {
      toast({
        title: "No faculty cards to download",
        description: "Please generate faculty cards first",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Preparing download",
      description: "This may take a moment...",
    });
    
    // Store the generated cards data in session storage for the preview page
    sessionStorage.setItem('generatedCards', JSON.stringify({
      students: faculty,
      template: selectedTemplate,
      cardsPerPage: 2
    }));
    
    // Navigate to the preview page with download flag
    navigate('/preview?download=true');
  };
  
  const handleDownloadCard = async (facultyMember: Faculty) => {
    if (!cardRef.current) {
      toast({
        title: "Error",
        description: "Could not find card element to download",
        variant: "destructive",
      });
      return;
    }
    
    // Store single faculty in session storage
    sessionStorage.setItem('generatedCards', JSON.stringify({
      students: [facultyMember],
      template: selectedTemplate,
      cardsPerPage: 1
    }));
    
    // Navigate to preview with single card
    navigate('/preview');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 animate-[pulse_3s_ease-in-out_infinite]">
            Ideal Institute of Technology – Faculty Identity Card Portal
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
            Generate Faculty ID Cards
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="transition-shadow duration-300 hover:shadow-md animate-[fade-up_0.6s_ease-out] relative overflow-hidden">
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 pointer-events-none"></div>
              
              <CardHeader>
                <CardTitle>Generate Faculty ID Cards</CardTitle>
                <CardDescription>
                  Choose a method to generate faculty ID cards
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="database" value={tabOption} onValueChange={setTabOption} className="w-full">
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
                      <FileUpload<Faculty> 
                        onUploadComplete={handleExcelUpload} 
                        type="faculty"
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="database" className="focus:outline-none">
                    <div className="space-y-4">
                      {/* Department Selection */}
                      {!selectedDepartment && (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Select a Department</h3>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setCreateDialogOpen(true)}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add New Faculty
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {['CSE', 'CSM', 'ECE', 'EEE', 'MECH', 'CIVIL'].map((dept) => (
                              <div
                                key={dept}
                                className="border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500 hover:bg-green-50 hover:transform hover:scale-105"
                                onClick={() => handleDepartmentSelect(dept)}
                              >
                                <h3 className="text-xl font-bold text-center mb-3">{dept}</h3>
                                <p className="text-gray-600 text-center text-sm">
                                  {dept === 'CSE' ? 'Computer Science and Engineering' : 
                                   dept === 'CSM' ? 'Computer Science and Machine Learning' :
                                   dept === 'ECE' ? 'Electronics and Communication Engineering' :
                                   dept === 'EEE' ? 'Electrical and Electronics Engineering' :
                                   dept === 'MECH' ? 'Mechanical Engineering' : 'Civil Engineering'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Faculty List - Only show if department is selected */}
                      {selectedDepartment && (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Faculty from {selectedDepartment} Department</h3>
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedDepartment(null)}
                                className="text-blue-500 hover:bg-blue-50"
                              >
                                Change Department
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setCreateDialogOpen(true)}
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Faculty
                              </Button>
                            </div>
                          </div>
                          
                          <div className="relative">
                            <Input
                              placeholder="Search faculty by name or ID..."
                              className="pl-10 mb-4"
                            />
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                          </div>
                        </>
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
                
                {!isLoading && faculty.length > 0 && (
                  <div className="mt-6 border-t pt-6 animate-[fade-up_0.6s_ease-out]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Faculty Records</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{faculty.length} faculty member(s)</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handlePreviewCards}
                          className="flex items-center gap-1"
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Preview Cards
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleDownloadAllCards}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download All (JPEG)
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const dataStr = JSON.stringify(faculty, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'faculty-data.json';
                            a.click();
                          }}
                          className="flex items-center gap-1"
                        >
                          <FileDown className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[400px] overflow-y-auto border rounded-md p-2">
                      {faculty.map((facultyMember, index) => (
                        <div 
                          key={facultyMember.facultyId} 
                          className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                              {facultyMember.photo ? (
                                <img 
                                  src={facultyMember.photo} 
                                  alt={facultyMember.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(facultyMember.name) + '&background=random';
                                  }}
                                />
                              ) : (
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(facultyMember.name)}&background=random`} 
                                  alt={facultyMember.name}
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{facultyMember.name}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-2">
                                <span>{facultyMember.facultyId}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                <span>{facultyMember.designation}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleEditFaculty(facultyMember)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleDownloadCard(facultyMember)}
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={handlePreviewCards} 
                      className="w-full mt-4 bg-blue-500 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 group"
                      disabled={faculty.length === 0}
                    >
                      <FileDown className="h-4 w-4" />
                      <span>Preview ID Cards</span>
                      <ArrowRight className="h-4 w-4 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {faculty.length > 0 && (
              <Card className="animate-[fade-up_0.8s_ease-out]">
                <CardHeader>
                  <CardTitle>Card Preview</CardTitle>
                  <CardDescription>Preview your generated faculty ID card</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div ref={cardRef}>
                    <FacultyCardTemplate 
                      faculty={faculty[0]} 
                      templateColor={selectedTemplate} 
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <Card className="transition-shadow duration-300 hover:shadow-md sticky top-6 animate-[fade-in-right_0.7s_ease-out]">
              <CardHeader>
                <CardTitle>Card Template</CardTitle>
                <CardDescription>
                  Choose a template color for your faculty ID cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['#1e8e3e', '#1e3c8c', '#e53935', '#9c27b0', '#ff9800', '#795548'].map((color) => (
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
      
      {/* Create New Faculty Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>Add New Faculty</DialogTitle>
            <DialogDescription>
              Enter faculty information for ID card generation
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2">
                {newFaculty.photo ? (
                  <img 
                    src={newFaculty.photo} 
                    alt="Faculty"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(newFaculty.name || 'Faculty')}&background=random`} 
                    alt="Faculty"
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
              <Label htmlFor="facultyName">Full Name</Label>
              <Input 
                id="facultyName" 
                value={newFaculty.name} 
                onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})} 
                placeholder="Enter faculty name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facultyId">Faculty ID</Label>
              <Input 
                id="facultyId" 
                value={newFaculty.facultyId} 
                onChange={(e) => setNewFaculty({...newFaculty, facultyId: e.target.value})} 
                placeholder="Enter faculty ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                value={newFaculty.department} 
                onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})} 
                placeholder="Enter department"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input 
                id="designation" 
                value={newFaculty.designation} 
                onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})} 
                placeholder="Enter designation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input 
                id="qualification" 
                value={newFaculty.qualification} 
                onChange={(e) => setNewFaculty({...newFaculty, qualification: e.target.value})} 
                placeholder="Enter qualification"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joiningDate">Joining Date</Label>
              <Input 
                id="joiningDate" 
                value={newFaculty.joiningDate} 
                onChange={(e) => setNewFaculty({...newFaculty, joiningDate: e.target.value})} 
                placeholder="Enter joining date (DD-MM-YYYY)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input 
                id="bloodGroup" 
                value={newFaculty.bloodGroup} 
                onChange={(e) => setNewFaculty({...newFaculty, bloodGroup: e.target.value})} 
                placeholder="Enter blood group"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input 
                id="contact" 
                value={newFaculty.contact} 
                onChange={(e) => setNewFaculty({...newFaculty, contact: e.target.value})} 
                placeholder="Enter contact number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={newFaculty.email} 
                onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})} 
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                value={newFaculty.address} 
                onChange={(e) => setNewFaculty({...newFaculty, address: e.target.value})} 
                placeholder="Enter address"
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFaculty}>
              <Check className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Faculty Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit Faculty Details</DialogTitle>
            <DialogDescription>
              Update faculty information for ID card generation
            </DialogDescription>
          </DialogHeader>
          
          {editingFaculty && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2">
                  {editingFaculty.photo ? (
                    <img 
                      src={editingFaculty.photo} 
                      alt="Faculty"
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editingFaculty.name || 'Faculty')}&background=random`} 
                      alt="Faculty"
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
                <Label htmlFor="editFacultyName">Full Name</Label>
                <Input 
                  id="editFacultyName" 
                  value={editingFaculty.name} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, name: e.target.value})} 
                  placeholder="Enter faculty name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editFacultyId">Faculty ID</Label>
                <Input 
                  id="editFacultyId" 
                  value={editingFaculty.facultyId} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, facultyId: e.target.value})} 
                  placeholder="Enter faculty ID"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDepartment">Department</Label>
                <Input 
                  id="editDepartment" 
                  value={editingFaculty.department} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, department: e.target.value})} 
                  placeholder="Enter department"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editDesignation">Designation</Label>
                <Input 
                  id="editDesignation" 
                  value={editingFaculty.designation} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, designation: e.target.value})} 
                  placeholder="Enter designation"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editQualification">Qualification</Label>
                <Input 
                  id="editQualification" 
                  value={editingFaculty.qualification} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, qualification: e.target.value})} 
                  placeholder="Enter qualification"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editJoiningDate">Joining Date</Label>
                <Input 
                  id="editJoiningDate" 
                  value={editingFaculty.joiningDate} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, joiningDate: e.target.value})} 
                  placeholder="Enter joining date (DD-MM-YYYY)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editBloodGroup">Blood Group</Label>
                <Input 
                  id="editBloodGroup" 
                  value={editingFaculty.bloodGroup} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, bloodGroup: e.target.value})} 
                  placeholder="Enter blood group"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editContact">Contact Number</Label>
                <Input 
                  id="editContact" 
                  value={editingFaculty.contact} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, contact: e.target.value})} 
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input 
                  id="editEmail" 
                  value={editingFaculty.email} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, email: e.target.value})} 
                  placeholder="Enter email address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editAddress">Address</Label>
                <Input 
                  id="editAddress" 
                  value={editingFaculty.address} 
                  onChange={(e) => setEditingFaculty({...editingFaculty, address: e.target.value})} 
                  placeholder="Enter address"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditedFaculty}>
              <Check className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateFacultyCards;
