-- Demo data for ERP Pro: 10–15 rows per table, all fictional.
-- Run after db/schema.sql on an EMPTY database. It refuses to run if
-- students already has rows, and the whole script is one transaction.
-- Passwords are not set here; see db/seed-logins.local.sql.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM students) THEN
    RAISE EXCEPTION 'students already has rows - seed.sql is for an empty database';
  END IF;
END $$;

-- ───────────── Students ─────────────

INSERT INTO students (student_id, name, email, "Phone", course, department, year, semester, dob, total_fee, "pending _fee") VALUES
('STU2024001', 'Aarav Sharma',    'aarav.sharma@demo.edu',    '9810000001', 'B.Tech', 'Computer Science',       '1', '1', '2006-03-14', 145000, 0),
('STU2024002', 'Diya Patel',      'diya.patel@demo.edu',      '9810000002', 'B.Tech', 'Computer Science',       '1', '2', '2006-07-22', 145000, 25000),
('STU2024003', 'Vivaan Gupta',    'vivaan.gupta@demo.edu',    '9810000003', 'B.Tech', 'Electronics',            '2', '3', '2005-01-09', 140000, 0),
('STU2024004', 'Ananya Iyer',     'ananya.iyer@demo.edu',     '9810000004', 'B.Tech', 'Mechanical',             '2', '4', '2005-11-30', 138000, 40000),
('STU2024005', 'Ishaan Reddy',    'ishaan.reddy@demo.edu',    '9810000005', 'B.Tech', 'Civil',                  '3', '5', '2004-05-18', 135000, 0),
('STU2024006', 'Saanvi Nair',     'saanvi.nair@demo.edu',     '9810000006', 'B.Tech', 'Electrical',             '3', '6', '2004-09-02', 138000, 15000),
('STU2024007', 'Kabir Singh',     'kabir.singh@demo.edu',     '9810000007', 'B.Tech', 'Information Technology', '4', '7', '2003-12-25', 145000, 0),
('STU2024008', 'Myra Joshi',      'myra.joshi@demo.edu',      '9810000008', 'B.Tech', 'Chemical',               '4', '8', '2003-04-11', 136000, 60000),
('STU2024009', 'Arjun Mehta',     'arjun.mehta@demo.edu',     '9810000009', 'B.Tech', 'Biotechnology',          '1', '1', '2006-08-27', 132000, 0),
('STU2024010', 'Kiara Desai',     'kiara.desai@demo.edu',     '9810000010', 'BCA',    'Computer Science',       '2', '3', '2005-06-05', 95000,  10000),
('STU2024011', 'Reyansh Verma',   'reyansh.verma@demo.edu',   '9810000011', 'BCA',    'Information Technology', '3', '5', '2004-02-19', 95000,  0),
('STU2024012', 'Aadhya Kulkarni', 'aadhya.kulkarni@demo.edu', '9810000012', 'MCA',    'Computer Science',       '1', '2', '2002-10-08', 120000, 30000),
('STU2024013', 'Vihaan Chatterjee','vihaan.c@demo.edu',       '9810000013', 'MCA',    'Information Technology', '2', '4', '2001-12-01', 120000, 0),
('STU2024014', 'Navya Menon',     'navya.menon@demo.edu',     '9810000014', 'MBA',    'Biotechnology',          '1', '1', '2001-03-23', 180000, 50000),
('STU2024015', 'Rohan Banerjee',  'rohan.banerjee@demo.edu',  '9810000015', 'MBA',    'Chemical',               '2', '3', '2000-07-16', 180000, 0);

-- ───────────── Staff (one or more per login role) ─────────────

INSERT INTO "Staff" ("Staff_id", "Staff_name", "Staff_dept", "Staff_email", "Phone", "Staff_type") VALUES
('STF001', 'Dr. Rajesh Khanna',    'Computer Science',       'rajesh.khanna@demo.edu',  '9820000001', 'Professor'),
('STF002', 'Dr. Meera Krishnan',   'Electronics',            'meera.krishnan@demo.edu', '9820000002', 'Professor'),
('STF003', 'Dr. Sunil Bhatt',      'Mechanical',             'sunil.bhatt@demo.edu',    '9820000003', 'Professor'),
('STF004', 'Prof. Kavita Rao',     'Computer Science',       'kavita.rao@demo.edu',     '9820000004', 'Coordinator'),
('STF005', 'Dr. Anil Kapoor',      'Administration',         'anil.kapoor@demo.edu',    '9820000005', 'Dean'),
('STF006', 'Pooja Malhotra',       'Human Resources',        'pooja.malhotra@demo.edu', '9820000006', 'HR'),
('STF007', 'Ramesh Pillai',        'Library',                'ramesh.pillai@demo.edu',  '9820000007', 'Librarian'),
('STF008', 'Neha Agarwal',         'Finance',                'neha.agarwal@demo.edu',   '9820000008', 'Accountant'),
('STF009', 'Vikram Thakur',        'Hostel',                 'vikram.thakur@demo.edu',  '9820000009', 'Warden'),
('STF010', 'Sanjay Mishra',        'Administration',         'sanjay.mishra@demo.edu',  '9820000010', 'Admin'),
('STF011', 'Ritu Saxena',          'Information Technology', 'ritu.saxena@demo.edu',    '9820000011', 'Assistant Professor'),
('STF012', 'Amit Chauhan',         'Civil',                  'amit.chauhan@demo.edu',   '9820000012', 'Assistant Professor'),
('STF013', 'Dr. Lakshmi Narayan',  'Electrical',             'lakshmi.n@demo.edu',      '9820000013', 'Professor'),
('STF014', 'Farhan Qureshi',       'Chemical',               'farhan.qureshi@demo.edu', '9820000014', 'Assistant Professor'),
('STF015', 'Dr. Swati Deshmukh',   'Biotechnology',          'swati.deshmukh@demo.edu', '9820000015', 'Professor');

-- ───────────── Attendance ─────────────

INSERT INTO attendance (student_id, presents, absents)
SELECT student_id, 60 + (row_number() OVER (ORDER BY student_id) * 7) % 30, 2 + (row_number() OVER (ORDER BY student_id) * 3) % 12
FROM students;

INSERT INTO student_attendnce ("Student_id", presents, absents)
SELECT student_id, 60 + (row_number() OVER (ORDER BY student_id) * 7) % 30, 2 + (row_number() OVER (ORDER BY student_id) * 3) % 12
FROM students;

INSERT INTO "Staff-Attendance" ("Staff_id", total_leaves, total_present)
SELECT "Staff_id", (row_number() OVER (ORDER BY "Staff_id") * 5) % 9, 140 + (row_number() OVER (ORDER BY "Staff_id") * 11) % 40
FROM "Staff";

-- ───────────── Leave ─────────────

INSERT INTO "leave" (employee, leave_type, start_date, end_date, status, reason) VALUES
('STF001', 'Sick Leave',          '2026-10-05', '2026-10-07', 'Approved', 'Viral fever'),
('STF002', 'Vacation',            '2026-12-20', '2026-12-31', 'Pending',  'Family trip to Kerala'),
('STF003', 'Personal',            '2026-11-03', '2026-11-03', 'Approved', 'Bank work'),
('STF004', 'Sick Leave',          '2026-10-28', '2026-10-30', 'Pending',  'Doctor advised rest'),
('STF006', 'Vacation',            '2026-11-15', '2026-11-20', 'Rejected', 'Overlaps with appraisal cycle'),
('STF007', 'Personal',            '2026-11-08', '2026-11-09', 'Pending',  'Sister''s wedding'),
('STF008', 'Maternity/Paternity', '2026-12-01', '2027-01-15', 'Approved', 'Paternity leave'),
('STF009', 'Sick Leave',          '2026-09-18', '2026-09-19', 'Approved', 'Migraine'),
('STF011', 'Vacation',            '2026-12-24', '2027-01-02', 'Pending',  'Winter break travel'),
('STF012', 'Personal',            '2026-10-29', '2026-10-29', 'Approved', 'Moving house'),
('STF013', 'Sick Leave',          '2026-11-10', '2026-11-12', 'Pending',  'Minor surgery'),
('STF014', 'Vacation',            '2026-11-25', '2026-11-29', 'Rejected', 'End-sem exam duty');

-- ───────────── Tasks & notices ─────────────

INSERT INTO "Tasks" ("Task_title", "Task_desc", dept, "Priority") VALUES
('Prepare mid-sem paper',        'Set the Data Structures mid-sem paper and send it for review.', 'Computer Science',       'High'),
('Update lab manuals',           'Revise the Digital Electronics lab manual for the new syllabus.', 'Electronics',          'Medium'),
('Workshop safety audit',        'Check all lathe machines and update the safety register.',     'Mechanical',             'High'),
('Site visit plan',              'Plan the third-year site visit to the metro construction yard.', 'Civil',                'Low'),
('Power lab inventory',          'List faulty equipment in the power systems lab.',              'Electrical',             'Medium'),
('Hackathon mentoring',          'Assign mentors to the 12 hackathon teams.',                    'Information Technology', 'Medium'),
('Chemical stock check',         'Reconcile the chemical store register with physical stock.',   'Chemical',               'High'),
('Research paper review',        'Review two student papers for the department journal.',        'Biotechnology',          'Low'),
('Placement drive prep',         'Collect resumes of final-year students for the TCS drive.',    'Computer Science',       'High'),
('Payroll verification',         'Verify October payroll before release.',                      'Finance',                'High'),
('New joiner onboarding',        'Complete documentation for three new faculty members.',        'Human Resources',        'Medium'),
('Accreditation file',           'Compile NAAC criteria 2 documents.',                           'Administration',         'High');

INSERT INTO "AssignTeamTask" (title, title_desc, staff_id) VALUES
('Annual tech fest',            'Coordinate venues, judges and sponsors for TechNova 2026.',   ARRAY['STF001','STF004','STF011']::varchar[]),
('NAAC visit preparation',      'Prepare department presentations for the NAAC peer team.',    ARRAY['STF005','STF010','STF001','STF002']::varchar[]),
('Library digitisation',        'Scan and catalogue 500 old journals.',                        ARRAY['STF007','STF011']::varchar[]),
('Hostel mess committee',       'Review mess menu and vendor feedback.',                       ARRAY['STF009','STF008']::varchar[]),
('Curriculum revision',         'Draft the revised B.Tech CSE curriculum for 2027.',           ARRAY['STF001','STF004','STF013']::varchar[]),
('Industry MoU follow-up',      'Follow up on the internship MoU with Infosys.',               ARRAY['STF005','STF012']::varchar[]),
('Fee defaulter outreach',      'Call parents of students with pending fees.',                 ARRAY['STF008','STF010']::varchar[]),
('Faculty development program', 'Organise a 5-day FDP on machine learning.',                   ARRAY['STF011','STF015','STF002']::varchar[]),
('Sports week',                 'Plan inter-department sports week schedule.',                 ARRAY['STF009','STF003','STF014']::varchar[]),
('Exam seating plan',           'Prepare seating plans for end-sem exams.',                    ARRAY['STF004','STF012','STF013']::varchar[]);

INSERT INTO notices (title, description, date, course) VALUES
('Mid-sem exam schedule',     'Mid-semester exams start on 10 November. Timetable is on the portal.', '2026-10-20', 'B.Tech'),
('Fee payment deadline',      'Last date to pay the semester fee without fine is 15 November.',       '2026-10-22', 'B.Tech'),
('TechNova 2026',             'Registrations for the annual tech fest are open till 5 November.',     '2026-10-24', 'B.Tech'),
('Workshop on cloud',         'Two-day AWS workshop in Lab 3 on 8–9 November.',                       '2026-10-25', 'B.Tech'),
('Placement drive',           'TCS campus drive for final-year students on 18 November.',             '2026-10-26', 'B.Tech'),
('BCA project submission',    'Submit minor project reports to your guide by 12 November.',           '2026-10-21', 'BCA'),
('BCA guest lecture',         'Guest lecture on cyber security on 6 November, Seminar Hall.',         '2026-10-23', 'BCA'),
('MCA viva schedule',         'Major project viva will be held from 20 November.',                    '2026-10-22', 'MCA'),
('MCA internship forms',      'Submit internship approval forms to the coordinator.',                 '2026-10-27', 'MCA'),
('MBA case competition',      'Inter-college case study competition on 14 November.',                 '2026-10-20', 'MBA'),
('MBA industrial visit',      'Industrial visit to Amul plant, Anand, on 22 November.',               '2026-10-26', 'MBA'),
('Diwali holidays',           'College remains closed from 7 to 11 November for Diwali.',             '2026-10-27', 'B.Tech');

INSERT INTO "StaffNotice" (title, description, type, dept) VALUES
('Staff meeting',              'All staff meeting on Friday at 3 PM in the conference hall.',  'General',   'All'),
('Salary credited',            'October salary has been credited.',                            'Update',    'All'),
('NAAC visit',                 'NAAC peer team visit on 2–3 December. Keep files ready.',      'Important', 'All'),
('CSE syllabus meeting',       'Board of studies meeting for CSE on 4 November.',              'Important', 'Computer Science'),
('Lab equipment arrival',      'New oscilloscopes delivered to the electronics lab.',          'Update',    'Electronics'),
('Workshop maintenance',       'Mechanical workshop closed on Saturday for maintenance.',      'General',   'Mechanical'),
('Survey camp duty',           'Civil faculty duty list for survey camp is published.',        'Important', 'Civil'),
('Power shutdown',             'Electrical block power shutdown on Sunday 9 AM–1 PM.',         'Update',    'Electrical'),
('Hackathon judges',           'IT faculty to judge the hackathon finals on 12 November.',     'General',   'Information Technology'),
('Chemical safety drill',      'Mandatory safety drill for chemical lab staff.',               'Important', 'Chemical'),
('Biotech grant',              'DBT research grant proposals due 30 November.',               'Important', 'Biotechnology'),
('Diwali holidays',            'Campus closed from 7 to 11 November.',                         'General',   'All');

INSERT INTO timetable (file_url, timetable_type, department) VALUES
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'student', 'Computer Science'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'student', 'Electronics'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'student', 'Mechanical'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'student', 'Civil'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'student', 'Information Technology'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'staff',   'Computer Science'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'staff',   'Electronics'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'staff',   'Mechanical'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'staff',   'Electrical'),
('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 'staff',   'Information Technology');

-- ───────────── Results ─────────────

INSERT INTO students_result ("Student_id", "Year", semester, "Rank", "Exam_type", subjects, marks, total_marks, "CGPA") VALUES
('STU2024001', '1', '1', '3',  'Mid-Sem', ARRAY['Mathematics I','Physics','Programming in C'],         ARRAY['42','38','45'], ARRAY['50','50','50'], '8.7'),
('STU2024002', '1', '2', '1',  'End-Sem', ARRAY['Mathematics II','Chemistry','Data Structures'],      ARRAY['88','79','92'], ARRAY['100','100','100'], '9.2'),
('STU2024003', '2', '3', '5',  'End-Sem', ARRAY['Signals','Network Theory','Digital Electronics'],    ARRAY['71','66','80'], ARRAY['100','100','100'], '7.8'),
('STU2024004', '2', '4', '8',  'Mid-Sem', ARRAY['Thermodynamics','Fluid Mechanics','Machine Drawing'], ARRAY['35','31','40'], ARRAY['50','50','50'], '7.1'),
('STU2024005', '3', '5', '2',  'End-Sem', ARRAY['Structural Analysis','Surveying','Concrete Tech'],   ARRAY['85','90','78'], ARRAY['100','100','100'], '8.9'),
('STU2024006', '3', '6', '4',  'Mid-Sem', ARRAY['Power Systems','Control Systems','Machines II'],     ARRAY['39','41','36'], ARRAY['50','50','50'], '8.1'),
('STU2024007', '4', '7', '1',  'End-Sem', ARRAY['Cloud Computing','Machine Learning','Big Data'],     ARRAY['94','91','89'], ARRAY['100','100','100'], '9.5'),
('STU2024008', '4', '8', '6',  'Mid-Sem', ARRAY['Process Control','Plant Design','Biochemistry'],     ARRAY['33','37','30'], ARRAY['50','50','50'], '7.4'),
('STU2024009', '1', '1', '9',  'Mid-Sem', ARRAY['Biology','Mathematics I','Chemistry'],               ARRAY['30','28','35'], ARRAY['50','50','50'], '6.9'),
('STU2024010', '2', '3', '3',  'End-Sem', ARRAY['Java','DBMS','Operating Systems'],                   ARRAY['82','87','76'], ARRAY['100','100','100'], '8.4'),
('STU2024011', '3', '5', '2',  'End-Sem', ARRAY['Web Technologies','Python','Software Engineering'],  ARRAY['90','85','88'], ARRAY['100','100','100'], '8.8'),
('STU2024012', '1', '2', '4',  'Mid-Sem', ARRAY['Advanced Java','Computer Networks','Algorithms'],    ARRAY['40','36','44'], ARRAY['50','50','50'], '8.3'),
('STU2024013', '2', '4', '1',  'End-Sem', ARRAY['AI','Cyber Security','Mobile Computing'],            ARRAY['93','88','90'], ARRAY['100','100','100'], '9.3'),
('STU2024014', '1', '1', '7',  'Mid-Sem', ARRAY['Marketing','Accounting','Economics'],                ARRAY['34','39','32'], ARRAY['50','50','50'], '7.6'),
('STU2024015', '2', '3', '5',  'End-Sem', ARRAY['Finance','HRM','Operations'],                        ARRAY['77','81','74'], ARRAY['100','100','100'], '8.0');

-- ───────────── Library ─────────────

INSERT INTO "Books" ("Book-Id", "Book-Name", "Publisher", "Book-category", "Stock") VALUES
('BK001', 'Introduction to Algorithms',          'MIT Press',       'Computer Science', 6),
('BK002', 'Operating System Concepts',           'Wiley',           'Computer Science', 5),
('BK003', 'Computer Networks',                   'Pearson',         'Computer Science', 4),
('BK004', 'Database System Concepts',            'McGraw Hill',     'Computer Science', 7),
('BK005', 'Microelectronic Circuits',            'Oxford',          'Electronics',      3),
('BK006', 'Signals and Systems',                 'Pearson',         'Electronics',      4),
('BK007', 'Engineering Thermodynamics',          'McGraw Hill',     'Mechanical',       5),
('BK008', 'Strength of Materials',               'Laxmi Publications', 'Civil',         6),
('BK009', 'Electrical Machinery',                'Khanna Publishers', 'Electrical',     4),
('BK010', 'Higher Engineering Mathematics',      'Khanna Publishers', 'Mathematics',    10),
('BK011', 'Organic Chemistry',                   'Pearson',         'Chemistry',        3),
('BK012', 'Molecular Biology of the Cell',       'Garland Science', 'Biotechnology',    2),
('BK013', 'Principles of Marketing',             'Pearson',         'Management',       5),
('BK014', 'Clean Code',                          'Prentice Hall',   'Computer Science', 3),
('BK015', 'Design of Machine Elements',          'McGraw Hill',     'Mechanical',       4);

INSERT INTO "Issue-Books" (staff_id, student_id, book_id, book_name, issue_date, return_date, returned) VALUES
('STF007', 'STU2024001', 'BK001', 'Introduction to Algorithms',     '2026-10-01', '2026-10-15', true),
('STF007', 'STU2024002', 'BK004', 'Database System Concepts',       '2026-10-05', '2026-10-19', false),
('STF007', 'STU2024003', 'BK005', 'Microelectronic Circuits',       '2026-10-08', '2026-10-22', false),
('STF007', 'STU2024004', 'BK007', 'Engineering Thermodynamics',     '2026-10-10', '2026-10-24', false),
('STF007', 'STU2024005', 'BK008', 'Strength of Materials',          '2026-10-12', '2026-10-26', true),
('STF007', 'STU2024006', 'BK009', 'Electrical Machinery',           '2026-10-14', '2026-10-28', false),
('STF007', 'STU2024007', 'BK014', 'Clean Code',                     '2026-10-15', '2026-10-29', false),
('STF007', 'STU2024008', 'BK011', 'Organic Chemistry',              '2026-10-16', '2026-10-30', false),
('STF007', 'STU2024009', 'BK012', 'Molecular Biology of the Cell',  '2026-10-18', '2026-11-01', false),
('STF007', 'STU2024010', 'BK002', 'Operating System Concepts',      '2026-10-20', '2026-11-03', false),
('STF007', 'STU2024012', 'BK003', 'Computer Networks',              '2026-10-22', '2026-11-05', false),
('STF007', 'STU2024014', 'BK013', 'Principles of Marketing',        '2026-10-24', '2026-11-07', false);

-- ───────────── Hostel ─────────────

INSERT INTO "Hostel_Rooms" (room_no, room_type, "Status") VALUES
('A-101', 'Single', 'Occupied'),
('A-102', 'Double', 'Occupied'),
('A-103', 'Double', 'Available'),
('A-104', 'Triple', 'Occupied'),
('A-105', 'Single', 'Available'),
('B-201', 'Double', 'Occupied'),
('B-202', 'Double', 'Occupied'),
('B-203', 'Triple', 'Available'),
('B-204', 'Single', 'Occupied'),
('C-301', 'Double', 'Available'),
('C-302', 'Triple', 'Occupied'),
('C-303', 'Single', 'Available');

INSERT INTO "Hostel_Students" ("Student_id", "RoomNo", fee_status, hostel_name) VALUES
('STU2024001', 'A-101', 'Paid',   'Aryabhatta Boys Hostel'),
('STU2024003', 'A-102', 'Paid',   'Aryabhatta Boys Hostel'),
('STU2024005', 'A-102', 'Unpaid', 'Aryabhatta Boys Hostel'),
('STU2024007', 'A-104', 'Paid',   'Aryabhatta Boys Hostel'),
('STU2024009', 'A-104', 'Unpaid', 'Aryabhatta Boys Hostel'),
('STU2024002', 'B-201', 'Paid',   'Gargi Girls Hostel'),
('STU2024004', 'B-202', 'Unpaid', 'Gargi Girls Hostel'),
('STU2024006', 'B-202', 'Paid',   'Gargi Girls Hostel'),
('STU2024008', 'B-204', 'Paid',   'Gargi Girls Hostel'),
('STU2024011', 'C-302', 'Paid',   'Aryabhatta Boys Hostel');

INSERT INTO "Hostel_complaints" (student_id, name, complaint_title, complaint_desc, status) VALUES
('STU2024001', 'Aarav Sharma',  'Fan not working',        'Ceiling fan in A-101 stopped working.',              'Resolved'),
('STU2024003', 'Vivaan Gupta',  'Water leakage',          'Bathroom tap in A-102 leaks all night.',             'Pending'),
('STU2024005', 'Ishaan Reddy',  'Wi-Fi issue',            'No Wi-Fi signal on the first floor since Monday.',   'Pending'),
('STU2024007', 'Kabir Singh',   'Mess food quality',      'Dinner was undercooked twice this week.',            'Resolved'),
('STU2024009', 'Arjun Mehta',   'Broken window',          'Window latch in A-104 is broken.',                   'Pending'),
('STU2024002', 'Diya Patel',    'Hot water',              'Geyser on B block second floor not heating.',        'Resolved'),
('STU2024004', 'Ananya Iyer',   'Room cleaning',          'Room B-202 not cleaned for three days.',             'Pending'),
('STU2024006', 'Saanvi Nair',   'Noise after hours',      'Loud music in the corridor after 11 PM.',            'Pending'),
('STU2024008', 'Myra Joshi',    'Laundry delay',          'Clothes given on Monday not returned yet.',          'Resolved'),
('STU2024011', 'Reyansh Verma', 'Light flickering',       'Tube light in C-302 keeps flickering.',              'Pending');
