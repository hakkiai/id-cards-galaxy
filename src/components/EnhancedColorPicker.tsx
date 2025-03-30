
import { useState, useEffect, useRef } from 'react';

interface EnhancedColorPickerProps {
  initialColor: string;
  onChange: (color: string) => void;
}

const EnhancedColorPicker = ({ initialColor, onChange }: EnhancedColorPickerProps) => {
  const [color, setColor] = useState(initialColor);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const predefinedColors = [
    '#1e3c8c', // Default blue
    '#e53935', // Red
    '#4caf50', // Green
    '#9c27b0', // Purple
    '#ff9800', // Orange
    '#795548', // Brown
    '#000000', // Black
  ];
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  const handlePredefinedColorClick = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        className="w-12 h-12 rounded-md border-2 cursor-pointer shadow-sm transition-transform hover:scale-105"
        style={{ backgroundColor: color, borderColor: showPicker ? '#000' : 'rgba(0,0,0,0.1)' }}
        onClick={() => setShowPicker(!showPicker)}
      />
      
      {showPicker && (
        <div className="absolute top-14 left-0 bg-card p-3 rounded-md shadow-lg z-50 animate-fade-in dark:bg-gray-800 border border-border">
          <div className="mb-3 grid grid-cols-4 gap-2">
            {predefinedColors.map((presetColor) => (
              <div
                key={presetColor}
                className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                  color === presetColor ? 'ring-2 ring-offset-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => handlePredefinedColorClick(presetColor)}
              />
            ))}
          </div>
          
          <input 
            type="color" 
            value={color}
            onChange={handleColorChange}
            className="w-full h-48"
          />
          <div className="mt-2 text-xs font-mono text-muted-foreground">{color}</div>
        </div>
      )}
    </div>
  );
};

export default EnhancedColorPicker;
