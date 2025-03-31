
import React from 'react';
import { Faculty } from '@/utils/database';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface FacultyCardPreviewProps {
  faculty: Faculty;
  templateColor: string;
  onPreview: (faculty: Faculty) => void;
  showControls?: boolean;
}

const FacultyCardPreview = ({ faculty, templateColor, onPreview, showControls = false }: FacultyCardPreviewProps) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="relative w-full aspect-[2/3] overflow-hidden">
        {/* Card Header with logo and institute name */}
        <div 
          className="h-1/5 w-full flex items-center px-2" 
          style={{ backgroundColor: templateColor }}
        >
          <img 
            src="/lovable-uploads/57d8494a-a5a9-4c02-817d-c38211f71f61.png" 
            alt="IDEAL Logo" 
            className="h-8 w-8 object-contain"
          />
          <div className="text-center text-white flex-1 text-xs">
            <h3 className="font-bold">IDEAL INSTITUTE</h3>
            <p className="text-xs">VIDYUT NAGAR</p>
          </div>
        </div>
        
        {/* Faculty Photo and Info */}
        <div className="flex flex-col items-center justify-center h-3/5 p-2">
          <div className="w-20 h-24 border-2 border-red-500 p-1 mb-2">
            <img 
              src={faculty.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random`}
              alt={faculty.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(faculty.name)}&background=random`;
              }}
            />
          </div>
          <p className="text-xs font-bold text-center line-clamp-1">{faculty.name}</p>
          <p className="text-xs text-center line-clamp-1">{faculty.designation}, {faculty.department}</p>
        </div>
        
        {/* Card Footer */}
        <div 
          className="h-1/5 w-full" 
          style={{ backgroundColor: templateColor }}
        ></div>
        
        {/* Preview Controls (only shown when showControls is true) */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/40 transition-opacity">
            <Button 
              variant="outline" 
              className="bg-white hover:bg-white/90"
              onClick={() => onPreview(faculty)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Card
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyCardPreview;
