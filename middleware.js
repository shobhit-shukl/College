import { NextResponse } from 'next/server';

/**
 * Protected Routes - routes that require authentication
 */
const protectedRoutes = [
    '/StudentDashboard',
    '/StaffDashboard',
    '/Owner',
    '/HR',
    '/Academic',
    '/Accounts',
    '/HostelDashboard',
    '/library',
    '/UserRoleManagement',
    '/StaffsDetails',
    '/AdminDashboard',
];

/**
 * Role based access control
 * Based on login page roles: student, professor, coordinator, dean, hr, librarian, accountant, assistantprofessor, admin, superadmin
 */
const roleAccess = {
    // Student - only student dashboard and library
    student: ['/StudentDashboard', '/library'],

    // Professor - staff dashboard, academic, library
    professor: ['/StaffDashboard', '/Academic', '/library', '/StaffsDetails'],

    // Coordinator - staff dashboard, academic
    coordinator: ['/StaffDashboard', '/Academic', '/library', '/StaffsDetails'],

    // Dean - full management access
    dean: ['/StaffDashboard', '/Owner', '/HR', '/Academic', '/Accounts', '/library', '/UserRoleManagement', '/StaffsDetails'],

    // HR - only profile and HR management
    hr: ['/StaffDashboard', '/HR'],

    // Librarian - library management and staff details
    librarian: ['/StaffDashboard', '/library', '/StaffsDetails'],

    // Accountant - accounts and finance
    accountant: ['/StaffDashboard', '/Accounts', '/library'],

    // Assistant Professor - similar to professor
    assistantprofessor: ['/StaffDashboard', '/Academic', '/library', '/StaffsDetails'],

    // Admin - full access (same as superadmin)
    admin: ['/StudentDashboard', '/StaffDashboard', '/Owner', '/HR', '/Academic', '/Accounts', '/HostelDashboard', '/library', '/UserRoleManagement', '/StaffsDetails', '/AdminDashboard'],

    // Warden - hostel management + staff dashboard
    warden: ['/StaffDashboard', '/HostelDashboard', '/StaffsDetails'],

    // Superadmin - full access to everything
    superadmin: ['/StudentDashboard', '/StaffDashboard', '/Owner', '/HR', '/Academic', '/Accounts', '/HostelDashboard', '/library', '/UserRoleManagement', '/StaffsDetails', '/AdminDashboard'],
};

/**
 * Default redirect path for each role after login
 * Matches the redirectMap in page.js
 */
const defaultDashboard = {
    student: '/StudentDashboard',
    professor: '/StaffDashboard',
    coordinator: '/StaffDashboard',
    dean: '/StaffDashboard',
    hr: '/HR',
    librarian: '/StaffDashboard',
    accountant: '/StaffDashboard',
    assistantprofessor: '/StaffDashboard',
    warden: '/StaffDashboard',
    admin: '/StaffDashboard',
    superadmin: '/Owner',
};

export function middleware(req) {
    const { pathname } = req.nextUrl;

    // Get auth cookies
    const token = req.cookies.get('token')?.value;
    const role = req.cookies.get('role')?.value;
    const roleLower = String(role || '').toLowerCase();

    // Skip middleware for API routes and static files
    if (pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/uploads') ||
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // Check if trying to access a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // 🚫 Not logged in but trying to access protected route
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // 🔁 Logged in but accessing login page (/) - redirect to dashboard
    if (token && role && pathname === '/') {
        return redirectToDashboard(roleLower, req);
    }

    // 🔒 Role based protection - check if user has access to the route
    if (token && role && isProtectedRoute) {
        const allowedRoutes = roleAccess[roleLower] || [];

        const hasAccess = allowedRoutes.some(route =>
            pathname.startsWith(route)
        );

        // If user doesn't have access, redirect to their dashboard
        if (!hasAccess) {
            return redirectToDashboard(roleLower, req);
        }
    }

    return NextResponse.next();
}

/**
 * Redirect user to their default dashboard based on role
 */
function redirectToDashboard(role, req) {
    const redirectPath = defaultDashboard[role] || '/';
    return NextResponse.redirect(new URL(redirectPath, req.url));
}

/**
 * Apply middleware on all routes
 */
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*|uploads).*)',
    ],
};