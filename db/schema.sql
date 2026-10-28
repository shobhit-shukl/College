-- ERP Pro database schema (Postgres / Supabase).
-- Rebuilt from the queries in app/api/**; table and column names (including
-- the quoted mixed-case ones) must match the code exactly.
-- Safe to re-run: every statement is IF NOT EXISTS.

-- ───────────── People ─────────────

CREATE TABLE IF NOT EXISTS students (
  id            serial PRIMARY KEY,
  student_id    varchar(50) UNIQUE NOT NULL,
  name          text,
  email         text,
  "Phone"       text,
  course        text,
  department    text,
  year          text,
  semester      text,
  dob           date,
  image         text,
  total_fee     numeric(12,2) DEFAULT 0,
  "pending _fee" numeric(12,2) DEFAULT 0,  -- the space is intentional; app/api/students uses it
  "Password"    text,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Staff" (
  id            serial PRIMARY KEY,
  "Staff_id"    varchar(50) UNIQUE NOT NULL,
  "Staff_name"  text,
  "Staff_dept"  text,
  "Staff_email" text,
  "Phone"       text,
  "Staff_type"  text DEFAULT 'Professor',
  image         text,
  "Password"    text,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "SuperAdmin" (
  id              serial PRIMARY KEY,
  "SuperAdmin_Id" varchar(50) UNIQUE NOT NULL,
  -- app/api/login reads user["Super_id"] for the token id
  "Super_id"      varchar(50) GENERATED ALWAYS AS ("SuperAdmin_Id") STORED,
  name            text,
  "Password"      text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

-- ───────────── Attendance & leave ─────────────

CREATE TABLE IF NOT EXISTS attendance (
  id          serial PRIMARY KEY,
  student_id  varchar(50),
  presents    integer DEFAULT 0,
  absents     integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- "attendnce" spelling matches app/api/StudentAttendance
CREATE TABLE IF NOT EXISTS student_attendnce (
  id           serial PRIMARY KEY,
  "Student_id" varchar(50),
  presents     integer DEFAULT 0,
  absents      integer DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Staff-Attendance" (
  id            serial PRIMARY KEY,
  "Staff_id"    varchar(50),
  total_leaves  integer DEFAULT 0,
  total_present integer DEFAULT 0,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "leave" (
  id          serial PRIMARY KEY,
  employee    varchar(50),
  leave_type  text,
  start_date  date,
  end_date    date,
  status      text DEFAULT 'Pending',
  reason      text,
  created_at  timestamptz DEFAULT now()
);

-- ───────────── Tasks & notices ─────────────

CREATE TABLE IF NOT EXISTS "Tasks" (
  id           serial PRIMARY KEY,
  "Task_title" text,
  "Task_desc"  text,
  dept         text,
  "Priority"   text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "AssignTeamTask" (
  id          serial PRIMARY KEY,
  title       text,
  title_desc  text,
  staff_id    varchar[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notices (
  id          serial PRIMARY KEY,
  title       text,
  description text,
  date        date,
  course      text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "StaffNotice" (
  id          serial PRIMARY KEY,
  title       text,
  description text,
  type        text,
  dept        text DEFAULT 'All',
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS timetable (
  id             serial PRIMARY KEY,
  file_url       text,
  timetable_type text,
  department     text,
  uploaded_at    timestamptz DEFAULT now()
);

-- ───────────── Results ─────────────

CREATE TABLE IF NOT EXISTS students_result (
  id           serial PRIMARY KEY,
  "Student_id" varchar(50),
  "Year"       text,
  semester     text,
  "Rank"       text,
  "Exam_type"  text,
  subjects     text[],
  marks        text[],
  total_marks  text[],
  "CGPA"       text,
  created_at   timestamptz DEFAULT now()
);

-- ───────────── Library ─────────────

CREATE TABLE IF NOT EXISTS "Books" (
  id              serial,                 -- app/api/bookdetails orders by "id"
  "Book-Id"       varchar(50) PRIMARY KEY,
  "Book-Name"     text,
  "Publisher"     text,
  "Book-category" text,
  "Stock"         integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Issue-Books" (
  id          serial PRIMARY KEY,
  staff_id    varchar(50),
  student_id  varchar(50),
  book_id     varchar(50),
  book_name   text,
  issue_date  date DEFAULT current_date,
  return_date date,
  returned    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- ───────────── Hostel ─────────────

CREATE TABLE IF NOT EXISTS "Hostel_Rooms" (
  id         serial PRIMARY KEY,
  room_no    text,
  room_type  text,
  "Status"   text DEFAULT 'Available',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Hostel_Students" (
  id           serial PRIMARY KEY,
  "Student_id" varchar(50),
  "RoomNo"     text,
  fee_status   text DEFAULT 'Pending',
  hostel_name  text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Hostel_complaints" (
  id              serial PRIMARY KEY,
  student_id      varchar(50),
  name            text,
  complaint_title text,
  complaint_desc  text,
  status          text DEFAULT 'Pending',
  created_at      timestamptz DEFAULT now()
);

-- ───────────── Lock down the Supabase REST API ─────────────
-- The app connects as the postgres role (bypasses RLS). Enabling RLS with no
-- policies stops anyone using the public anon key from reading these tables.

ALTER TABLE students            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SuperAdmin"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance          ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendnce   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Staff-Attendance"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "leave"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tasks"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AssignTeamTask"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StaffNotice"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable           ENABLE ROW LEVEL SECURITY;
ALTER TABLE students_result     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Books"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Issue-Books"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Hostel_Rooms"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Hostel_Students"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Hostel_complaints" ENABLE ROW LEVEL SECURITY;
