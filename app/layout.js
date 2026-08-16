import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from 'next';

export const metadata = {
  title: 'FocusTask | Best Free Online To-Do List & Task Manager',
  description: 'Boost your daily productivity with FocusTask. The ultimate free online to-do list, daily planner, and task manager designed to organize your life effortlessly.',
  keywords: [
    'free online to-do list',
    'best task manager app',
    'daily planner online',
    'productivity checklist tool',
    'minimalist task organizer',
    'track daily goals'
  ],
  openGraph: {
    title: 'FocusTask | Best Free Online To-Do List & Task Manager',
    description: 'Boost your daily productivity. Organize tasks, set priorities, and get things done with our free online daily planner.',
    url: 'https://vercel.app', // Replace with your live Vercel/Netlify URL
    siteName: 'FocusTask',
    images: [
      {
        url: 'https://vercel.app/og-image.png', // Replace with an actual screenshot or banner image path later
        width: 1200,
        height: 630,
        alt: 'FocusTask App Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FocusTask | Free Online To-Do List',
    description: 'Boost your daily productivity. Organize tasks easily.',
    images: ['https://vercel.app/og-image.png'],
  },
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
          {children}
       
        </body>
    </html>
  );
}
