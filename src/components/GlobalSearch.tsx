
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Student, db } from '@/utils/database';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchProps {
  onStudentSelect?: (student: Student) => void;
  placeholder?: string;
  searchType?: 'all' | 'bus' | 'student';
}

const GlobalSearch = ({ 
  onStudentSelect,
  placeholder = "Search by name or roll number...",
  searchType = 'all'
}: GlobalSearchProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Student[]>([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Only search if query is more than 2 characters
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimer = setTimeout(() => {
      const searchTerm = query.toLowerCase().trim();
      let searchResults: Student[] = [];
      
      switch (searchType) {
        case 'bus':
          searchResults = db.getBusStudents().filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.rollNumber.toLowerCase().includes(searchTerm) ||
            (student.busHalt && student.busHalt.toLowerCase().includes(searchTerm))
          );
          break;
        case 'student':
          searchResults = db.getStudents().filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.rollNumber.toLowerCase().includes(searchTerm) ||
            student.department.toLowerCase().includes(searchTerm)
          );
          break;
        case 'all':
        default:
          searchResults = db.getAllStudents().filter(student => 
            student.name.toLowerCase().includes(searchTerm) || 
            student.rollNumber.toLowerCase().includes(searchTerm) ||
            student.department.toLowerCase().includes(searchTerm) ||
            (student.busHalt && student.busHalt.toLowerCase().includes(searchTerm))
          );
          break;
      }
      
      // Limit to top 10 results for performance
      setResults(searchResults.slice(0, 10));
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, searchType]);

  const handleStudentSelect = (student: Student) => {
    if (onStudentSelect) {
      onStudentSelect(student);
    } else {
      // If no handler is provided, navigate to appropriate generate page
      if (student.isBusStudent) {
        navigate(`/generate/bus/${student.department}/excel`);
      } else {
        navigate(`/generate/student/${student.department}/excel`);
      }
    }
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2"
          onClick={() => setShowResults(!showResults)}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto">
          <ul className="py-1">
            {results.map((student) => (
              <li 
                key={student.id} 
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                onClick={() => handleStudentSelect(student)}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                  {student.photo ? (
                    <img 
                      src={student.photo} 
                      alt={student.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`;
                      }}
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=random`} 
                      alt={student.name}
                      className="h-full w-full object-cover" 
                    />
                  )}
                </div>
                <div>
                  <div className="font-medium">{student.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>{student.rollNumber}</span>
                    <span>•</span>
                    <span>{student.department}</span>
                    {student.isBusStudent && (
                      <>
                        <span>•</span>
                        <span className="bg-amber-100 text-amber-800 rounded px-1">Bus</span>
                      </>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {showResults && query.length >= 2 && results.length === 0 && (
        <div className="absolute mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 p-4 text-center">
          <p className="text-gray-500">No matching students found</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
