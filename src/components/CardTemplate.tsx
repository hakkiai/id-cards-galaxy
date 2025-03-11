
import { useState, useEffect } from 'react';
import { Student } from '@/utils/database';
import QRCode from 'qrcode.react';
import { useTheme } from '@/hooks/use-theme';

interface CardTemplateProps {
  student: Student;
  templateColor?: string;
  showControls?: boolean;
}

const CardTemplate = ({ student, templateColor = '#4052b5', showControls = false }: CardTemplateProps) => {
  const currentYear = new Date().getFullYear();
  const academicYear = `${currentYear}-${currentYear + 3}`;

  return (
    <div className="relative">
      {showControls && (
        <div className="flex justify-center space-x-2 mb-4 no-print">
          <button 
            onClick={() => window.print()} 
            className="bg-ideal-blue text-white px-4 py-2 rounded hover:bg-ideal-blue-light transition-colors"
          >
            Print Card
          </button>
        </div>
      )}
      
      <div className="w-[350px] h-[550px] rounded-lg overflow-hidden shadow-lg bg-white animate-fade-up">
        {/* Header */}
        <div 
          className="h-[80px] p-3 text-white text-center"
          style={{ backgroundColor: templateColor }}
        >
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/lovable-uploads/64ae1059-ac2a-4e36-aa64-6c413fd422dc.png" 
              alt="IDEAL Logo" 
              className="h-12"
            />
            <div>
              <h2 className="text-lg font-bold">IDEAL INSTITUTE OF TECHNOLOGY</h2>
              <p className="text-sm opacity-90">VIDYUT NAGAR, KAKINADA - Ph: 0884-2363345</p>
            </div>
          </div>
        </div>

        {/* Academic Year */}
        <div className="text-red-600 text-center py-2 font-semibold">
          {academicYear}
        </div>

        {/* Photo and Basic Info */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-start">
            <div className="w-32 h-40 border-2 border-gray-300 overflow-hidden">
              <img 
                src={student.photo || '/placeholder.svg'} 
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl text-red-600 font-bold mb-2">
                {student.bloodGroup}
              </div>
              <QRCode 
                value={`${student.rollNumber},${student.name}`}
                size={100}
                level="H"
              />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-ideal-text-primary text-xl font-bold uppercase">
              {student.name}
            </h3>
            <p className="text-ideal-text-primary font-semibold">{student.department}</p>
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

        {/* Footer */}
        <div 
          className="absolute bottom-0 w-full py-3 px-4 text-white"
          style={{ backgroundColor: templateColor }}
        >
          <div className="text-sm space-y-1">
            <p>
              <span className="font-semibold">Address:</span> {student.address}
            </p>
            <p>
              <span className="font-semibold">Contact:</span> {student.contact}
            </p>
            <p>
              <span className="font-semibold">Aadhaar:</span> {student.aadhaar}
            </p>
            <div className="mt-2 flex justify-center">
              <svg className="h-12">
                {/* Barcode simulation */}
                {Array.from({ length: 30 }).map((_, i) => (
                  <rect 
                    key={i} 
                    x={i * 6} 
                    y="0" 
                    width="3" 
                    height="40" 
                    fill="white" 
                    opacity={Math.random() > 0.5 ? "1" : "0"}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardTemplate;
