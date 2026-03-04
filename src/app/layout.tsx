import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aivalytics Skill Builder",
  description: "Master aptitude tests with AI-driven analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
