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
    // Student - only student dashboard (their issued books are shown there;
    // /library is the librarian's management screen)
    student: ['/StudentDashboard'],

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

/**
 * API routes anyone can call without logging in
 */
const publicApiRoutes = ['/api/login'];

/**
 * API routes a student login may call - only what StudentDashboard uses
 */
const studentApiRoutes = [
    '/api/AuthStudents',
    '/api/HostelComplaints',
    '/api/HostelProfile',
    '/api/Issued-books',
    '/api/StudentAttendance',
    '/api/StudentsCGPA',
    '/api/StudentsNotice',
    '/api/timetable',
    '/api/upload-profile',
];

function matchesRoute(routes, pathname) {
    return routes.some(route => pathname === route || pathname.startsWith(route + '/'));
}

/**
 * Token from the `token` cookie, or an `Authorization: Bearer` header
 */
function getToken(req) {
    const auth = req.headers.get('authorization');
    if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
    return req.cookies.get('token')?.value || null;
}

function base64UrlDecode(str) {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(str.length / 4) * 4, '=');
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

/**
 * Verify an HS256 JWT signed by /api/login (jsonwebtoken does not run here,
 * so this uses Web Crypto). Returns the payload, or null if invalid/expired.
 */
async function verifySession(token) {
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    try {
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['verify']
        );
        const valid = await crypto.subtle.verify(
            'HMAC',
            key,
            base64UrlDecode(signature),
            new TextEncoder().encode(`${header}.${payload}`)
        );
        if (!valid) return null;

        const claims = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
        if (claims.exp && claims.exp * 1000 < Date.now()) return null;
        return claims;
    } catch {
        return null;
    }
}

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // Skip static files
    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/uploads') ||
        pathname.includes('.')) {
        return NextResponse.next();
    }

    // The role comes from the signed token, never from the editable `role` cookie
    const session = await verifySession(getToken(req));
    const role = session?.role;
    const roleLower = String(role || '').toLowerCase();

    // 🔐 API routes: everything except login needs a valid token
    if (pathname.startsWith('/api')) {
        if (publicApiRoutes.includes(pathname)) {
            return NextResponse.next();
        }
        if (!session) {
            return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
        }
        if (roleLower === 'student' && !matchesRoute(studentApiRoutes, pathname)) {
            return NextResponse.json({ error: 'Not allowed for students' }, { status: 403 });
        }
        return NextResponse.next();
    }

    // Check if trying to access a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // 🚫 Not logged in but trying to access protected route
    if (!session && isProtectedRoute) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // 🔁 Logged in but accessing login page (/) - redirect to dashboard
    if (session && role && pathname === '/') {
        return redirectToDashboard(roleLower, req);
    }

    // 🔒 Role based protection - check if user has access to the route
    if (session && role && isProtectedRoute) {
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