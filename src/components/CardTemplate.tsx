
import { useState, useEffect } from 'react';
import { Student } from '@/utils/database';
import { User2, Calendar, School, BookOpen, Phone, MapPin, Droplet, CreditCard } from 'lucide-react';

interface CardTemplateProps {
  student: Student;
  templateColor?: 'blue' | 'red' | 'green';
  showControls?: boolean;
}

const CardTemplate = ({ student, templateColor = 'blue', showControls = false }: CardTemplateProps) => {
  const [qrCode, setQrCode] = useState<string>('');
  
  // Generate QR code on component mount
  useEffect(() => {
    // In a real app, you would use a QR code generation library like qrcode.react
    // Here we're using a placeholder image for demonstration
    const studentDataForQR = `${student.rollNumber},${student.name},${student.department}`;
    // This would be replaced with actual QR code generation
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(studentDataForQR)}`);
  }, [student]);
  
  const cardClasses = `id-card id-card-${templateColor}`;
  
  return (
    <div className="relative">
      {showControls && (
        <div className="flex justify-center space-x-2 mb-4 no-print">
          <button 
            onClick={() => window.print()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Print Card
          </button>
        </div>
      )}
      
      <div className={cardClasses}>
        <div className="id-card-header">
          <h2 className="text-xl font-bold">IDEAL INSTITUTE OF TECHNOLOGY</h2>
          <p className="text-sm opacity-90">VIDYUT NAGAR, KAKINADA - Ph: 0884-2363345</p>
          <div className="text-sm font-semibold mt-2">{student.academicYear}</div>
        </div>
        
        <div className="id-card-body">
          <div className="flex flex-col items-center">
            <div className="photo-placeholder">
              {student.photo ? (
                <img 
                  src={`/placeholder.svg`} 
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2 size={50} className="text-gray-400" />
              )}
            </div>
            
            <h3 className="text-lg font-bold text-blue-600 mt-2">{student.name}</h3>
            <div className="text-sm text-gray-700">{student.department}</div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full">
              <div className="flex items-center text-sm">
                <BookOpen size={14} className="mr-1 text-gray-500" />
                <span className="font-semibold">Course:</span>
              </div>
              <div className="text-sm">{student.course}</div>
              
              <div className="flex items-center text-sm">
                <CreditCard size={14} className="mr-1 text-gray-500" />
                <span className="font-semibold">Roll No:</span>
              </div>
              <div className="text-sm">{student.rollNumber}</div>
              
              <div className="flex items-center text-sm">
                <Calendar size={14} className="mr-1 text-gray-500" />
                <span className="font-semibold">D.O.B:</span>
              </div>
              <div className="text-sm">{student.dob}</div>
            </div>
            
            <div className="mt-4 flex justify-between w-full">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                  <Droplet className="h-5 w-5 text-red-500" />
                </div>
                <div className="text-sm font-medium mt-1">{student.bloodGroup}</div>
              </div>
              
              <div className="text-center">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-24 h-24 mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="id-card-footer">
          <div className="text-xs mb-1">
            <span className="font-semibold">Address:</span> {student.address}
          </div>
          <div className="text-xs mb-1">
            <span className="font-semibold">Contact:</span> {student.contact}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Aadhaar:</span> {student.aadhaar}
          </div>
          
          <div className="mt-2">
            <svg className="mx-auto" width="200" height="30">
              {/* This would be replaced with a proper barcode in a real application */}
              <rect x="0" y="0" width="200" height="30" fill="white" />
              {Array.from({ length: 30 }).map((_, i) => (
                <rect 
                  key={i} 
                  x={i * 6} 
                  y="0" 
                  width="3" 
                  height="30" 
                  fill="black" 
                  opacity={Math.random() > 0.5 ? "1" : "0"}
                />
              ))}
              <text x="100" y="40" textAnchor="middle" fill="black" fontSize="10">
                {student.rollNumber}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
