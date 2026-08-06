function FeatureCard({ image, icon, title, description }) {
  return (
    <div
      className="
        group overflow-hidden rounded-3xl
        border border-gray-100 bg-white
        shadow-lg transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Image */}

      <img
        src={image}
        alt={title}
        className="
          h-44 w-full object-cover
          transition-transform duration-500
          group-hover:scale-105
        "
      />

      {/* Content */}

      <div className="p-5">
        <div
          className="
            mb-4 flex h-14 w-14
            items-center justify-center
            rounded-2xl bg-cyan-50
            text-3xl transition-all duration-300
            group-hover:scale-110
          "
        >
          {icon}
        </div>

        <h3 className="mb-2 text-xl font-semibold text-slate-900">
          {title}
        </h3>

        <p className="leading-6 text-gray-600">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FeatureCard;