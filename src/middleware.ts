import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function proxy(req) {
        const token = req.nextauth.token;
        const isAuth = !!token;
        const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup');

        if (isAuthPage) {
            if (isAuth) {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
            return null;
        }

        // DEV BYPASS: Allow interview suite routes without auth
        if (req.nextUrl.pathname.startsWith('/dashboard/interview-suite')) {
            return null;
        }

        if (!isAuth) {

            let from = req.nextUrl.pathname;
            if (req.nextUrl.search) {
                from += req.nextUrl.search;
            }
            return NextResponse.redirect(
                new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
            );
        }

        // Admin Route Protection
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (token?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        // Profile Completion Enforcement
        if (isAuth) {
            const isProfilePage = req.nextUrl.pathname.startsWith('/dashboard/profile');
            const isApi = req.nextUrl.pathname.startsWith('/api');
            const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

            // If token says incomplete, or if we want to be extra sure for dash routes
            if (isDashboard && !isProfilePage && !isApi) {
                if (!token.isProfileComplete) {
                    console.log(`[MIDDLEWARE] Redirecting incomplete profile: ${token.email}, path: ${req.nextUrl.pathname}`);
                    return NextResponse.redirect(new URL('/dashboard/profile?incomplete=true', req.url));
                }
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow interview suite routes for dev bypass
                if (req.nextUrl.pathname.startsWith('/dashboard/interview-suite')) {
                    return true;
                }
                return !!token;
            },
        },
    }

);

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
