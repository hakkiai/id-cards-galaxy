
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
  const academicYear = `${currentYear}-${currentYear + 4}`;
  const barcodeRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JSBarcode(barcodeRef.current, student.rollNumber, {
          format: "CODE128",
          width: 1.5,
          height: 30,
          displayValue: false,
          background: "#ffffff",
          lineColor: "#000000"
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
        className="py-3 px-4"
        style={{ backgroundColor: templateColor }}
      >
        <div className="flex items-center justify-between gap-2">
          <img 
            src="/lovable-uploads/a545a42a-b17b-4c50-9599-5574346a185f.png"
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
        {academicYear}
      </div>

      {/* Photo and Basic Info */}
      <div className="px-6 py-2 bg-white flex-1">
        <div className="flex justify-between items-start gap-4">
          <div className="w-32 h-40 border-2 border-gray-300 overflow-hidden">
            <img 
              src={student.photo || '/placeholder.svg'} 
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl text-red-600 font-bold">
              {student.bloodGroup}
            </div>
            <QRCodeSVG 
              value={`${student.rollNumber},${student.name}`}
              size={90}
              level="H"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-xl font-bold text-gray-900 uppercase">
            {student.name}
          </h3>
          <p className="font-semibold text-gray-700">{student.department}</p>
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
        className="w-full py-2 px-4"
        style={{ backgroundColor: templateColor }}
      >
        <div className="text-white text-xs space-y-1">
          <p className="leading-tight">
            <span className="font-semibold">Address:</span> {student.address}
          </p>
          <p className="leading-tight">
            <span className="font-semibold">Contact:</span> {student.contact}
          </p>
          <p className="leading-tight mb-1">
            <span className="font-semibold">Aadhaar:</span> {student.aadhaar}
          </p>
          <div className="bg-white rounded-sm p-1 mt-1 w-full h-10 flex items-center justify-center">
            <svg ref={barcodeRef} className="w-full h-8"></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
