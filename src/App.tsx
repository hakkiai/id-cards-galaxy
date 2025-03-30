
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import YearSelect from '@/pages/YearSelect';
import CategorySelect from '@/pages/CategorySelect';
import GenerateCards from '@/pages/GenerateCards';
import GenerateFacultyCards from '@/pages/GenerateFacultyCards';
import CardPreview from '@/pages/CardPreview';
import NotFound from '@/pages/NotFound';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// Create a client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Any app-wide initialization can go here
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/category/:category" element={<CategorySelect />} />
            <Route path="/year/:category/:year" element={<YearSelect />} />
            <Route path="/generate/:category/:year/:option" element={
              params => params.category === 'faculty' ? <GenerateFacultyCards /> : <GenerateCards />
            } />
            <Route path="/preview" element={<CardPreview />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
