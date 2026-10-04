// Curated catalog for the landing page "Popular Destinations" section.
//
// Every entry is a real place with a real image URL. Nothing here is
// generated at runtime: the section simply picks a few entries from this
// list at random.
//
// Fields:
//   id          unique, stable key
//   title       destination name
//   country     country name
//   description one short line shown on the card
//   image       image URL
//
// A destination may later get an optional `video` field once a verified,
// embeddable source has been chosen. It is intentionally absent for now,
// and the UI renders a normal image card for every entry.

const DESTINATIONS = [
  {
    id: "goa",
    title: "Goa",
    country: "India",
    description: "Sunny beaches, seafood shacks and Portuguese-era old towns.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
  },
  {
    id: "paris",
    title: "Paris",
    country: "France",
    description: "Art, architecture and café culture along the Seine.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  },
  {
    id: "tokyo",
    title: "Tokyo",
    country: "Japan",
    description: "Neon-lit districts alongside temples and quiet gardens.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
  },
  {
    id: "kyoto",
    title: "Kyoto",
    country: "Japan",
    description: "Historic temples, traditional streets and tea houses.",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "bali",
    title: "Bali",
    country: "Indonesia",
    description: "Rice terraces, beaches and temples on the Island of the Gods.",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "rome",
    title: "Rome",
    country: "Italy",
    description: "Ancient ruins, grand piazzas and some of Italy's best food.",
    image:
      "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "venice",
    title: "Venice",
    country: "Italy",
    description: "A city of canals, bridges and centuries of history.",
    image:
      "https://images.unsplash.com/photo-1516303931221-ec8b3bc6261c?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "jaipur",
    title: "Jaipur",
    country: "India",
    description: "The Pink City, known for its forts, palaces and bazaars.",
    image:
      "https://images.unsplash.com/photo-1568874395709-e653a957464d?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "machu-picchu",
    title: "Machu Picchu",
    country: "Peru",
    description: "A mountaintop Inca citadel high in the Andes.",
    image:
      "https://images.unsplash.com/photo-1588881270895-d6ae9ac4c571?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "cape-town",
    title: "Cape Town",
    country: "South Africa",
    description: "Table Mountain, coastal drives and vineyards nearby.",
    image:
      "https://images.unsplash.com/photo-1430263517459-34119c5e8380?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "dubai",
    title: "Dubai",
    country: "United Arab Emirates",
    description: "Record-breaking skyscrapers, desert trips and big shopping.",
    image:
      "https://images.unsplash.com/photo-1465414951857-102134ffaa57?w=900&auto=format&fit=crop&q=80",
  },
  {
    id: "santorini",
    title: "Santorini",
    country: "Greece",
    description: "Whitewashed villages and sunsets over the Aegean caldera.",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=900&auto=format&fit=crop&q=80",
  },
];

export default DESTINATIONS;
