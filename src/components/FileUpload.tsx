
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Student, Faculty } from '@/utils/database';

interface FileUploadProps<T> {
  onUploadComplete: (data: Omit<T, 'id'>[]) => void;
  type?: 'student' | 'faculty';
}

const FileUpload = <T extends Student | Faculty>({ 
  onUploadComplete, 
  type = 'student' 
}: FileUploadProps<T>) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('Please upload an Excel or CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);

    // In a real application, you would use a library like xlsx or papaparse
    // to parse the Excel/CSV file. For this demo, we'll simulate the process.
    setTimeout(() => {
      let mockData: any[] = [];
      
      if (type === 'student') {
        // Mock student data
        mockData = [
          {
            rollNumber: '246K5A0304',
            name: 'JOHN DOE',
            department: 'CSE',
            course: 'B.Tech',
            year: 'Second Year',
            academicYear: '2023-2026',
            dob: '15-07-2003',
            bloodGroup: 'B+',
            aadhaar: '1234 5678 9012',
            contact: '9876543210',
            address: '123 Main Street, Hyderabad',
            photo: '246K5A0304.jpg',
            category: 'student'
          },
          {
            rollNumber: '246K5A0305',
            name: 'JANE SMITH',
            department: 'ECE',
            course: 'B.Tech',
            year: 'Second Year',
            academicYear: '2023-2026',
            dob: '22-09-2003',
            bloodGroup: 'A+',
            aadhaar: '9876 5432 1098',
            contact: '8765432109',
            address: '456 Oak Avenue, Vizag',
            photo: '246K5A0305.jpg',
            category: 'student'
          }
        ];
      } else {
        // Mock faculty data
        mockData = [
          {
            facultyId: 'FAC004',
            name: 'DR. RAVI KUMAR',
            teluguName: 'డా. రవి కుమార్',
            department: 'CSE',
            designation: 'Professor',
            qualification: 'Ph.D',
            bloodGroup: 'O+',
            aadhaar: '5678 1234 9012',
            panNumber: 'ABCDE1234F',
            contact: '9876543210',
            email: 'ravi.kumar@idealtech.edu.in',
            address: '789 Faculty Quarters, Vidyut Nagar, Kakinada',
            photo: '',
            joinDate: '10-06-2015',
            category: 'faculty'
          },
          {
            facultyId: 'FAC005',
            name: 'DR. LAKSHMI PRASAD',
            teluguName: 'డా. లక్ష్మి ప్రసాద్',
            department: 'ECE',
            designation: 'Associate Professor',
            qualification: 'Ph.D',
            bloodGroup: 'A-',
            aadhaar: '8765 4321 0987',
            panNumber: 'FGHIJ5678K',
            contact: '8765432109',
            email: 'lakshmi.prasad@idealtech.edu.in',
            address: '456 Teachers Colony, Kakinada',
            photo: '',
            joinDate: '15-07-2018',
            category: 'faculty'
          }
        ];
      }

      setIsUploading(false);
      onUploadComplete(mockData as Omit<T, 'id'>[]);
      
      toast({
        title: "Upload complete",
        description: `Successfully processed ${mockData.length} ${type} records`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Excel or CSV file</p>
          </div>
          <Input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {isUploading && (
        <div className="text-center py-2">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Processing file...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
