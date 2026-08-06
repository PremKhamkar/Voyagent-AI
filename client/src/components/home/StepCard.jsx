function StepCard({ number, title, description }) {
  return (
    <div
      className="
        group rounded-3xl border border-gray-100
        bg-white p-8 text-center shadow-sm
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      <div
        className="
          mx-auto mb-6 flex h-20 w-20
          items-center justify-center rounded-full
          bg-gradient-to-r from-cyan-500 to-blue-600
          text-3xl font-bold text-white
          transition-all duration-300
          group-hover:scale-110
        "
      >
        {number}
      </div>

      <h3 className="mb-4 text-2xl font-bold text-slate-900">
        {title}
      </h3>

      <p className="leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default StepCard;