'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Thank you for your message!');
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Name" className="w-full border p-2" />
        <input type="email" required placeholder="Email" className="w-full border p-2" />
        <textarea required placeholder="Message" className="w-full border p-2 h-32" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">Send</button>
      </form>
      {status && <p className="mt-4 text-green-600">{status}</p>}
    </>
  );
}
