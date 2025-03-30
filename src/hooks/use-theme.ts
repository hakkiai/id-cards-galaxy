
import { useState, useEffect } from 'react';

export const useThemeColor = () => {
  const [primaryColor, setPrimaryColor] = useState('#4052b5');
  
  useEffect(() => {
    // Check for saved theme and set initial primary color
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setPrimaryColor('#ffffff');
    }
  }, []);
  
  const updatePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    
    // Update CSS variables
    document.documentElement.style.setProperty('--primary-color', color);
  };
  
  return {
    primaryColor,
    updatePrimaryColor,
  };
};
