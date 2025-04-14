
import { useState, useEffect, useRef } from 'react';
import { Student } from '@/utils/database';
import { QRCodeSVG } from 'qrcode.react';
import JSBarcode from 'jsbarcode';

interface CardTemplateProps {
  student: Student;
  templateColor: string;
  showControls?: boolean;
}

const CardTemplate = ({ student, templateColor, showControls = false }: CardTemplateProps) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  // Truncate text function to handle long text
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Get the academic year display (2021-2025 format)
  const getAcademicYear = () => {
    const currentYear = new Date().getFullYear();
    return student.academicYear || `${currentYear}-${currentYear + 4}`;
  };

  // Format name with dynamic font size based on length
  const getNameComponent = () => {
    if (student.name.length > 30) {
      return <span className="text-sm font-bold text-gray-900 uppercase">{truncateText(student.name, 40)}</span>;
    } else if (student.name.length > 25) {
      return <span className="text-base font-bold text-gray-900 uppercase">{truncateText(student.name, 30)}</span>;
    } else {
      return <span className="text-lg font-bold text-gray-900 uppercase">{student.name}</span>;
    }
  };
  
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

  return (
    <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg relative flex flex-col">
      {/* Header with logo and institute name */}
      <div 
        className="py-2 px-4"
        style={{ backgroundColor: templateColor }}
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
            <p className="text-xs">Ph: 0884-238334</p>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 bg-white px-4 pt-2 pb-1 flex flex-col">
        {/* Student photo and academic year section */}
        <div className="flex justify-between items-start mt-1">
          <div className="relative mb-2">
            <div className="w-28 h-36 border-2 border-red-500 p-1 overflow-hidden">
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
            {/* Academic year - positioned on the left side of photo */}
            <div className="absolute -left-1 top-0 h-full flex items-center">
              <div className="text-red-600 font-bold text-sm py-1 academic-year-vertical">
                {getAcademicYear().split('-').join(' - ')}
              </div>
            </div>
          </div>
          
          {/* QR Code - centered on right */}
          <div className="flex items-center justify-center">
            <QRCodeSVG 
              value={`https://idealtech.edu.in/student/${student.rollNumber}`}
              size={100}
              level="H"
              includeMargin={false}
            />
          </div>
        </div>
        
        {/* Student Name and Department - centered */}
        <div className="mt-3 text-center">
          {getNameComponent()}
          <p className="text-sm font-semibold text-gray-700 uppercase">
            {student.department === 'CSM' 
              ? 'Computer Science and Machine Learning' 
              : student.department === 'CSE'
                ? 'CSE'
                : student.department}
          </p>
        </div>
        
        {/* Student details in table format */}
        <div className="mt-2 space-y-1">
          <div className="flex text-sm">
            <span className="w-24 font-semibold text-gray-700">COURSE</span>
            <span className="text-red-600 font-semibold">: {student.course?.toUpperCase() || 'B.TECH'}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-24 font-semibold text-gray-700">ID NO</span>
            <span>: {student.rollNumber}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-24 font-semibold text-gray-700">D.O.B</span>
            <span>: {student.dob}</span>
          </div>
          <div className="flex text-sm">
            <span className="w-24 font-semibold text-gray-700">B GROUP</span>
            <span>: {student.bloodGroup}</span>
          </div>
        </div>

        {/* Principal signature - moved to white section */}
        <div className="flex justify-end mt-auto mb-1">
          <span className="text-xs italic font-semibold">Principal</span>
        </div>
      </div>

      {/* Footer with contact details and barcode */}
      <div 
        className="w-full py-2 px-3"
        style={{ backgroundColor: templateColor }}
      >
        <div className="text-white text-xs space-y-0.5">
          <div className="flex">
            <span className="w-20 font-semibold">Address</span>
            <span className="flex-1">: {student.address}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold">Contact No</span>
            <span>: {student.contact}</span>
          </div>
          
          {/* Barcode */}
          <div className="bg-white rounded-sm p-1 w-full flex items-center justify-center h-12 mt-1">
            <svg ref={barcodeRef} className="w-full h-10"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
