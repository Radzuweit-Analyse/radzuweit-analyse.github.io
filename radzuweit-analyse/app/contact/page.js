'use client';
import { useState } from 'react';

export const metadata = {
  title: 'Contact - Independent Consultant',
  description: 'Get in touch to start your project.',
};

export default function ContactPage() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you for your message!');
  };

  return (
    <section className="pt-20 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Name" className="w-full border p-2" />
        <input type="email" required placeholder="Email" className="w-full border p-2" />
        <textarea required placeholder="Message" className="w-full border p-2 h-32" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Send</button>
      </form>
      {status && <p className="mt-4 text-green-600">{status}</p>}
      <p className="mt-6">You can also <a href="https://calendly.com" className="text-blue-600 underline">schedule a call</a>.</p>
    </section>
  );
}
