import ContactForm from '../../components/ContactForm';

export const metadata = {
  title: 'Contact - Independent Consultant',
  description: 'Get in touch to start your project.',
};

export default function ContactPage() {
  return (
    <section className="pt-20 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <ContactForm />
      <p className="mt-6">You can also <a href="https://calendly.com" className="text-blue-600 underline">schedule a call</a>.</p>
    </section>
  );
}