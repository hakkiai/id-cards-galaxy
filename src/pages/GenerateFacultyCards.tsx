import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, Download, Edit, Check, 
  Upload, Plus, FileDown, Printer, UploadCloud, Database, Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Faculty } from '@/utils/database';
import FacultyCardTemplate from '@/components/FacultyCardTemplate';
import FacultyCardPreview from '@/components/FacultyCardPreview';
import FileUpload from '@/components/FileUpload';

// Generate mock faculty data
const generateMockFaculty = (): Faculty[] => {
  const facultyNames = [
    'Dr. Ramakrishna Rao', 'Prof. Sarala Devi', 'Dr. Venkatesh Murthy', 
    'Prof. Annapurna Devi', 'Dr. J. Krishnamurthy', 'Dr. S. Prasad',
    'Prof. K. Nageswara Rao', 'Dr. P. Lakshmi', 'Prof. T. Satyanarayana'
  ];
  
  const departments = ['CSE', 'CSM', 'ECE', 'EEE', 'ME'];
  const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'HOD'];
  const bloodGroups = ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-'];
  
  return facultyNames.map((name, index) => ({
    id: index + 1,
    facultyId: `FAC${100 + index}`,
    name: name.toUpperCase(),
    department: departments[index % departments.length],
    designation: designations[index % designations.length],
    qualification: index % 2 === 0 ? 'Ph.D.' : 'M.Tech.',
    bloodGroup: bloodGroups[index % bloodGroups.length],
    aadhaar: `${5000 + index} ${6000 + index} ${7000 + index}`,
    panNumber: `ABCPK${4000 + index}H`,
    contact: `98765${43210 - index}`,
    email: `faculty${index + 1}@ideal.edu.in`,
    address: `${index + 1}-${10 + index}/A, Faculty Quarters, Vidyut Nagar`,
    photo: '',
    joinDate: `${10 + (index % 20)}-${1 + (index % 12)}-${2010 + (index % 10)}`,
    category: 'faculty'
  }));
};

const GenerateFacultyCards = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState('#1e8e3e');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tabOption, setTabOption] = useState('excel');
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  // Faculty create/edit dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState<Faculty | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    facultyId: '',
    name: '',
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
    joinDate: ''
  });
  
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
    
    // Load mock faculty data
    loadFacultyData();
  }, [navigate, toast]);
  
  useEffect(() => {
    // Filter faculty based on search query only
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const result = faculty.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.facultyId.toLowerCase().includes(query) ||
        f.department.toLowerCase().includes(query)
      );
      setFilteredFaculty(result);
    } else {
      setFilteredFaculty(faculty);
    }
  }, [faculty, searchQuery]);
  
  const loadFacultyData = () => {
    setIsLoading(true);
    
    // Generate mock faculty data after a short delay to simulate API call
    setTimeout(() => {
      const mockFaculty = generateMockFaculty();
      setFaculty(mockFaculty);
      setFilteredFaculty(mockFaculty);
      setIsLoading(false);
      
      toast({
        title: "Faculty data loaded",
        description: `Loaded ${mockFaculty.length} faculty members`,
      });
    }, 800);
  };
  
  const handleExcelUpload = (uploadedFaculty: Omit<Faculty, 'id'>[]) => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Simulate adding faculty to database and getting back with IDs
      const newFaculty = uploadedFaculty.map((f, index) => ({
        ...f,
        id: faculty.length + index + 1,
        category: 'faculty'
      }));
      
      setFaculty([...faculty, ...newFaculty]);
      setFilteredFaculty([...faculty, ...newFaculty]);
      setIsLoading(false);
      
      toast({
        title: "Faculty data imported",
        description: `Imported ${newFaculty.length} faculty members successfully`,
      });
    }, 1000);
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
      const base64String = reader.result as string;
      setFormData({...formData, photo: base64String});
    };
    reader.readAsDataURL(file);
  };
  
  const handleOpenCreateDialog = () => {
    setIsEditMode(false);
    setFormData({
      facultyId: `FAC${100 + faculty.length + 1}`,
      name: '',
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
      joinDate: new Date().toLocaleDateString('en-GB')
    });
    setPhotoFile(null);
    setDialogOpen(true);
  };
  
  const handleOpenEditDialog = (facultyMember: Faculty) => {
    setIsEditMode(true);
    setCurrentFaculty(facultyMember);
    setFormData({
      facultyId: facultyMember.facultyId,
      name: facultyMember.name,
      department: facultyMember.department,
      designation: facultyMember.designation,
      qualification: facultyMember.qualification || '',
      bloodGroup: facultyMember.bloodGroup,
      aadhaar: facultyMember.aadhaar,
      panNumber: facultyMember.panNumber || '',
      contact: facultyMember.contact,
      email: facultyMember.email || '',
      address: facultyMember.address,
      photo: facultyMember.photo,
      joinDate: facultyMember.joinDate
    });
    setPhotoFile(null);
    setDialogOpen(true);
  };
  
  const handleSaveFaculty = () => {
    if (!formData.name || !formData.facultyId || !formData.department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (Name, Faculty ID, Department)",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditMode && currentFaculty) {
      // Update existing faculty
      const updatedFaculty = {
        ...currentFaculty,
        ...formData
      };
      
      const updatedList = faculty.map(f => 
        f.id === currentFaculty.id ? updatedFaculty : f
      );
      
      setFaculty(updatedList);
      toast({
        title: "Faculty updated",
        description: `Successfully updated ${formData.name}'s details`,
      });
    } else {
      // Create new faculty
      const newFaculty: Faculty = {
        id: faculty.length + 1,
        ...formData,
        category: 'faculty'
      };
      
      setFaculty([...faculty, newFaculty]);
      toast({
        title: "Faculty added",
        description: `Successfully added ${formData.name} to the database`,
      });
    }
    
    setDialogOpen(false);
  };
  
  const handlePreviewCards = () => {
    // Store the generated cards data in session storage for the preview page
    sessionStorage.setItem('generatedCards', JSON.stringify({
      faculty: filteredFaculty,
      template: selectedTemplate,
      cardsPerPage: 2,
      type: 'faculty'
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };
  
  const handlePreviewSingleCard = (faculty: Faculty) => {
    // Store the single faculty card data in session storage
    sessionStorage.setItem('generatedCards', JSON.stringify({
      faculty: [faculty],
      template: selectedTemplate,
      cardsPerPage: 1,
      type: 'faculty'
    }));
    
    // Navigate to the preview page
    navigate('/preview');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 animate-[fade-in_0.5s_ease-out]">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-teal-500 to-green-500 animate-[pulse_3s_ease-in-out_infinite]">
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
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite] bg-gradient-to-r from-green-500/20 via-teal-500/20 to-emerald-500/20 pointer-events-none"></div>
              
              <CardHeader>
                <CardTitle>Generate Faculty ID Cards</CardTitle>
                <CardDescription>
                  Choose a method to generate ID cards
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="excel" value={tabOption} onValueChange={setTabOption} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="excel" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
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
                      <div className="text-center py-8">
                        <Button 
                          onClick={loadFacultyData} 
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Database className="h-4 w-4 mr-2" />
                          Load Faculty Data
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-500">Loading faculty data...</p>
                  </div>
                )}
                
                {!isLoading && filteredFaculty.length > 0 && (
                  <div className="mt-6 border-t pt-6 animate-[fade-up_0.6s_ease-out]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="relative w-full max-w-sm">
                        <Input
                          type="text"
                          placeholder="Search by name, ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                      </div>
                      <Button 
                        onClick={handleOpenCreateDialog}
                        className="ml-2 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Faculty
                      </Button>
                    </div>
                  
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">{filteredFaculty.length} faculty member(s)</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const dataStr = JSON.stringify(filteredFaculty, null, 2);
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
                    
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                      {filteredFaculty.map((facultyMember, index) => (
                        <div 
                          key={facultyMember.id} 
                          className="flex justify-between items-center p-3 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                              {facultyMember.photo ? (
                                <img 
                                  src={facultyMember.photo} 
                                  alt={facultyMember.name} 
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(facultyMember.name)}&background=random`;
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
                                <span>{facultyMember.designation}, {facultyMember.department}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handlePreviewSingleCard(facultyMember)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Preview</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleOpenEditDialog(facultyMember)}
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
                      className="w-full mt-6 bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      disabled={filteredFaculty.length === 0}
                    >
                      <Printer className="h-4 w-4" />
                      <span>Preview All Faculty Cards</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {filteredFaculty.length > 0 && (
              <Card className="animate-[fade-up_0.8s_ease-out]">
                <CardHeader>
                  <CardTitle>Card Preview</CardTitle>
                  <CardDescription>Preview your generated faculty ID card</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <FacultyCardTemplate 
                    faculty={filteredFaculty[0]} 
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
      
      {/* Create/Edit Faculty Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-2">
            <DialogTitle>
              {isEditMode ? 'Edit Faculty Details' : 'Add New Faculty Member'}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Update faculty information for ID card'
                : 'Enter faculty details to create a new ID card'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300 mb-2">
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Faculty"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Faculty')}&background=random`} 
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
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facultyId">Faculty ID*</Label>
                <Input 
                  id="facultyId" 
                  value={formData.facultyId} 
                  onChange={(e) => setFormData({...formData, facultyId: e.target.value})} 
                  placeholder="e.g. FAC001"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input 
                  id="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} 
                  placeholder="e.g. O+"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department*</Label>
                <Input 
                  id="department" 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})} 
                  placeholder="e.g. CSE"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input 
                  id="designation" 
                  value={formData.designation} 
                  onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                  placeholder="e.g. Assistant Professor"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input 
                  id="aadhaar" 
                  value={formData.aadhaar} 
                  onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} 
                  placeholder="e.g. 1234 5678 9012"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input 
                  id="panNumber" 
                  value={formData.panNumber} 
                  onChange={(e) => setFormData({...formData, panNumber: e.target.value})} 
                  placeholder="e.g. ABCDE1234F"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input 
                  id="contact" 
                  value={formData.contact} 
                  onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                  placeholder="e.g. 9876543210"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate" 
                  value={formData.joinDate} 
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})} 
                  placeholder="DD-MM-YYYY"
                />
              </div>
              
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})} 
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4 border-t mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFaculty} className="bg-green-500 hover:bg-green-600">
              <Check className="h-4 w-4 mr-2" />
              {isEditMode ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateFacultyCards;
