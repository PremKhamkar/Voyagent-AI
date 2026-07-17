import Button from "../ui/Button";

function DestinationCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <img
        src={image}
        alt={title}
        className="w-full h-52 object-cover"
      />

      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>

        <p className="text-gray-600 mb-4">
          {description}
        </p>

        <Button className="bg-teal-500 text-white hover:bg-teal-600">
          Explore
        </Button>
      </div>
    </div>
  );
}

export default DestinationCard;