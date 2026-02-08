# Academic Years Management - Setup Guide

## Overview
The Academic Years Management system allows administrators to create, manage, and activate academic years for the College ERP system.

## Features
✅ List all academic years with status badges
✅ Add new academic years with auto-generated names
✅ Activate/deactivate academic years
✅ Only one active year at a time (enforced at both DB and API level)
✅ Beautiful, responsive UI with dark mode support
✅ Loading states and toast notifications
✅ Form validation and error handling

## Database Setup

### Step 1: Run the SQL Script
Execute the SQL file in your Supabase/PostgreSQL database:

```bash
psql -h your-host -U your-user -d your-database -f database/academic_years_setup.sql
```

Or run it directly in Supabase SQL Editor:
1. Go to Supabase Dashboard > SQL Editor
2. Copy contents of `database/academic_years_setup.sql`
3. Click "Run"

### Database Schema
```sql
Table: academic_years
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(50), UNIQUE) - e.g., "2025-2026"
- start_date (DATE)
- end_date (DATE)
- is_active (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Database Features
- Constraint: `end_date > start_date`
- Trigger: Automatically deactivates other years when one is activated
- Indexes: Optimized queries on `is_active` and dates

## API Endpoints

### GET `/api/academic-years`
Fetch all academic years ordered by start date (descending)

**Response:**
```json
[
  {
    "id": 1,
    "name": "2025-2026",
    "start_date": "2025-04-01",
    "end_date": "2026-03-31",
    "is_active": true,
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

### POST `/api/academic-years`
Create a new academic year

**Request Body:**
```json
{
  "start_date": "2026-04-01",
  "end_date": "2027-03-31",
  "is_active": false
}
```

**Response:** Created academic year object (201)

**Features:**
- Auto-generates name from dates (e.g., "2026-2027")
- If `is_active: true`, deactivates all other years
- Uses transaction for data consistency

### PATCH `/api/academic-years`
Activate/deactivate an academic year

**Request Body:**
```json
{
  "id": 2,
  "is_active": true
}
```

**Response:** Updated academic year object (200)

**Features:**
- If activating, automatically deactivates all others
- Uses transaction for atomic updates

## UI Components

### Main Page: `/Academic/setup`

#### Header Section
- Title: "Academic Years"
- Back button to navigate to previous page
- "Add Academic Year" button (top right)

#### Academic Years Table
Displays all academic years with columns:
1. **Year Name** - e.g., "2025-2026" (with calendar icon)
2. **Start Date** - Formatted as "Jan 15, 2025"
3. **End Date** - Formatted as "Mar 31, 2026"
4. **Status** - Badge (Active: green, Inactive: gray)
5. **Actions** - "Activate" button (only for inactive years)

#### Add Academic Year Modal
- **Start Date** (required) - Date picker
- **End Date** (required) - Date picker
- **Year Name Preview** - Auto-generated from dates
- **Set as Active** - Checkbox
- Warning message if "Set as Active" is checked
- Cancel and Create buttons

#### Activate Confirmation Modal
- Warning icon
- Confirmation message
- "Cancel" and "Activate" buttons
- Shows which year will be activated

## Usage Flow

### Adding a New Academic Year
1. Click "Add Academic Year" button
2. Select start date (e.g., April 1, 2026)
3. Select end date (e.g., March 31, 2027)
4. Year name "2026-2027" is auto-generated
5. Optionally check "Set as Active"
   - If checked, warning appears
6. Click "Create Year"
7. Success toast notification appears
8. Modal closes and table refreshes

### Activating an Academic Year
1. Find inactive year in the table
2. Click "Activate" button
3. Confirmation modal appears
4. Click "Activate" to confirm
5. All other years become inactive
6. Selected year becomes active
7. Success toast notification
8. Table refreshes with updated statuses

## Navigation

Access via:
- Direct URL: `/Academic/setup`
- Academic Dashboard: Click on "Academic Setup" card

## Styling & Design

### Design System
- **Colors**: Blue-to-indigo gradient theme
- **Dark Mode**: Full support with proper contrast
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React icons
- **Notifications**: React Toastify

### Responsive Design
- Mobile-friendly table (horizontal scroll on small screens)
- Adaptive modal sizing
- Touch-friendly buttons

## Error Handling

### Validation
- Start and end dates are required
- End date must be after start date
- Duplicate year names are prevented (DB constraint)

### Error Messages
- Network errors: "Failed to load academic years"
- Creation errors: Specific error from API
- Validation errors: User-friendly messages

### Loading States
- Initial page load: Spinner in center
- Form submission: Button shows "Creating..." with spinner
- Activation: Button shows "Activating..." with spinner

## Security Considerations

1. **Database Constraints**: Prevent invalid data
2. **Trigger**: Ensures only one active year
3. **Transaction**: Atomic updates prevent race conditions
4. **Validation**: Both client and server-side

## Future Enhancements

Potential features to add:
- Edit academic year dates
- Delete academic year (with cascade checks)
- View academic year details/statistics
- Academic year history/audit log
- Bulk import academic years
- Academic year templates

## Troubleshooting

### Issue: Table doesn't exist
**Solution:** Run the SQL setup script in your database

### Issue: Multiple active years
**Solution:** Run this SQL to fix:
```sql
UPDATE academic_years SET is_active = false WHERE id != (
  SELECT id FROM academic_years WHERE is_active = true LIMIT 1
);
```

### Issue: Year name conflicts
**Solution:** Delete duplicate entries or modify the year dates

## File Structure

```
app/
├── Academic/
│   └── setup/
│       └── page.js          # Main UI component
├── api/
│   └── academic-years/
│       └── route.js         # API endpoints
database/
└── academic_years_setup.sql # Database schema
```

## Testing Checklist

- [ ] Create academic year with valid dates
- [ ] Try creating year with invalid dates (end before start)
- [ ] Create active year (verify others deactivate)
- [ ] Activate inactive year (verify others deactivate)
- [ ] Check responsive design on mobile
- [ ] Test dark mode appearance
- [ ] Verify toast notifications appear
- [ ] Test back button navigation
- [ ] Check loading states work correctly
- [ ] Verify year name auto-generation

## Support

For issues or questions, check:
1. Browser console for errors
2. Server logs for API errors
3. Database logs for SQL errors

---

**Created:** February 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
