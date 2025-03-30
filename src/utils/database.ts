
export interface Student {
  id: number;
  rollNumber: string;
  name: string;
  department: string;
  course: string;
  year: string;
  academicYear: string;
  dob: string;
  bloodGroup: string;
  aadhaar: string;
  contact: string;
  address: string;
  photo: string;
  category: 'student';
  isBusStudent?: boolean;
}

export interface BusStudent extends Student {
  isBusStudent: true;
}

// Add/ensure this type exists:
export interface Faculty {
  id: number;
  facultyId: string;
  name: string;
  department: string;
  designation: string;
  qualification?: string;
  bloodGroup: string;
  aadhaar: string;
  panNumber?: string;
  contact: string;
  email?: string;
  address: string;
  photo: string;
  joinDate: string;
  category: 'faculty';
}

interface Database {
  getStudents: () => Student[];
  getBusStudents: () => BusStudent[];
  getStudentsByCategoryAndYear: (category: string, year: string) => Student[];
  addStudent: (student: Omit<Student, 'id'>) => Student;
  addMultipleStudents: (students: Omit<Student, 'id'>[]) => Student[];
  updateStudent: (id: number, updatedStudent: Student) => void;

  getAllFaculty: () => Faculty[];
  getFacultyByDepartment: (department: string) => Faculty[];
  addFaculty: (faculty: Omit<Faculty, 'id'>) => Faculty;
  addMultipleFaculty: (facultyList: Omit<Faculty, 'id'>[]) => Faculty[];
  updateFaculty: (id: number, updatedFaculty: Faculty) => void;
  
  // Add the missing authenticateUser method
  authenticateUser: (username: string, password: string) => boolean;
}

const db: Database = {
  getStudents: (): Student[] => {
    const students = localStorage.getItem('students');
    return students ? JSON.parse(students) : [];
  },
  
  getBusStudents: (): BusStudent[] => {
    const students = db.getStudents();
    return students.filter(student => student.isBusStudent === true) as BusStudent[];
  },

  getStudentsByCategoryAndYear: (category: string, year: string): Student[] => {
    let students = db.getStudents();
    
    // Filter by category
    students = students.filter(student => student.category === category);
    
    // Filter by year if year is not 'All'
    if (year !== 'All') {
      students = students.filter(student => student.year === year);
    }

    return students;
  },

  addStudent: (student: Omit<Student, 'id'>): Student => {
    const allStudents = db.getStudents();
    const newId = allStudents.length > 0 ? Math.max(...allStudents.map(student => student.id)) + 1 : 1;
    const newStudent = { ...student, id: newId };
    localStorage.setItem('students', JSON.stringify([...allStudents, newStudent]));
    return newStudent;
  },

  addMultipleStudents: (students: Omit<Student, 'id'>[]): Student[] => {
    const allStudents = db.getStudents();
    let nextId = allStudents.length > 0 ? Math.max(...allStudents.map(student => student.id)) + 1 : 1;

    const newStudents = students.map(student => {
      const newStudent = { ...student, id: nextId++ };
      return newStudent;
    });

    localStorage.setItem('students', JSON.stringify([...allStudents, ...newStudents]));
    return [...allStudents, ...newStudents];
  },

  updateStudent: (id: number, updatedStudent: Student): void => {
    const allStudents = db.getStudents();
    const updatedList = allStudents.map(student =>
      student.id === id ? updatedStudent : student
    );
    localStorage.setItem('students', JSON.stringify(updatedList));
  },

  // Faculty methods
  getAllFaculty: (): Faculty[] => {
    const faculty = localStorage.getItem('faculty');
    return faculty ? JSON.parse(faculty) : [];
  },
  
  getFacultyByDepartment: (department: string): Faculty[] => {
    const faculty = db.getAllFaculty();
    if (department === 'All') return faculty;
    return faculty.filter(f => f.department === department);
  },
  
  addFaculty: (faculty: Omit<Faculty, 'id'>): Faculty => {
    const allFaculty = db.getAllFaculty();
    const newId = allFaculty.length > 0 ? Math.max(...allFaculty.map(f => f.id)) + 1 : 1;
    const newFaculty = { ...faculty, id: newId };
    
    localStorage.setItem('faculty', JSON.stringify([...allFaculty, newFaculty]));
    return newFaculty;
  },
  
  addMultipleFaculty: (facultyList: Omit<Faculty, 'id'>[]): Faculty[] => {
    const allFaculty = db.getAllFaculty();
    let nextId = allFaculty.length > 0 ? Math.max(...allFaculty.map(f => f.id)) + 1 : 1;
    
    const newFaculty = facultyList.map((faculty) => {
      const facultyWithId = { ...faculty, id: nextId++ };
      return facultyWithId;
    });
    
    localStorage.setItem('faculty', JSON.stringify([...allFaculty, ...newFaculty]));
    return [...allFaculty, ...newFaculty];
  },
  
  updateFaculty: (id: number, updatedFaculty: Faculty): void => {
    const allFaculty = db.getAllFaculty();
    const updatedList = allFaculty.map(faculty => 
      faculty.id === id ? updatedFaculty : faculty
    );
    
    localStorage.setItem('faculty', JSON.stringify(updatedList));
  },
  
  // Implement the authenticateUser method
  authenticateUser: (username: string, password: string): boolean => {
    // For simplicity, we'll use hardcoded credentials
    // In a real application, you would validate against stored credentials
    return username === 'admin' && password === 'password';
  },
};

export { db };
