import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KASUMI — Quiet forms. Living spaces.",
  description: "A cinematic Japanese-minimal digital experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
