import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BGKILL | PRODUCTION-READY AI BACKGROUND REMOVER",
  description: "100% Free, Local, High-Quality Background Removal with U2Net AI Engine. No APIs, No Limits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#CAFF70] selection:text-black">
        {children}
      </body>
    </html>
  );
}
