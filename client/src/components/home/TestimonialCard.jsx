function TestimonialCard({ name, review, image }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
      />

      <p className="text-gray-600 italic mb-4">
        "{review}"
      </p>

      <h3 className="text-lg font-semibold text-slate-800">
        {name}
      </h3>
    </div>
  );
}

export default TestimonialCard;