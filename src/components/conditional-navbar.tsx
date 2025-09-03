'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Only show navbar on homepage and main public pages
  const showNavbar = pathname === '/' || pathname.startsWith('/courses') || pathname.startsWith('/about') || pathname.startsWith('/blog');
  
  if (!showNavbar) {
    return null;
  }
  
  return <Navbar />;
}
