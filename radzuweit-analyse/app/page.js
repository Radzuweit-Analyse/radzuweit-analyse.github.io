import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="pt-20 px-4 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mt-10"
      >
        <h1 className="text-4xl font-bold mb-4">Helping You Succeed</h1>
        <p className="text-xl text-gray-600 mb-6">Independent consulting for modern businesses.</p>
        <Link href="/contact" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
      </motion.div>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-4 border rounded">Strategy Consulting</div>
          <div className="p-4 border rounded">Market Analysis</div>
          <div className="p-4 border rounded">Process Optimization</div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-4">Testimonials</h2>
        <p className="italic">"Great experience and outstanding results."</p>
      </section>

      <section className="mt-16 text-center">
        <Link href="/contact" className="text-blue-600 underline">Contact me today &rarr;</Link>
      </section>
    </section>
  );
}
