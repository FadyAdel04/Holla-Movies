import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server"; // Ensure this import is correct

// Use Clerk middleware to check authentication
export default clerkMiddleware({
  publicRoutes: ["/", "/profile"], // Allow public access to specific pages
});

// Matcher configuration
export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico).*)"],
};
