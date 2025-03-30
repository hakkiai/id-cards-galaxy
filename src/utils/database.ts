
// Mock database for the ID card generation system
// In a real application, this would connect to a real database

// User table for authentication
interface User {
  username: string;
  password: string;
}

// Student record schema
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
  category: 'student' | 'faculty' | 'bus';
  isBusStudent?: boolean; // Property for bus students
}

// Faculty record schema
export interface Faculty {
  id: number;
  facultyId: string;
  name: string;
  teluguName?: string;
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
  joinDate?: string;
  category: 'faculty';
}

// Mock database
class Database {
  private users: User[] = [
    { username: 'admin', password: 'admin' }
  ];
  
  private students: Student[] = [
    {
      id: 1,
      rollNumber: '246K5A0301',
      name: 'BALASADI VIGNESH',
      department: 'ME',
      course: 'B.Tech',
      year: 'First Year',
      academicYear: '2024-2027',
      dob: '30-09-2005',
      bloodGroup: 'O+',
      aadhaar: '8908 4409 9285',
      contact: '7993245964',
      address: '2-8-15/1/38 SRI VENKATESHWARA COLONY OLD BUS STAND',
      photo: '246K5A0301.jpg',
      category: 'student',
      isBusStudent: true
    },
    {
      id: 2,
      rollNumber: '246K5A0302',
      name: 'CHINTA RAVI SANKAR PATTABHI',
      department: 'ME',
      course: 'B.Tech',
      year: 'First Year',
      academicYear: '2024-2027',
      dob: '05-03-2004',
      bloodGroup: 'O+',
      aadhaar: '3508 6802 8514',
      contact: '6309369004',
      address: '3-150/1 KOTHAPETA RAMALAYAM STREET KOVVURU-1 KAKINADA RURAL',
      photo: '246K5A0302.jpg',
      category: 'student',
      isBusStudent: false
    },
    {
      id: 3,
      rollNumber: '246K5A0303',
      name: 'CHINTALA YOGA SRI SAINADH',
      department: 'ME',
      course: 'B.Tech',
      year: 'First Year',
      academicYear: '2024-2027',
      dob: '22-06-2005',
      bloodGroup: 'O+',
      aadhaar: '2557 9298 7793',
      contact: '9951818844',
      address: '4-8-51/3, BONASU VARI VEEDI SAMALAKOTA 533440',
      photo: '246K5A0303.jpg',
      category: 'student',
      isBusStudent: true
    }
  ];
  
  private faculty: Faculty[] = [
    {
      id: 1,
      facultyId: 'FAC001',
      name: 'A.S.S.V. BHASKARA RAJA',
      teluguName: 'ఏ.ఎస్.ఎస్.వి. భాస్కర రాజా',
      department: 'CSE',
      designation: 'Assistant Professor',
      qualification: 'M.Tech',
      bloodGroup: 'B+',
      aadhaar: '6780 7082 5790',
      panNumber: 'KXOPS4214K',
      contact: '9505540858',
      email: 'bhaskar.raja@idealtech.edu.in',
      address: 'Plot No. 42, Srinagar Colony, Kakinada',
      photo: '',
      joinDate: '15-06-2020',
      category: 'faculty'
    },
    {
      id: 2,
      facultyId: 'FAC002',
      name: 'JAMPALA SRIDEVI',
      teluguName: 'జంపాల శ్రీదేవి',
      department: 'CSE',
      designation: 'Associate Professor',
      qualification: 'Ph.D',
      bloodGroup: 'A+',
      aadhaar: '5621 4398 7612',
      panNumber: 'ABLPS7689R',
      contact: '8978453621',
      email: 'sridevi.j@idealtech.edu.in',
      address: '7-8-22/1, Teachers Colony, Kakinada',
      photo: '',
      joinDate: '10-07-2018',
      category: 'faculty'
    },
    {
      id: 3,
      facultyId: 'FAC003',
      name: 'RAMANA MURTHY K.V.',
      teluguName: 'రమణ మూర్తి కె.వి.',
      department: 'CSM',
      designation: 'Professor',
      qualification: 'Ph.D',
      bloodGroup: 'O-',
      aadhaar: '4523 8671 9034',
      panNumber: 'CVTPR4523K',
      contact: '9849076532',
      email: 'ramanamurthy@idealtech.edu.in',
      address: 'Flat No. 301, Sri Sai Residency, Bhanugudi Junction, Kakinada',
      photo: '',
      joinDate: '20-08-2015',
      category: 'faculty'
    }
  ];
  
  // Authentication
  public authenticateUser(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    return !!user;
  }
  
  // Get all students
  public getAllStudents(): Student[] {
    return [...this.students];
  }
  
  // Get all faculty
  public getAllFaculty(): Faculty[] {
    return [...this.faculty];
  }
  
  // Get students by category and year
  public getStudentsByCategoryAndYear(category: string, year: string): Student[] {
    // For bus category, we want only students with the bus tag
    if (category === 'bus') {
      // For bus category, filter only students with isBusStudent = true
      return this.students.filter(student => student.isBusStudent === true);
    }
    
    // For student category, return all students of that year
    if (category === 'student') {
      return this.students.filter(student => 
        student.category === category && (year === 'All' || student.year === year)
      );
    }
    
    // For other categories (faculty), filter by category and year
    return this.students.filter(
      student => student.category === category && (year === 'All' || student.year === year)
    );
  }
  
  // Get faculty by department
  public getFacultyByDepartment(department: string): Faculty[] {
    if (department === 'All') {
      return [...this.faculty];
    }
    return this.faculty.filter(faculty => faculty.department === department);
  }
  
  // Get student by roll number
  public getStudentByRollNumber(rollNumber: string): Student | undefined {
    return this.students.find(student => student.rollNumber === rollNumber);
  }
  
  // Get faculty by ID
  public getFacultyById(facultyId: string): Faculty | undefined {
    return this.faculty.find(faculty => faculty.facultyId === facultyId);
  }
  
  // Get students by roll number range
  public getStudentsByRollNumberRange(startRoll: string, endRoll: string): Student[] {
    return this.students.filter(
      student => student.rollNumber >= startRoll && student.rollNumber <= endRoll
    );
  }
  
  // Add student
  public addStudent(student: Omit<Student, 'id'>): Student {
    const newId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) + 1 : 1;
    const newStudent = { ...student, id: newId };
    this.students.push(newStudent);
    return newStudent;
  }
  
  // Add faculty
  public addFaculty(faculty: Omit<Faculty, 'id'>): Faculty {
    const newId = this.faculty.length > 0 ? Math.max(...this.faculty.map(f => f.id)) + 1 : 1;
    const newFaculty = { ...faculty, id: newId };
    this.faculty.push(newFaculty);
    return newFaculty;
  }
  
  // Add multiple students (for Excel import)
  public addMultipleStudents(students: Omit<Student, 'id'>[]): Student[] {
    let lastId = this.students.length > 0 ? Math.max(...this.students.map(s => s.id)) : 0;
    
    const newStudents = students.map(student => {
      lastId++;
      return { ...student, id: lastId };
    });
    
    this.students.push(...newStudents);
    return newStudents;
  }
  
  // Add multiple faculty (for Excel import)
  public addMultipleFaculty(facultyMembers: Omit<Faculty, 'id'>[]): Faculty[] {
    let lastId = this.faculty.length > 0 ? Math.max(...this.faculty.map(f => f.id)) : 0;
    
    const newFaculty = facultyMembers.map(faculty => {
      lastId++;
      return { ...faculty, id: lastId };
    });
    
    this.faculty.push(...newFaculty);
    return newFaculty;
  }

  // Get bus students
  public getBusStudents(): Student[] {
    return this.students.filter(student => student.isBusStudent === true);
  }
  
  // Update student
  public updateStudent(id: number, updatedStudent: Partial<Student>): Student | undefined {
    const index = this.students.findIndex(s => s.id === id);
    if (index === -1) return undefined;
    
    this.students[index] = { ...this.students[index], ...updatedStudent };
    return this.students[index];
  }
  
  // Update faculty
  public updateFaculty(id: number, updatedFaculty: Partial<Faculty>): Faculty | undefined {
    const index = this.faculty.findIndex(f => f.id === id);
    if (index === -1) return undefined;
    
    this.faculty[index] = { ...this.faculty[index], ...updatedFaculty };
    return this.faculty[index];
  }
}

// Export singleton instance
export const db = new Database();
