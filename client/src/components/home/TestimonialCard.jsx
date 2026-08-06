function TestimonialCard({ name, review, image }) {
  return (
    <div
      className="
        group rounded-3xl border border-gray-100
        bg-white p-8 text-center shadow-sm
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      <img
        src={image}
        alt={name}
        className="
          mx-auto mb-6 h-24 w-24 rounded-full
          object-cover ring-4 ring-cyan-100
          transition-all duration-300
          group-hover:scale-110
        "
      />

      <p className="mb-6 italic leading-7 text-gray-600">
        "{review}"
      </p>

      <h3 className="text-xl font-bold text-slate-900">
        {name}
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Traveler
      </p>
    </div>
  );
}

export default TestimonialCard;