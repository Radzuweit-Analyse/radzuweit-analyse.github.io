'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 bg-white shadow transition-colors ${scrolled ? 'bg-opacity-90 backdrop-blur' : 'bg-transparent'}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-semibold">
          Consultant
        </Link>
        <nav className="space-x-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
        <Link href="/contact" className="ml-4 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Schedule a Call
        </Link>
      </div>
    </motion.header>
  );
}