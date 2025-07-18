export const metadata = {
  title: 'Services - Independent Consultant',
  description: 'Explore my consulting services.',
};

const services = [
  { title: 'Strategy Consulting', desc: 'Align business goals with a clear roadmap.' },
  { title: 'Market Analysis', desc: 'Data-driven insights for growth opportunities.' },
  { title: 'Process Optimization', desc: 'Improve efficiency and reduce costs.' },
];

export default function ServicesPage() {
  return (
    <section className="pt-20 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Services</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {services.map((s) => (
          <div key={s.title} className="border p-4 rounded">
            <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}