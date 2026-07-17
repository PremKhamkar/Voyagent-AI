function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold">{title}</h2>
      <p className="text-gray-500 mt-4">{subtitle}</p>
    </div>
  );
}

export default SectionTitle;