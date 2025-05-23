// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Survey App',
  description: 'Survey with Next.js + .NET API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />

        <main className="w-full flex-grow p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-center">Survey Form App</h1>
          </header>

          {/* Wrapper to ensure children take full width */}
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        <Footer />
      </body>
    </html>
  );
}
