
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
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 3}`;
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JSBarcode(barcodeRef.current, student.rollNumber, {
          format: "CODE128",
          width: 1.5,
          height: 40,
          displayValue: false,
          background: templateColor,
          lineColor: "#ffffff"
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [student.rollNumber, templateColor]);

  return (
    <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg bg-white">
      {/* Header with logo and institute name */}
      <div 
        className="h-[80px] px-4 py-3 text-white"
        style={{ backgroundColor: templateColor }}
      >
        <div className="flex items-center justify-center gap-2">
          <img 
            src="/lovable-uploads/64ae1059-ac2a-4e36-aa64-6c413fd422dc.png" 
            alt="IDEAL Logo" 
            className="h-12 w-auto object-contain"
          />
          <div className="text-center">
            <h2 className="text-lg font-bold leading-tight">IDEAL INSTITUTE OF TECHNOLOGY</h2>
            <p className="text-sm opacity-90 leading-tight">VIDYUT NAGAR, KAKINADA</p>
          </div>
        </div>
      </div>

      {/* Academic Year */}
      <div className="text-red-600 text-center py-2 font-semibold">
        {academicYear}
      </div>

      {/* Photo and Basic Info */}
      <div className="px-6 py-4">
        <div className="flex justify-between items-start gap-4">
          <div className="w-32 h-40 border-2 border-gray-300 overflow-hidden bg-gray-50">
            <img 
              src={student.photo || '/placeholder.svg'} 
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="text-2xl text-red-600 font-bold mb-2">
              {student.bloodGroup}
            </div>
            <QRCodeSVG 
              value={`${student.rollNumber},${student.name}`}
              size={100}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold uppercase">
            {student.name}
          </h3>
          <p className="font-semibold">{student.department}</p>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex">
            <span className="w-24 font-semibold">Course</span>
            <span>: {student.course}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold">Roll No</span>
            <span>: {student.rollNumber}</span>
          </div>
          <div className="flex">
            <span className="w-24 font-semibold">D.O.B</span>
            <span>: {student.dob}</span>
          </div>
        </div>
      </div>

      {/* Footer with contact details and barcode */}
      <div 
        className="absolute bottom-0 w-full py-3 px-4 text-white"
        style={{ backgroundColor: templateColor }}
      >
        <div className="text-sm space-y-1">
          <div className="grid grid-cols-1 gap-1">
            <p className="truncate">
              <span className="font-semibold">Address:</span> {student.address}
            </p>
            <p className="truncate">
              <span className="font-semibold">Contact:</span> {student.contact}
            </p>
            <p className="truncate">
              <span className="font-semibold">Aadhaar:</span> {student.aadhaar}
            </p>
          </div>
          <div className="mt-2 flex justify-center">
            <svg ref={barcodeRef} className="h-10 w-full"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
