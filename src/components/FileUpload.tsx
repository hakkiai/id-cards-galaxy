
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Student, Faculty } from '@/utils/database';
import * as XLSX from 'xlsx';

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setError('Please upload an Excel or CSV file');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Read the Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      // Skip header row if exists
      const rows = jsonData.slice(1);
      
      if (rows.length === 0) {
        throw new Error('No data found in the Excel file');
      }
      
      let processedData: Omit<Student | Faculty, 'id'>[] = [];
      
      if (type === 'student') {
        // Map Excel columns to student properties
        processedData = rows.map((row: any) => {
          // Extract values based on Excel format (adjust indices if needed)
          const rollNumber = row[1] || '';
          const classCode = row[2] || '';
          const department = row[3] || '';
          const name = row[4] || '';
          const course = row[5] || '';
          const dob = row[6] || '';
          const address = row[7] || '';
          const contact = row[8] || '';
          const bloodGroup = (row[9] || '').toString();
          
          // Create student object
          return {
            rollNumber: rollNumber.toString(),
            name: name.toString().toUpperCase(),
            department: department.toString(),
            course: course.toString(),
            year: 'First Year', // Default value
            academicYear: '2024-2028', // Default value
            dob: dob.toString(),
            bloodGroup: bloodGroup,
            aadhaar: '', // Not in provided format
            contact: contact.toString(),
            address: address.toString(),
            photo: '', // Will need to be handled separately
            category: 'student' as const,
            isBusStudent: false, // Default value
          };
        });
      } else {
        // Map Excel columns to faculty properties
        processedData = rows.map((row: any) => {
          return {
            facultyId: row[1] || '',
            name: (row[2] || '').toString().toUpperCase(),
            teluguName: row[3] || '',
            department: row[4] || '',
            designation: row[5] || '',
            qualification: row[6] || '',
            bloodGroup: row[7] || '',
            aadhaar: row[8] || '',
            panNumber: row[9] || '',
            contact: row[10] || '',
            email: row[11] || '',
            address: row[12] || '',
            photo: '',
            joinDate: row[13] || '',
            category: 'faculty' as const
          };
        });
      }
      
      // Filter out rows with empty essential fields
      const validData = processedData.filter(item => {
        if (type === 'student') {
          return (item as Student).rollNumber && (item as Student).name;
        } else {
          return (item as Faculty).facultyId && (item as Faculty).name;
        }
      });
      
      if (validData.length === 0) {
        throw new Error('No valid data found in the Excel file');
      }
      
      onUploadComplete(validData as Omit<T, 'id'>[]);
      
      toast({
        title: "Upload complete",
        description: `Successfully processed ${validData.length} ${type} records`,
      });
    } catch (error) {
      console.error('Error processing Excel file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process the Excel file');
    } finally {
      setIsUploading(false);
    }
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
