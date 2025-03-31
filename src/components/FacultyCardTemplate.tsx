
import { useState, useEffect, useRef } from 'react';
import { Faculty } from '@/utils/database';
import { QRCodeSVG } from 'qrcode.react';
import JSBarcode from 'jsbarcode';

interface FacultyCardTemplateProps {
  faculty: Faculty;
  templateColor: string;
  showControls?: boolean;
}

const FacultyCardTemplate = ({ faculty, templateColor, showControls = false }: FacultyCardTemplateProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  // Truncate text function to handle long text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Format name with dynamic font size based on length
  const getNameComponent = () => {
    if (faculty.name.length > 30) {
      return <span className="text-sm font-bold text-red-600 uppercase">{truncateText(faculty.name, 40)}</span>;
    } else if (faculty.name.length > 25) {
      return <span className="text-base font-bold text-red-600 uppercase">{truncateText(faculty.name, 30)}</span>;
    } else {
      return <span className="text-lg font-bold text-red-600 uppercase">{faculty.name}</span>;
    }
  };
  
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JSBarcode(barcodeRef.current, faculty.facultyId, {
          format: "CODE128",
          width: 3,
          height: 50,
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 0
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [faculty.facultyId]);

  return (
    <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg relative flex flex-col">
      {/* Header with logo and institute name - Green background */}
      <div 
        className="py-2 px-4"
        style={{ backgroundColor: templateColor || '#1e8e3e' }}
      >
        <div className="flex items-center justify-between gap-2">
          <img 
            src="/lovable-uploads/57d8494a-a5a9-4c02-817d-c38211f71f61.png" 
            alt="IDEAL Logo" 
            className="h-12 w-12 object-contain"
          />
          <div className="text-center text-white flex-1">
            <h2 className="text-xl font-bold leading-tight tracking-wide">IDEAL</h2>
            <p className="text-base font-semibold leading-tight">INSTITUTE OF TECHNOLOGY</p>
            <p className="text-xs">VIDYUT NAGAR, KAKINADA</p>
            <p className="text-xs">Ph: 0884-2363345</p>
          </div>
        </div>
      </div>

      {/* Main content area - White background */}
      <div className="flex-1 bg-white px-4 pt-4 pb-2 flex flex-col items-center">
        {/* Photo in red border */}
        <div className="w-40 h-48 border-2 border-red-500 p-1 overflow-hidden mb-3">
          {faculty.photo ? (
            <img 
              src={faculty.photo} 
              alt={faculty.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random`;
              }}
            />
          ) : (
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random`}
              alt={faculty.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Blood group indicator */}
        <div className="absolute top-28 right-8 flex flex-col items-center">
          <img 
            src="/lovable-uploads/blooddrop.png" 
            alt="Blood Drop"
            className="w-8 h-10 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23dc2626'%3E%3Cpath d='M12 2a1 1 0 0 1 1 1c0 2.675 3.273 6.92 5.123 9.201A7.5 7.5 0 1 1 5.877 12.2C7.727 9.92 11 5.676 11 3a1 1 0 0 1 1-1z'/%3E%3C/svg%3E";
            }}
          />
          <span className="text-xs font-bold text-red-600 mt-1">{faculty.bloodGroup}</span>
        </div>
        
        {/* Faculty Name */}
        <div className="text-center">
          {getNameComponent()}
        </div>
        
        {/* Faculty details in table format */}
        <div className="w-full mt-2 space-y-2 px-2">
          <div className="flex text-sm">
            <span className="w-28 font-semibold text-gray-700">Designation</span>
            <span className="text-red-600 font-semibold">: {faculty.designation || 'Assistant Professor'}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-28 font-semibold text-gray-700">Department</span>
            <span className="text-red-600 font-semibold">: {faculty.department}</span>
          </div>
        </div>
        
        {/* Principal signature */}
        <div className="flex justify-end mt-3 w-full pr-2">
          <div className="flex flex-col items-center">
            <div className="border-t border-gray-400 w-16 mb-1"></div>
            <span className="text-xs text-red-600 font-semibold">Principal</span>
          </div>
        </div>
      </div>

      {/* Footer with details - Green background */}
      <div 
        className="w-full py-3 px-4"
        style={{ backgroundColor: templateColor || '#1e8e3e' }}
      >
        <div className="text-white text-sm space-y-2">
          <div className="flex">
            <span className="w-24 font-semibold">Cell No</span>
            <span>: {faculty.contact}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold">Pan No</span>
            <span>: {faculty.panNumber || 'KXOPS4214K'}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold">Aadhaar No</span>
            <span>: {faculty.aadhaar}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCardTemplate;
