import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {QueryProvider} from "@/app/providers/QueryProvider";
import { ToastContainer, toast } from 'react-toastify'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Curriculum Hub",
  description: "An AI-powered tool that helps\n" +
      "teachers generate, edit and publish lesson plans grounded in Nova Pioneer's curriculum\n" +
      "structures, standards and ten years of existing learning materials. The teacher stays in the\n" +
      "loop.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

        <body className="min-h-full flex flex-col">
            <QueryProvider>
                <ToastContainer autoClose={5000} />
                {children}
            </QueryProvider>
        </body>
    </html>
  );
}
