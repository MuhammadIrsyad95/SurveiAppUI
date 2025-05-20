'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  const navigation = [
    { label: 'Forms', href: '#forms-section' },
    { label: 'Custom Builder', href: '#builder-section' },
    { label: 'Responses', href: '#responses-section' },
    { label: 'Admin Panel', href: '#admin-section' },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white dark:bg-zinc-900 shadow-md transition-all">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center py-4">
        
        {/* Mobile Top Bar */}
        <div className="flex md:hidden items-center justify-between w-full mb-2">
          <Link href="/" className="text-zinc-800 dark:text-white">
            <Home className="h-7 w-7" />
          </Link>
          <span className="text-lg font-semibold text-zinc-800 dark:text-white flex-1 text-center">
            MyForms
          </span>
          {!isAdmin && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-zinc-800 dark:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-7 w-7" />
            </button>
          )}
        </div>

        {/* Desktop Logo */}
        <div className="hidden md:flex items-center mb-2 md:mb-0">
          <Link href="/" className="text-2xl font-bold text-zinc-800 dark:text-white">
            MyForms
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex">
          <div className="w-64 bg-white dark:bg-zinc-900 h-full flex flex-col shadow-lg animate-slideInLeft relative">
            <button
              className="absolute top-4 right-4 text-zinc-500 dark:text-zinc-300 hover:text-black dark:hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-7 w-7" />
            </button>

            <div className="flex items-center h-16 px-4 border-b border-zinc-200 dark:border-zinc-700">
              <span className="text-xl font-bold text-zinc-800 dark:text-white">MyForms</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Overlay click close */}
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
