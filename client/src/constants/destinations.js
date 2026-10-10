const DESTINATIONS = [
  {
    id: "goa",
    title: "Goa",
    country: "India",
    description:
      "Sun-soaked beaches, Portuguese heritage, lively markets and a relaxed coastal atmosphere.",
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "paris",
    title: "Paris",
    country: "France",
    description:
      "Iconic boulevards, museums, cafés and landmarks along the Seine.",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "tokyo",
    title: "Tokyo",
    country: "Japan",
    description:
      "A fast-moving capital where neon districts, temples, food and tradition meet.",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "kyoto",
    title: "Kyoto",
    country: "Japan",
    description:
      "Historic temples, gardens, tea houses and traditional streets in a quieter Japan.",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "bali",
    title: "Bali",
    country: "Indonesia",
    description:
      "Tropical beaches, rice terraces, temples and a rich wellness and surf culture.",
    image:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "rome",
    title: "Rome",
    country: "Italy",
    description:
      "Ancient ruins, Renaissance art, lively piazzas and legendary Italian food.",
    image:
      "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "venice",
    title: "Venice",
    country: "Italy",
    description:
      "Canals, historic palaces, intimate lanes and unforgettable lagoon views.",
    image:
      "https://images.unsplash.com/photo-1516303931221-ec8b3bc6261c?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "jaipur",
    title: "Jaipur",
    country: "India",
    description:
      "The Pink City, known for grand palaces, forts, bazaars and Rajasthani culture.",
    image:
      "https://images.unsplash.com/photo-1578155173088-710a9aef3849?auto=format&fit=crop&w=1200&q=85",
  },

  {
    id: "machu-picchu",
    title: "Machu Picchu",
    country: "Peru",
    description:
      "A spectacular Inca citadel set high in the Andes above the Sacred Valley.",
    image:
      "https://images.unsplash.com/photo-1588881270895-d6ae9ac4c571?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "cape-town",
    title: "Cape Town",
    country: "South Africa",
    description:
      "Ocean views, Table Mountain, beaches, vineyards and a vibrant cultural scene.",
    image:
      "https://images.unsplash.com/photo-1744604030401-b24c5975a574?auto=format&fit=crop&w=1200&q=85",
  },

  {
    id: "dubai",
    title: "Dubai",
    country: "United Arab Emirates",
    description:
      "Skyscrapers, desert adventures, beaches and a global dining and shopping scene.",
    image:
      "https://images.unsplash.com/photo-1465414951857-102134ffaa57?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "santorini",
    title: "Santorini",
    country: "Greece",
    description:
      "Whitewashed villages, blue domes, volcanic cliffs and spectacular Aegean sunsets.",
    image:
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "mumbai",
    title: "Mumbai",
    country: "India",
    description:
      "India's coastal megacity, from the Gateway of India and Marine Drive to Bollywood and street food.",
    image:
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "delhi",
    title: "Delhi",
    country: "India",
    description:
      "A capital layered with Mughal monuments, bustling bazaars and colonial-era boulevards.",
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1600&auto=format&fit=crop&q=90",
  },


  {
    id: "udaipur",
    title: "Udaipur",
    country: "India",
    description:
      "The City of Lakes, known for the City Palace and romantic lakeside havelis in Rajasthan.",
    image:
      "https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=1200&q=85",
  },


  {
    id: "kerala",
    title: "Kerala",
    country: "India",
    description:
      "Palm-fringed backwaters, houseboats, tea hills and Ayurvedic retreats along India's southwest coast.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "varanasi",
    title: "Varanasi",
    country: "India",
    description:
      "One of the world's oldest living cities, famed for its ghats and evening Ganga aarti on the river.",
    image:
      "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "rishikesh",
    title: "Rishikesh",
    country: "India",
    description:
      "A Himalayan foothill town on the Ganges known for yoga, river rafting and spiritual retreats.",
    image:
      "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "singapore",
    title: "Singapore",
    country: "Singapore",
    description:
      "A clean, futuristic city-state mixing Gardens by the Bay, hawker food and multicultural neighbourhoods.",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&auto=format&fit=crop&q=90",
  },


  {
    id: "seoul",
    title: "Seoul",
    country: "South Korea",
    description:
      "Royal palaces, hanok villages, K-culture and late-night food markets in a fast-moving capital.",
    image:
      "https://images.unsplash.com/photo-1686396338517-8064ea95a20d?auto=format&fit=crop&fm=jpg&q=85&w=1200",
  },


  {
    id: "hong-kong",
    title: "Hong Kong",
    country: "Hong Kong",
    description:
      "A dramatic skyline over Victoria Harbour, dim sum, night markets and quick hikes to Victoria Peak.",
    image:
      "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "taipei",
    title: "Taipei",
    country: "Taiwan",
    description:
      "Night markets, hot springs and Taipei 101, with mountains and tea villages close to the city.",
    image:
      "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "beijing",
    title: "Beijing",
    country: "China",
    description:
      "Home to the Forbidden City and Temple of Heaven, and a gateway to the Great Wall.",
    image:
      "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "bangkok",
    title: "Bangkok",
    country: "Thailand",
    description:
      "Ornate temples, canal life, street food and a lively nightlife scene in Thailand's capital.",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "phuket",
    title: "Phuket",
    country: "Thailand",
    description:
      "Thailand's largest island, with beaches, island-hopping boat trips and Old Town architecture.",
    image:
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "kuala-lumpur",
    title: "Kuala Lumpur",
    country: "Malaysia",
    description:
      "Home of the Petronas Towers, with a food scene that blends Malay, Chinese and Indian traditions.",
    image:
      "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "ho-chi-minh-city",
    title: "Ho Chi Minh City",
    country: "Vietnam",
    description:
      "A buzzing southern Vietnamese hub of French colonial landmarks, war museums and motorbike-filled streets.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1600&auto=format&fit=crop&q=90",
  },


  {
    id: "hanoi",
    title: "Hanoi",
    country: "Vietnam",
    description:
      "Vietnam's capital, with a centuries-old Old Quarter, lakes and famous street food.",
    image:
      "https://images.unsplash.com/photo-1708400586052-de2096798710?auto=format&fit=crop&fm=jpg&q=85&w=1200",
  },


  {
    id: "siem-reap",
    title: "Siem Reap",
    country: "Cambodia",
    description:
      "The base for exploring the Angkor temple complex, including Angkor Wat at sunrise.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "maldives",
    title: "Maldives",
    country: "Maldives",
    description:
      "Over a thousand coral islands known for overwater villas, clear lagoons and diving.",
    image:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "kathmandu",
    title: "Kathmandu",
    country: "Nepal",
    description:
      "A Himalayan valley city of ancient temples and stupas, and the starting point for treks.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&auto=format&fit=crop&q=90",
  },


  {
    id: "colombo",
    title: "Colombo",
    country: "Sri Lanka",
    description:
      "Sri Lanka's coastal capital, mixing colonial buildings, seafront promenades and local markets.",
    image:
      "https://images.unsplash.com/photo-1706174146606-aaab2da26107?auto=format&fit=crop&fm=jpg&q=85&w=1200",
  },


  {
    id: "london",
    title: "London",
    country: "United Kingdom",
    description:
      "Royal landmarks, world-class museums, historic pubs and the Thames running through the city.",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "barcelona",
    title: "Barcelona",
    country: "Spain",
    description:
      "Gaudí's architecture, Mediterranean beaches and tapas in the Gothic Quarter.",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "amsterdam",
    title: "Amsterdam",
    country: "Netherlands",
    description:
      "Canal-ringed streets, cycling culture and museums such as the Rijksmuseum and Van Gogh Museum.",
    image:
      "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "prague",
    title: "Prague",
    country: "Czech Republic",
    description:
      "A well-preserved medieval centre with a castle, Charles Bridge and Old Town Square.",
    image:
      "https://images.unsplash.com/photo-1541849546-216549ae216d?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "vienna",
    title: "Vienna",
    country: "Austria",
    description:
      "Imperial palaces, classical music heritage and traditional coffee houses.",
    image:
      "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "swiss-alps",
    title: "Swiss Alps",
    country: "Switzerland",
    description:
      "Snow-capped peaks, alpine villages, scenic trains and skiing or hiking depending on the season.",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "lisbon",
    title: "Lisbon",
    country: "Portugal",
    description:
      "Hilly, tiled streets, historic trams, riverside viewpoints and Atlantic seafood.",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "istanbul",
    title: "Istanbul",
    country: "Türkiye",
    description:
      "A city spanning two continents, with Hagia Sophia, the Grand Bazaar and the Bosphorus.",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "abu-dhabi",
    title: "Abu Dhabi",
    country: "United Arab Emirates",
    description:
      "Home to the Sheikh Zayed Grand Mosque, Louvre Abu Dhabi and desert experiences.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "doha",
    title: "Doha",
    country: "Qatar",
    description:
      "A modern Gulf capital with the Museum of Islamic Art, Souq Waqif and a waterfront skyline.",
    image:
      "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "zanzibar",
    title: "Zanzibar",
    country: "Tanzania",
    description:
      "Indian Ocean beaches, the historic Stone Town and spice farms.",
    image:
      "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "marrakech",
    title: "Marrakech",
    country: "Morocco",
    description:
      "Souks, riads and the Jemaa el-Fnaa square, with the Atlas Mountains close by.",
    image:
      "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "cairo",
    title: "Cairo",
    country: "Egypt",
    description:
      "Gateway to the Pyramids of Giza, with Islamic Cairo and the Egyptian Museum.",
    image:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "nairobi",
    title: "Nairobi",
    country: "Kenya",
    description:
      "Kenya's capital, with a national park on its doorstep and a base for safaris.",
    image:
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "new-york-city",
    title: "New York City",
    country: "United States",
    description:
      "Skyscrapers, Central Park, Broadway and world-class museums and food.",
    image:
      "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "vancouver",
    title: "Vancouver",
    country: "Canada",
    description:
      "A coastal city between mountains and sea, with Stanley Park and easy access to the outdoors.",
    image:
      "https://images.unsplash.com/photo-1559511260-66a654ae982a?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "banff",
    title: "Banff",
    country: "Canada",
    description:
      "A Canadian Rockies town near turquoise glacial lakes such as Lake Louise and Moraine Lake.",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "los-angeles",
    title: "Los Angeles",
    country: "United States",
    description:
      "Beaches, Hollywood, art museums and a sprawling mix of neighbourhoods and food.",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "mexico-city",
    title: "Mexico City",
    country: "Mexico",
    description:
      "Aztec and colonial history, vibrant murals and one of the world's great food scenes.",
    image:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "rio-de-janeiro",
    title: "Rio de Janeiro",
    country: "Brazil",
    description:
      "Copacabana and Ipanema beaches under Christ the Redeemer and Sugarloaf Mountain.",
    image:
      "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "buenos-aires",
    title: "Buenos Aires",
    country: "Argentina",
    description:
      "European-style boulevards, tango, steakhouses and colourful neighbourhoods like La Boca.",
    image:
      "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1600&auto=format&fit=crop&q=90",
  },


  {
    id: "cartagena",
    title: "Cartagena",
    country: "Colombia",
    description:
      "A walled colonial city on the Caribbean coast with colourful streets and nearby islands.",
    image:
      "https://images.unsplash.com/photo-1534943441045-1009d7cb0bb9?auto=format&fit=crop&fm=jpg&q=85&w=1200",
  },



  {
    id: "sydney",
    title: "Sydney",
    country: "Australia",
    description:
      "The Opera House, Harbour Bridge and beaches such as Bondi.",
    image:
      "https://images.unsplash.com/photo-1746230230909-4b7681c5d2aa?auto=format&fit=crop&fm=jpg&q=85&w=1200",
  },


  {
    id: "melbourne",
    title: "Melbourne",
    country: "Australia",
    description:
      "Laneway cafés, street art, sport and a strong coffee and arts scene.",
    image:
      "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1600&auto=format&fit=crop&q=90",
  },

  {
    id: "queenstown",
    title: "Queenstown",
    country: "New Zealand",
    description:
      "An adventure hub on Lake Wakatipu, known for bungee jumping, skiing and mountain scenery.",
    image:
      "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=1600&auto=format&fit=crop&q=90",
  },
];

export default DESTINATIONS;