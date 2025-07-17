import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12 py-6 text-center text-sm">
      <nav className="space-x-4 mb-2">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/services" className="hover:underline">Services</Link>
        <Link href="/blog" className="hover:underline">Blog</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </nav>
      <p className="text-gray-500">© {new Date().getFullYear()} Independent Consultant.</p>
    </footer>
  );
}
