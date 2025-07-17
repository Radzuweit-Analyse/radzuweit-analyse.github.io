export const metadata = {
  title: 'About - Independent Consultant',
  description: 'Learn more about my background and experience.',
};

export default function AboutPage() {
  return (
    <section className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <p className="mb-4">I am an experienced consultant helping businesses achieve success.</p>
      <p className="mb-4">With a proven track record and strong credentials, clients trust me to deliver results.</p>
      <img src="/profile.jpg" alt="Consultant" className="w-48 h-48 object-cover rounded-full mx-auto" />
    </section>
  );
}
