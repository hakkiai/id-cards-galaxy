
import { useState } from 'react';

export const useTheme = () => {
  const [primaryColor, setPrimaryColor] = useState('#4052b5');
  
  const updatePrimaryColor = (color: string) => {
    setPrimaryColor(color);
  };
  
  return {
    primaryColor,
    updatePrimaryColor,
  };
};
