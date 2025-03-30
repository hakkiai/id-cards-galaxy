
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
import html2canvas from 'html2canvas';

// Sample faculty data for demonstration
const generateMockFaculty = (department: string): Faculty[] => {
  const namesPool = [
    'Dr. Ramakrishna Rao', 'Dr. Sarala Devi', 'Prof. Venkatesh Murthy', 
    'Dr. Annapurna Devi', 'Dr. J. Krishnamurthy', 'Dr. S. Prasad',
    'Prof. K. Nageswara Rao', 'Dr. P. Lakshmi', 'Dr. T. Satyanarayana',
    'Prof. M. Sivakumar', 'Dr. G. Radha Krishna', 'Dr. L. Sudhakar',
    'Prof. B. Padmavathi', 'Dr. K. Suresh', 'Prof. N. Rambabu'
  ];
  
  const teluguNames = [
    'డా. రామకృష్ణ రావు', 'డా. శారలా దేవి', 'ప్రొఫ్. వెంకటేష్ మూర్తి',
    'డా. అన్నపూర్ణ దేవి', 'డా. జె. కృష్ణమూర్తి', 'డా. ఎస్. ప్రసాద్',
    'ప్రొఫ్. కె. నాగేశ్వర రావు', 'డా. పి. లక్ష్మి', 'డా. టి. సత్యనారాయణ',
    'ప్రొఫ్. ఎం. శివకుమార్', 'డా. జి. రాధాకృష్ణ', 'డా. ఎల్. సుధాకర్',
    'ప్రొఫ్. బి. పద్మావతి', 'డా. కె. సురేష్', 'ప్రొఫ్. ఎన్. రాంబాబు'
  ];

  const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD', 'Senior Professor'];
  const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'];
  
  return Array.from({ length: 10 }, (_, i) => {
    const nameIndex = i % namesPool.length;
    return {
      id: i + 1,
      facultyId: `FAC00${i + 1}`,
      name: namesPool[nameIndex].toUpperCase(),
      teluguName: teluguNames[nameIndex],
      department: department === 'All' ? ['CSE', 'CSM', 'ME', 'ECE', 'EEE'][i % 5] : department,
      designation: designations[i % designations.length],
      qualification: ['Ph.D', 'M.Tech', 'M.Phil', 'Ph.D (Pursuing)', 'Post-Doctoral'][i % 5],
      bloodGroup: bloodGroups[i % bloodGroups.length],
      aadhaar: `${5000 + i} ${7000 + i} ${5700 + i}`,
      panNumber: `ABCDE${1234 + i}F`,
      contact: `9${i}05${i}40${i}58`,
      email: `faculty${i+1}@idealtech.edu.in`,
      address: `${i+1}-${i+10}-${i+15}/1/${i+30} Faculty Quarters, Vidyut Nagar, Kakinada`,
      photo: '', // Will be handled by placeholder
      joinDate: `${10 + (i % 20)}-${1 + (i % 12)}-20${10 + (i % 10)}`,
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
    facultyId: '',
    name: '',
    teluguName: '',
    department: '',
    designation: 'Assistant Professor',
    qualification: '',
    bloodGroup: 'O+',
    aadhaar: '',
    panNumber: '',
    contact: '',
    email: '',
    address: '',
    photo: '',
    joinDate: '',
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
    
    setTimeout(() => {
      let facultyData: Faculty[] = [];
      
      // Try to get faculty data from database
      facultyData = db.getAllFaculty();
      
      if (facultyData.length === 0) {
        // If no data in DB, generate mock faculty
        facultyData = generateMockFaculty('All');
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
    
    setTimeout(() => {
      let facultyData = db.getFacultyByDepartment(department);
      
      if (facultyData.length === 0) {
        // If no data in DB, generate mock faculty
        facultyData = generateMockFaculty(department);
      }
      
      setFaculty(facultyData);
      setIsLoading(false);
      
      toast({
        title: "Faculty loaded",
        description: `Loaded ${facultyData.length} faculty members from ${department === 'All' ? 'all departments' : department}`,
      });
    }, 1000);
  };
  
  const handleCreateFaculty = () => {
    if (!newFaculty.name || !newFaculty.facultyId || !newFaculty.department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (Name, ID, Department)",
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
      saveFacultyWithPhoto("");
    }
  };
  
  const saveFacultyWithPhoto = (photoUrl: string) => {
    const facultyToAdd = {
      ...newFaculty,
      photo: photoUrl,
      category: 'faculty'
    } as Omit<Faculty, 'id'>;
    
    const addedFaculty = db.addFaculty(facultyToAdd);
    setFaculty(prev => [...prev, addedFaculty]);
    setCreateDialogOpen(false);
    setPhotoFile(null);
    
    // Reset form
    setNewFaculty({
      facultyId: '',
      name: '',
      teluguName: '',
      department: '',
      designation: 'Assistant Professor',
      qualification: '',
      bloodGroup: 'O+',
      aadhaar: '',
      panNumber: '',
      contact: '',
      email: '',
      address: '',
      photo: '',
      joinDate: '',
      category: 'faculty'
    });
    
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
        setEditingFaculty({...editingFaculty, photo: reader.result as string});
      } else {
        setNewFaculty({...newFaculty, photo: reader.result as string});
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleDownloadAllCards = async () => {
    if (faculty.length === 0) {
      toast({
        title: "No cards to download",
        description: "Please generate faculty cards first",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    toast({
      title: "Preparing download",
      description: "Generating JPEG files for all faculty cards...",
    });
    
    // Create a temporary div to hold the cards for conversion
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);
    
    try {
      for (let i = 0; i < faculty.length; i++) {
        const facultyMember = faculty[i];
        
        // Create the card element
        const cardElement = document.createElement('div');
        cardElement.style.width = '350px';
        cardElement.style.height = '550px';
        cardElement.style.position = 'relative';
        
        // Append to temp div
        tempDiv.innerHTML = '';
        tempDiv.appendChild(cardElement);
        
        // Render the card content
        const ReactDOM = await import('react-dom');
        ReactDOM.render(
          <FacultyCardTemplate 
            faculty={facultyMember} 
            templateColor={selectedTemplate} 
          />, 
          cardElement
        );
        
        // Wait a bit for the render to complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Convert to canvas
        const canvas = await html2canvas(cardElement, {
          scale: 3,
          backgroundColor: null,
          logging: false,
          useCORS: true
        });
        
        // Convert to JPEG
        const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
        
        // Create download link
        const link = document.createElement('a');
        link.href = jpegUrl;
        link.download = `faculty_${facultyMember.facultyId}_${facultyMember.name.replace(/\s+/g, '_')}.jpg`;
        link.click();
        
        // Wait a bit between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      toast({
        title: "Download complete",
        description: `Successfully downloaded ${faculty.length} faculty cards as JPEG files`,
      });
    } catch (error) {
      console.error("Error generating downloads:", error);
      toast({
        title: "Error",
        description: "There was an error generating the downloads",
        variant: "destructive",
      });
    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
      setIsLoading(false);
    }
  };
  
  const handleDownloadCard = async (facultyMember: Faculty) => {
    setIsLoading(true);
    
    try {
      // Create a temporary div with the card
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Create the card element
      const cardElement = document.createElement('div');
      tempDiv.appendChild(cardElement);
      
      // Render the card content
      const ReactDOM = await import('react-dom');
      ReactDOM.render(
        <FacultyCardTemplate 
          faculty={facultyMember} 
          templateColor={selectedTemplate} 
        />, 
        cardElement
      );
      
      // Wait a bit for the render to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert to canvas
      const canvas = await html2canvas(cardElement, {
        scale: 3,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      
      // Convert to JPEG
      const jpegUrl = canvas.toDataURL('image/jpeg', 1.0);
      
      // Create download link
      const link = document.createElement('a');
      link.href = jpegUrl;
      link.download = `faculty_${facultyMember.facultyId}_${facultyMember.name.replace(/\s+/g, '_')}.jpg`;
      link.click();
      
      // Clean up
      document.body.removeChild(tempDiv);
      
      toast({
        title: "Download complete",
        description: `Successfully downloaded ID card for ${facultyMember.name}`,
      });
    } catch (error) {
      console.error("Error generating download:", error);
      toast({
        title: "Error",
        description: "There was an error generating the download",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] bg-gradient-to-r from-green-500/20 via-blue-500/20 to-teal-500/20 pointer-events-none"></div>
              
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
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Select a Department</h3>
                            <Button 
                              onClick={() => setCreateDialogOpen(true)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add New Faculty
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {['All', 'CSE', 'CSM', 'ME', 'ECE', 'EEE'].map((dept) => (
                              <div
                                key={dept}
                                className="border-2 rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-green-500 hover:bg-green-50 hover:transform hover:scale-105"
                                onClick={() => handleDepartmentSelect(dept)}
                              >
                                <h3 className="text-xl font-bold text-center mb-3">{dept}</h3>
                                <p className="text-gray-600 text-center">
                                  {dept === 'All' ? 'All Departments' : 
                                   dept === 'CSE' ? 'Computer Science and Engineering' : 
                                   dept === 'CSM' ? 'Computer Science and Machine Learning' : 
                                   dept === 'ME' ? 'Mechanical Engineering' : 
                                   dept === 'ECE' ? 'Electronics & Communication Engineering' : 
                                   'Electrical & Electronics Engineering'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* Faculty list if department is selected */}
                      {selectedDepartment && (
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Faculty from {selectedDepartment === 'All' ? 'All Departments' : selectedDepartment}</h3>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSelectedDepartment(null)}
                                className="text-blue-500 hover:bg-blue-50"
                              >
                                Change Department
                              </Button>
                              <Button 
                                onClick={() => setCreateDialogOpen(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Faculty
                              </Button>
                            </div>
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
                          <FileDown className="h-4 w-4" />
                          Export Data
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
                              <div className="text-sm text-gray-500">
                                {facultyMember.teluguName && (
                                  <span className="mr-2">{facultyMember.teluguName}</span>
                                )}
                                <span>{facultyMember.designation}, {facultyMember.department}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleDownloadCard(facultyMember)}
                            >
                              <Download className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleEditFaculty(facultyMember)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Edit</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <FacultyCardTemplate 
                    faculty={faculty[0]} 
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
                  Choose a template color for your faculty ID cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {['#1e8e3e', '#e53935', '#1e3c8c', '#9c27b0', '#ff9800', '#795548'].map((color) => (
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
            <DialogTitle>Add New Faculty Member</DialogTitle>
            <DialogDescription>
              Enter faculty details to create a new ID card
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
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facultyId">Faculty ID*</Label>
                <Input 
                  id="facultyId" 
                  value={newFaculty.facultyId} 
                  onChange={(e) => setNewFaculty({...newFaculty, facultyId: e.target.value})} 
                  placeholder="e.g. FAC001"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input 
                  id="bloodGroup" 
                  value={newFaculty.bloodGroup} 
                  onChange={(e) => setNewFaculty({...newFaculty, bloodGroup: e.target.value})} 
                  placeholder="e.g. O+"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Full Name (English)*</Label>
                <Input 
                  id="name" 
                  value={newFaculty.name} 
                  onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value.toUpperCase()})} 
                  placeholder="e.g. DR. RAMAKRISHNA RAO"
                  required
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="teluguName">Name in Telugu (optional)</Label>
                <Input 
                  id="teluguName" 
                  value={newFaculty.teluguName} 
                  onChange={(e) => setNewFaculty({...newFaculty, teluguName: e.target.value})} 
                  placeholder="e.g. డా. రామకృష్ణ రావు"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department*</Label>
                <Input 
                  id="department" 
                  value={newFaculty.department} 
                  onChange={(e) => setNewFaculty({...newFaculty, department: e.target.value})} 
                  placeholder="e.g. CSE"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input 
                  id="designation" 
                  value={newFaculty.designation} 
                  onChange={(e) => setNewFaculty({...newFaculty, designation: e.target.value})} 
                  placeholder="e.g. Assistant Professor"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input 
                  id="qualification" 
                  value={newFaculty.qualification} 
                  onChange={(e) => setNewFaculty({...newFaculty, qualification: e.target.value})} 
                  placeholder="e.g. Ph.D"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate" 
                  value={newFaculty.joinDate} 
                  onChange={(e) => setNewFaculty({...newFaculty, joinDate: e.target.value})} 
                  placeholder="e.g. 10-06-2015"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input 
                  id="aadhaar" 
                  value={newFaculty.aadhaar} 
                  onChange={(e) => setNewFaculty({...newFaculty, aadhaar: e.target.value})} 
                  placeholder="e.g. 5678 1234 9012"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input 
                  id="panNumber" 
                  value={newFaculty.panNumber} 
                  onChange={(e) => setNewFaculty({...newFaculty, panNumber: e.target.value})} 
                  placeholder="e.g. ABCDE1234F"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input 
                  id="contact" 
                  value={newFaculty.contact} 
                  onChange={(e) => setNewFaculty({...newFaculty, contact: e.target.value})} 
                  placeholder="e.g. 9876543210"
                  type="tel"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={newFaculty.email} 
                  onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})} 
                  placeholder="e.g. faculty@idealtech.edu.in"
                  type="email"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={newFaculty.address} 
                  onChange={(e) => setNewFaculty({...newFaculty, address: e.target.value})} 
                  placeholder="e.g. Faculty Quarters, Vidyut Nagar, Kakinada"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFaculty}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="h-4 w-4 mr-2" />
              Create Faculty ID
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Faculty Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>Edit Faculty Member</DialogTitle>
            <DialogDescription>
              Update faculty details for the ID card
            </DialogDescription>
          </DialogHeader>
          
          {editingFaculty && (
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2">
                  {editingFaculty.photo ? (
                    <img 
                      src={editingFaculty.photo} 
                      alt={editingFaculty.name}
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(editingFaculty.name)}&background=random`} 
                      alt={editingFaculty.name}
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
                  Change Photo
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-facultyId">Faculty ID</Label>
                  <Input 
                    id="edit-facultyId" 
                    value={editingFaculty.facultyId} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, facultyId: e.target.value})} 
                    placeholder="e.g. FAC001"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-bloodGroup">Blood Group</Label>
                  <Input 
                    id="edit-bloodGroup" 
                    value={editingFaculty.bloodGroup} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, bloodGroup: e.target.value})} 
                    placeholder="e.g. O+"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-name">Full Name (English)</Label>
                  <Input 
                    id="edit-name" 
                    value={editingFaculty.name} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, name: e.target.value.toUpperCase()})} 
                    placeholder="e.g. DR. RAMAKRISHNA RAO"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-teluguName">Name in Telugu</Label>
                  <Input 
                    id="edit-teluguName" 
                    value={editingFaculty.teluguName} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, teluguName: e.target.value})} 
                    placeholder="e.g. డా. రామకృష్ణ రావు"
                  />
                </div>
                
                {/* Remaining edit fields similar to create dialog */}
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Input 
                    id="edit-department" 
                    value={editingFaculty.department} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, department: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-designation">Designation</Label>
                  <Input 
                    id="edit-designation" 
                    value={editingFaculty.designation} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, designation: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-qualification">Qualification</Label>
                  <Input 
                    id="edit-qualification" 
                    value={editingFaculty.qualification} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, qualification: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-joinDate">Join Date</Label>
                  <Input 
                    id="edit-joinDate" 
                    value={editingFaculty.joinDate} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, joinDate: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-aadhaar">Aadhaar Number</Label>
                  <Input 
                    id="edit-aadhaar" 
                    value={editingFaculty.aadhaar} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, aadhaar: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-panNumber">PAN Number</Label>
                  <Input 
                    id="edit-panNumber" 
                    value={editingFaculty.panNumber} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, panNumber: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-contact">Contact Number</Label>
                  <Input 
                    id="edit-contact" 
                    value={editingFaculty.contact} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, contact: e.target.value})} 
                    type="tel"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input 
                    id="edit-email" 
                    value={editingFaculty.email} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, email: e.target.value})} 
                    type="email"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input 
                    id="edit-address" 
                    value={editingFaculty.address} 
                    onChange={(e) => setEditingFaculty({...editingFaculty, address: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveEditedFaculty}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
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
