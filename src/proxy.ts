import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const { pathname } = req.nextUrl;
        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

        // 1. If user is logged in and tries to access login/signup pages, redirect to dashboard
        if (isAuthPage) {
            if (isAuth) {
                const role = token.role || 'user';
                if (role === 'admin') {
                    return NextResponse.redirect(new URL('/admin', req.url));
                }
                if (!token.isProfileComplete) {
                    return NextResponse.redirect(new URL('/dashboard/profile?incomplete=true', req.url));
                }
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return null;
        }

        // 2. Admin Route Protection (already handled by authorized but we can be specific)
        if (pathname.startsWith('/admin')) {
            if (token?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        // 3. Profile Completion Enforcement
        if (isAuth) {
            const isProfilePage = pathname.startsWith('/dashboard/profile');
            const isApi = pathname.startsWith('/api');
            const isDashboard = pathname.startsWith('/dashboard');

            if (isDashboard && !isProfilePage && !isApi) {
                if (!token.isProfileComplete) {
                    console.log(`[PROXY] Redirecting incomplete profile: ${token.email}, path: ${pathname}`);
                    return NextResponse.redirect(new URL('/dashboard/profile?incomplete=true', req.url));
                }
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                // Allow access to auth pages without a token
                if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
                    return true;
                }
                // Require token for everything else in the matcher
                return !!token;
            },
        },
    }
);

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/login",
        "/signup",
        "/tcs-portal/:path*",
        "/wipro-portal/:path*",
    ],
};
