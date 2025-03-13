
# IDEAL Institute ID Card Generation System

This application allows administrators to generate ID cards for students, faculty, and bus students at IDEAL Institute of Technology.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)

## Features

- Generate ID cards for students, faculty, and bus students
- Two methods of data input:
  - Upload Excel spreadsheet with student data
  - Select from existing database records
- Filter students by category, year, and roll number range
- Edit student details before ID card generation
- Preview ID cards before printing
- Customizable ID card template colors
- QR code integration that links to institute website
- Barcode generation for each student

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ideal-id-card-system.git
   cd ideal-id-card-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

This application requires a MySQL database to store student, faculty, and bus information.

### 1. Create the Database

Run the following SQL queries in MySQL Workbench or your preferred MySQL client:

```sql
-- Create the database
CREATE DATABASE ideal_id_cards;
USE ideal_id_cards;

-- Create the users table for authentication
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the students table
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
  aadhaar VARCHAR(20),
  contact VARCHAR(20),
  address TEXT,
  photo VARCHAR(255),
  category ENUM('student', 'faculty', 'bus') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (username: admin, password: admin)
INSERT INTO users (username, password, role) 
VALUES ('admin', 'admin', 'admin');

-- Insert sample student data
INSERT INTO students (roll_number, name, department, course, year, academic_year, dob, blood_group, aadhaar, contact, address, category)
VALUES 
('246K1A0501', 'VENKATA SAI RAM', 'CSE', 'B.Tech', '1st Year', '2024-2028', '15-05-2005', 'O+', '8908 4409 9285', '7993245964', '2-8-15/1/38 SRI VENKATESHWARA COLONY, KAKINADA', 'student'),
('246K1A0502', 'KRISHNA REDDY', 'CSE', 'B.Tech', '1st Year', '2024-2028', '22-07-2005', 'B+', '7564 3211 9754', '8792546321', '4-20-5 BHANUGUDI JUNCTION, KAKINADA', 'student');
```

### 2. Configure Database Connection

Create a `.env` file in the root directory with the following content:

```
VITE_DB_HOST=localhost
VITE_DB_PORT=3306
VITE_DB_USER=your_mysql_username
VITE_DB_PASSWORD=your_mysql_password
VITE_DB_NAME=ideal_id_cards
```

Replace `your_mysql_username` and `your_mysql_password` with your MySQL database credentials.

## Running the Application

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

3. Login with the default credentials:
   - Username: admin
   - Password: admin

## Usage Guide

### Generating ID Cards

1. **Login**: Access the system using your administrator credentials.

2. **Select Category**: Choose from Student, Faculty, or Bus ID card generation.

3. **Generate Cards**:
   - **Upload Excel**: Upload an Excel spreadsheet with student data.
   - **From Database**: Select from existing records in the database.
     - Choose a department category (CSE or CSM)
     - Select a year (1st, 2nd, 3rd, or 4th)
     - Optionally filter by roll number range

4. **Edit Student Details** (if needed):
   - Click the Edit button next to a student record
   - Update name or upload a new photo
   - Click Save Changes

5. **Preview Cards**: Review the ID card design before printing.

6. **Print or Download**: Generate the final ID cards for printing or digital distribution.

### ID Card Roll Number Formats

- **1st Year (2024-2028)**: 246K1A0501 to 246K1A0520
- **2nd Year (2023-2027)**: 236K1A0501 to 236K1A0520
- **3rd Year (2022-2026)**: 226K1A0501 to 226K1A0520
- **4th Year (2021-2025)**: 216K1A0501 to 216K1A0520

## License

[MIT License](LICENSE)

## Contact

For any queries or assistance, please contact the IDEAL Institute IT Department.
