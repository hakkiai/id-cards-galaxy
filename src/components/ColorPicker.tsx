
import { useState, useEffect, useRef } from 'react';

interface ColorPickerProps {
  initialColor: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ initialColor, onChange }: ColorPickerProps) => {
  const [color, setColor] = useState(initialColor);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div 
        className="w-10 h-10 rounded-md border cursor-pointer shadow-sm"
        style={{ backgroundColor: color }}
        onClick={() => setShowPicker(!showPicker)}
      />
      
      {showPicker && (
        <div className="absolute top-12 left-0 bg-white p-3 rounded-md shadow-lg z-10">
          <input 
            type="color" 
            value={color}
            onChange={handleColorChange}
            className="w-48 h-40"
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
