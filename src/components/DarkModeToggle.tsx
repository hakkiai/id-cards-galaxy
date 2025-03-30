
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';

const DarkModeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="transition-all duration-300 hover:bg-primary/10"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400 animate-[pulse_2s_ease-in-out_infinite]" />
      ) : (
        <Moon className="h-5 w-5 animate-[pulse_2s_ease-in-out_infinite]" />
      )}
    </Button>
  );
};

export default DarkModeToggle;
