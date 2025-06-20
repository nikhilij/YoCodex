import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata = {
   title: "YoCodex - Where Code Meets Community",
   description: "A modern platform for developers to share code, collaborate, and build amazing projects together.",
};

export default function RootLayout({ children }) {
   return (
      <html lang="en">
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
      </html>
   );
}
