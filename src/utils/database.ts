
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
      category: 'student'
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
      category: 'student'
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
      category: 'student'
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
  
  // Get students by category and year
  public getStudentsByCategoryAndYear(category: string, year: string): Student[] {
    return this.students.filter(
      student => student.category === category && student.year === year
    );
  }
  
  // Get student by roll number
  public getStudentByRollNumber(rollNumber: string): Student | undefined {
    return this.students.find(student => student.rollNumber === rollNumber);
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
}

// Export singleton instance
export const db = new Database();
