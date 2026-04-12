import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Content Repository | Admin Dashboard",
  description: "Review and sync AI-generated MCQs to Firebase Cloud Storage.",
};

export default function GeneratedDataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
