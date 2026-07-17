function StepCard({ number, title, description }) {
  return (
    <div className="text-center bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition duration-300">

      <div className="w-16 h-16 mx-auto rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold mb-6">
        {number}
      </div>

      <h3 className="text-2xl font-semibold mb-3">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>

    </div>
  );
}

export default StepCard;