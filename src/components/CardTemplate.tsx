
import { useState, useEffect, useRef } from 'react';
import { Student } from '@/utils/database';
import { QRCodeSVG } from 'qrcode.react';
import JSBarcode from 'jsbarcode';
import { Bus, Droplet } from 'lucide-react';

interface CardTemplateProps {
  student: Student;
  templateColor: string;
  showControls?: boolean;
}

const CardTemplate = ({ student, templateColor, showControls = false }: CardTemplateProps) => {
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 4}`;
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  // Truncate text function to handle long text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Format name with dynamic font size based on length
  const getNameComponent = () => {
    if (student.name.length > 30) {
      return <span className="text-sm font-bold text-gray-900 uppercase">{truncateText(student.name, 40)}</span>;
    } else if (student.name.length > 25) {
      return <span className="text-base font-bold text-gray-900 uppercase">{truncateText(student.name, 30)}</span>;
    } else {
      return <span className="text-xl font-bold text-gray-900 uppercase">{student.name}</span>;
    }
  };
  
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JSBarcode(barcodeRef.current, student.rollNumber, {
          format: "CODE128",
          width: 2.2,  // Increased from 1.5 to 2.2 for larger barcode
          height: 40,  // Increased from 30 to 40 for taller barcode
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 0   // Reduced margin to maximize space usage
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [student.rollNumber]);

  return (
    <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg relative flex flex-col">
      {/* Bus Student Badge - if applicable */}
      {student.isBusStudent && (
        <div className="absolute top-2 right-2 z-10 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
          <div className="bg-amber-500 text-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <Bus className="h-4 w-4" />
            <span className="text-xs font-bold">BUS</span>
          </div>
        </div>
      )}

      {/* Header with logo and institute name */}
      <div 
        className="py-3 px-4"
        style={{ backgroundColor: templateColor }}
      >
        <div className="flex items-center justify-between gap-2">
          <img 
            src="/lovable-uploads/57d8494a-a5a9-4c02-817d-c38211f71f61.png"
            alt="IDEAL Logo" 
            className="h-14 w-14 object-contain"
          />
          <div className="text-center text-white flex-1">
            <h2 className="text-lg font-bold leading-tight">IDEAL INSTITUTE OF TECHNOLOGY</h2>
            <p className="text-sm opacity-90">VIDYUT NAGAR, KAKINADA</p>
          </div>
        </div>
      </div>

      {/* Academic Year */}
      <div className="text-red-600 text-center py-1 font-semibold bg-white">
        {student.academicYear || academicYear}
      </div>

      {/* Photo and Basic Info */}
      <div className="px-6 py-2 bg-white flex-1">
        <div className="flex justify-between items-start gap-4">
          {/* Photo container - adjusted to center better */}
          <div className="w-32 h-40 border-2 border-gray-300 overflow-hidden mx-auto">
            {student.photo ? (
              <img 
                src={student.photo} 
                alt={student.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;
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
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-red-600 font-bold flex items-center gap-1">
              <Droplet className="h-5 w-5 text-red-600 animate-pulse" fill="rgba(239, 68, 68, 0.2)" />
              {student.bloodGroup}
            </div>
            <QRCodeSVG 
              value={`https://idealtech.edu.in/website/home.html`}
              size={90}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="line-clamp-1">
            {getNameComponent()}
          </h3>
          <p className="font-semibold text-gray-700">
            {student.department === 'CSM' 
              ? 'Computer Science and Machine Learning' 
              : student.department === 'CSE'
                ? 'Computer Science and Engineering'
                : student.department}
          </p>
        </div>

        <div className="mt-2 space-y-1">
          <div className="flex text-sm">
            <span className="w-24 font-semibold">Course</span>
            <span>: {student.course}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-24 font-semibold">Roll No</span>
            <span>: {student.rollNumber}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-24 font-semibold">D.O.B</span>
            <span>: {student.dob}</span>
          </div>
        </div>
      </div>

      {/* Footer with contact details and barcode */}
      <div 
        className="w-full py-2 px-4 relative"
        style={{ backgroundColor: templateColor }}
      >
        {student.isBusStudent && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bus-indicator z-10">
            <div className="bg-amber-400 text-amber-900 rounded-full px-4 py-0.5 text-xs font-bold shadow-md">
              BUS STUDENT
            </div>
          </div>
        )}
        <div className="text-white text-xs space-y-1">
          <p className="leading-tight text-wrap break-words max-h-14 overflow-y-auto">
            <span className="font-semibold">Address:</span> {student.address}
          </p>
          <p className="leading-tight">
            <span className="font-semibold">Contact:</span> {student.contact}
          </p>
          <div className="bg-white rounded-sm p-1 mt-2 w-full h-12 flex items-center justify-center">
            <svg ref={barcodeRef} className="w-full h-10"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
