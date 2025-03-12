
# ID Card Generation System

A comprehensive system for generating ID cards for students, faculty members, and bus passes at the IDEAL Institute of Technology.

## Project Overview

The ID Card Generation System allows administrators to:
- Generate ID cards for students, faculty, and bus passes
- Upload student data via Excel sheets
- Select from the database by batch or roll number range
- Customize card templates with different colors
- Print or download generated ID cards

## Live Preview

URL: https://lovable.dev/projects/1ba0f96e-0f9f-4e74-9a07-fd89d450e4a7

## Local Development Setup

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MySQL (v8.0 or later)
- MySQL Workbench (for database management)

### Installation Steps

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd id-card-generation-system
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Database Setup

   #### Creating the Database

   Run the following SQL queries in MySQL Workbench to create the database and tables:

   ```sql
   -- Create database
   CREATE DATABASE ideal_id_cards;
   USE ideal_id_cards;

   -- Create users table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL UNIQUE,
     password VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create students table
   CREATE TABLE students (
     id INT AUTO_INCREMENT PRIMARY KEY,
     roll_number VARCHAR(20) NOT NULL UNIQUE,
     name VARCHAR(100) NOT NULL,
     department VARCHAR(50) NOT NULL,
     course VARCHAR(50) NOT NULL,
     year VARCHAR(20) NOT NULL,
     academic_year VARCHAR(20) NOT NULL,
     dob VARCHAR(20) NOT NULL,
     blood_group VARCHAR(10) NOT NULL,
     aadhaar VARCHAR(20) NOT NULL,
     contact VARCHAR(20) NOT NULL,
     address TEXT NOT NULL,
     photo VARCHAR(255),
     category ENUM('student', 'faculty', 'bus') NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Insert default admin user
   INSERT INTO users (username, password) VALUES ('admin', 'admin');

   -- Insert sample student data
   INSERT INTO students (roll_number, name, department, course, year, academic_year, dob, blood_group, aadhaar, contact, address, photo, category)
   VALUES 
   ('246K5A0301', 'BALASADI VIGNESH', 'ME', 'B.Tech', 'First Year', '2024-2027', '30-09-2005', 'O+', '8908 4409 9285', '7993245964', '2-8-15/1/38 SRI VENKATESHWARA COLONY OLD BUS STAND', '246K5A0301.jpg', 'student'),
   ('246K5A0302', 'CHINTA RAVI SANKAR PATTABHI', 'ME', 'B.Tech', 'First Year', '2024-2027', '05-03-2004', 'O+', '3508 6802 8514', '6309369004', '3-150/1 KOTHAPETA RAMALAYAM STREET KOVVURU-1 KAKINADA RURAL', '246K5A0302.jpg', 'student'),
   ('246K5A0303', 'CHINTALA YOGA SRI SAINADH', 'ME', 'B.Tech', 'First Year', '2024-2027', '22-06-2005', 'O+', '2557 9298 7793', '9951818844', '4-8-51/3, BONASU VARI VEEDI SAMALAKOTA 533440', '246K5A0303.jpg', 'student');
   ```

   #### Configuring Database Connection

   1. Open the `src/utils/database.ts` file
   2. Replace the mock database implementation with a real MySQL connection:

   ```typescript
   // src/utils/database.ts
   import mysql from 'mysql2/promise';

   // Database connection configuration
   const dbConfig = {
     host: 'localhost',
     user: 'root',  // Replace with your MySQL username
     password: 'your_password', // Replace with your MySQL password
     database: 'ideal_id_cards'
   };

   // Create a connection pool
   const pool = mysql.createPool(dbConfig);

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

   // Database class
   class Database {
     // Authentication
     public async authenticateUser(username: string, password: string): Promise<boolean> {
       try {
         const [rows]: any = await pool.query(
           'SELECT * FROM users WHERE username = ? AND password = ?',
           [username, password]
         );
         return rows.length > 0;
       } catch (error) {
         console.error('Authentication error:', error);
         return false;
       }
     }
     
     // Get all students
     public async getAllStudents(): Promise<Student[]> {
       try {
         const [rows]: any = await pool.query(
           'SELECT id, roll_number as rollNumber, name, department, course, year, ' +
           'academic_year as academicYear, dob, blood_group as bloodGroup, aadhaar, ' +
           'contact, address, photo, category FROM students'
         );
         return rows;
       } catch (error) {
         console.error('Error fetching students:', error);
         return [];
       }
     }
     
     // Get students by category and year
     public async getStudentsByCategoryAndYear(category: string, year: string): Promise<Student[]> {
       try {
         const [rows]: any = await pool.query(
           'SELECT id, roll_number as rollNumber, name, department, course, year, ' +
           'academic_year as academicYear, dob, blood_group as bloodGroup, aadhaar, ' +
           'contact, address, photo, category FROM students ' +
           'WHERE category = ? AND year = ?',
           [category, year]
         );
         return rows;
       } catch (error) {
         console.error('Error fetching students by category and year:', error);
         return [];
       }
     }
     
     // Get student by roll number
     public async getStudentByRollNumber(rollNumber: string): Promise<Student | undefined> {
       try {
         const [rows]: any = await pool.query(
           'SELECT id, roll_number as rollNumber, name, department, course, year, ' +
           'academic_year as academicYear, dob, blood_group as bloodGroup, aadhaar, ' +
           'contact, address, photo, category FROM students ' +
           'WHERE roll_number = ?',
           [rollNumber]
         );
         return rows.length > 0 ? rows[0] : undefined;
       } catch (error) {
         console.error('Error fetching student by roll number:', error);
         return undefined;
       }
     }
     
     // Get students by roll number range
     public async getStudentsByRollNumberRange(startRoll: string, endRoll: string): Promise<Student[]> {
       try {
         const [rows]: any = await pool.query(
           'SELECT id, roll_number as rollNumber, name, department, course, year, ' +
           'academic_year as academicYear, dob, blood_group as bloodGroup, aadhaar, ' +
           'contact, address, photo, category FROM students ' +
           'WHERE roll_number >= ? AND roll_number <= ?',
           [startRoll, endRoll]
         );
         return rows;
       } catch (error) {
         console.error('Error fetching students by roll number range:', error);
         return [];
       }
     }
     
     // Add student
     public async addStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
       try {
         const result: any = await pool.query(
           'INSERT INTO students (roll_number, name, department, course, year, ' +
           'academic_year, dob, blood_group, aadhaar, contact, address, photo, category) ' +
           'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
           [
             student.rollNumber, student.name, student.department, student.course,
             student.year, student.academicYear, student.dob, student.bloodGroup,
             student.aadhaar, student.contact, student.address, student.photo, student.category
           ]
         );
         
         if (result[0].insertId) {
           return { ...student, id: result[0].insertId };
         }
         return null;
       } catch (error) {
         console.error('Error adding student:', error);
         return null;
       }
     }
     
     // Add multiple students (for Excel import)
     public async addMultipleStudents(students: Omit<Student, 'id'>[]): Promise<Student[]> {
       const addedStudents: Student[] = [];
       
       for (const student of students) {
         const addedStudent = await this.addStudent(student);
         if (addedStudent) {
           addedStudents.push(addedStudent);
         }
       }
       
       return addedStudents;
     }
   }

   // Export singleton instance
   export const db = new Database();
   ```

3. Install the necessary MySQL package:
   ```
   npm install mysql2
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. The application should now be running at http://localhost:5173/

### Important Notes

1. **Image Storage**: By default, student photos are expected to be in the public folder. For production, you may want to set up a more robust storage solution.

2. **Database Credentials**: For security, consider using environment variables for database credentials in a production environment.

3. **API Endpoints**: The application currently uses a mock database. If you implement a real database, you'll need to update the API calls to be asynchronous.

## Features

- User authentication system
- Student ID card generation
- Faculty ID card generation 
- Bus pass generation
- Excel import functionality
- Database selection by batch
- Roll number range selection
- Card template customization
- Print and download capabilities
- QR code that links to the IDEAL Institute website

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui for UI components
- MySQL for database (implementation instructions provided)
- Excel parsing capabilities
- QR code and barcode generation

## License

© IDEAL Institute of Technology. All rights reserved.
