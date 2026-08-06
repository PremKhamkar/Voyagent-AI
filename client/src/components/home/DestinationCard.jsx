import Button from "../ui/Button";

function DestinationCard({ image, title, description }) {
  return (
    <div
      className="
        mx-auto flex h-[360px] w-[350px] flex-col
        overflow-hidden rounded-3xl
        bg-white shadow-xl
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-2xl
      "
    >
      {/* Image */}

      <div className="h-[240px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            hover:scale-110
          "
        />
      </div>

      {/* Content */}

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 text-2xl font-bold">
          {title}
        </h3>

        <p className="mb-6 text-gray-600">
          {description}
        </p>

        <div className="mt-auto">
          <Button className="bg-cyan-500 text-white hover:bg-cyan-600">
            Explore
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;