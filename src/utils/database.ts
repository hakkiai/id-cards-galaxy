// Add this to the existing database.ts file
// This assumes the current file exists with Student interface and db object

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
  category: string;
  isBusStudent?: boolean;
  busHalt?: string;
  studentCellNo?: string;
  parentCellNo?: string;
}

// This is a mock database implementation
class Database {
  private students: Student[] = [];
  private nextId = 1;

  constructor() {
    // Add some initial data
    this.initializeData();
  }

  private initializeData() {
    // Add any initial data here
  }

  // Get all students regardless of category
  getAllStudents(): Student[] {
    return [...this.students];
  }

  // Get all students
  getStudents(): Student[] {
    return this.students.filter(student => student.category === 'student');
  }

  // Get all bus students
  getBusStudents(): Student[] {
    return this.students.filter(student => student.isBusStudent === true);
  }

  // Get students by category and year
  getStudentsByCategoryAndYear(category: string, year: string): Student[] {
    return this.students.filter(student => {
      if (category === 'bus') {
        return student.isBusStudent === true;
      }
      
      if (year === 'All') {
        return student.category === category;
      }
      
      return student.category === category && student.year === year;
    });
  }

  // Add a single student
  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent = { ...student, id: this.nextId++ };
    this.students.push(newStudent);
    return newStudent;
  }

  // Add multiple students
  addMultipleStudents(students: Omit<Student, 'id'>[]): Student[] {
    const newStudents = students.map(student => ({
      ...student,
      id: this.nextId++
    }));
    
    this.students.push(...newStudents);
    return newStudents;
  }

  // Update a student
  updateStudent(id: number, updatedStudent: Partial<Student>): boolean {
    const index = this.students.findIndex(student => student.id === id);
    if (index === -1) return false;
    
    this.students[index] = { ...this.students[index], ...updatedStudent };
    return true;
  }

  // Delete a student
  deleteStudent(id: number): boolean {
    const initialLength = this.students.length;
    this.students = this.students.filter(student => student.id !== id);
    return this.students.length !== initialLength;
  }

  // Authenticate user (mock implementation)
  authenticateUser(username: string, password: string): boolean {
    // Simple authentication for demo
    return username === 'admin' && password === 'admin123';
  }
}

export const db = new Database();
