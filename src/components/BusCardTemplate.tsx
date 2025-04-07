
import { useState, useEffect, useRef } from 'react';
import { Student } from '@/utils/database';
import { QRCodeSVG } from 'qrcode.react';
import JSBarcode from 'jsbarcode';

interface BusCardTemplateProps {
  student: Student;
  templateColor: string;
  showControls?: boolean;
  busId?: string;
  onBusIdChange?: (value: string) => void;
}

const BusCardTemplate = ({ 
  student, 
  templateColor, 
  showControls = false,
  busId = 'A',
  onBusIdChange
}: BusCardTemplateProps) => {
  const [editableBusId, setEditableBusId] = useState(busId);
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  // Generate barcode when roll number changes
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JSBarcode(barcodeRef.current, student.rollNumber, {
          format: "CODE128",
          width: 2.5,
          height: 40,
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000",
          margin: 0
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [student.rollNumber]);

  // Handle bus ID change
  const handleBusIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEditableBusId(newValue);
    if (onBusIdChange) {
      onBusIdChange(newValue);
    }
  };

  // Colors based on the provided image
  const headerFooterColor = templateColor || '#6a1b9a'; // Purple default
  const borderColor = '#fbc02d'; // Gold/yellow border
  const accentColor = '#d81b60'; // Pink for text accents

  return (
    <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg relative flex flex-col">
      {/* Header with logo and institute name - Purple with yellow border */}
      <div 
        className="py-2 px-4 relative"
        style={{ 
          backgroundColor: headerFooterColor,
          borderTop: `2px solid ${borderColor}`,
          borderBottom: `2px solid ${borderColor}`
        }}
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
      <div className="flex-1 bg-white px-4 pt-2 pb-1 flex flex-col">
        {/* Bus ID on left, Photo in middle, Bus letter on right */}
        <div className="flex justify-between items-center mt-2">
          <div className="text-black font-bold text-2xl">
            <div>BUS</div>
            <div>ID</div>
          </div>
          
          {/* Photo container with rounded corners and pink border */}
          <div className="w-28 h-32 border-2 overflow-hidden rounded-xl" style={{ borderColor: accentColor }}>
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
          
          {/* Bus ID letter (editable if showControls is true) */}
          <div className="text-black font-bold text-4xl">
            {showControls ? (
              <input 
                type="text" 
                value={editableBusId}
                onChange={handleBusIdChange}
                className="w-12 h-12 text-center text-4xl font-bold border-2 rounded"
                style={{ borderColor: accentColor }}
                maxLength={1}
              />
            ) : (
              <span>{editableBusId}</span>
            )}
          </div>
        </div>
        
        {/* Student Name and Roll Number */}
        <div className="mt-6 text-center">
          <p className="text-xl font-bold text-black">{student.name}</p>
          <p className="text-lg font-semibold">{student.rollNumber}</p>
        </div>
        
        {/* Department and Halt details */}
        <div className="mt-4 space-y-1">
          <div className="flex text-sm" style={{ color: accentColor }}>
            <span className="font-semibold">Department :</span>
            <span className="ml-2 font-bold">{student.department}</span>
          </div>
          <div className="flex text-sm" style={{ color: accentColor }}>
            <span className="font-semibold">Halt :</span>
            <span className="ml-2 font-bold">{student.busHalt || 'VENKATNAGAR'}</span>
          </div>
        </div>
        
        {/* QR Code - Hidden in this design based on the image */}
        <div className="hidden">
          <QRCodeSVG 
            value={`https://idealtech.edu.in/student/${student.rollNumber}`}
            size={80}
            level="H"
            includeMargin={false}
          />
        </div>
        
        {/* Signatures */}
        <div className="mt-auto mb-3 flex justify-between items-end text-sm" style={{ color: accentColor }}>
          <div>Administrative Officer</div>
          <div className="flex flex-col items-end">
            <div className="h-px w-20 mb-1 bg-gray-300"></div>
            <div>Principal</div>
          </div>
        </div>
      </div>

      {/* Footer with contact details - Purple with yellow border */}
      <div 
        className="w-full py-2 px-3"
        style={{ 
          backgroundColor: headerFooterColor,
          borderTop: `2px solid ${borderColor}`,
          borderBottom: `2px solid ${borderColor}`
        }}
      >
        <div className="text-white text-sm space-y-0.5">
          <div className="flex">
            <span>Student Cell No: {student.studentCellNo || '9347761874'}</span>
          </div>
          <div className="flex">
            <span>Parent Cell No: {student.parentCellNo || '7794808517'}</span>
          </div>
          
          {/* Hidden barcode here - not visible in the reference image */}
          <div className="hidden">
            <svg ref={barcodeRef} className="w-full h-10"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusCardTemplate;
