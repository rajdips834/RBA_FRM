const getCityCoordinates = async (city) => {
  try {
    const query = encodeURIComponent(city);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      const lat = data[0].lat;
      const lng = data[0].lon;
      return {
        latitude: parseFloat(lat).toFixed(4),
        longitude: parseFloat(lng).toFixed(4),
      };
    } else {
      return {
        latitude: "0.0",
        longitude: "0.0",
      };
    }
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return {
      latitude: "Error",
      longitude: "Error",
    };
  }
};

// Mock geocoding for testing without API key
const mockCityCoordinates = {
  // Major Indian Metro Cities
  Mumbai: { latitude: "19.0760", longitude: "72.8777" },
  Delhi: { latitude: "28.6139", longitude: "77.2090" },
  Bangalore: { latitude: "12.9716", longitude: "77.5946" },
  Hyderabad: { latitude: "17.3850", longitude: "78.4867" },
  Chennai: { latitude: "13.0827", longitude: "80.2707" },
  Kolkata: { latitude: "22.5726", longitude: "88.3639" },

  // Other Major Indian Cities
  Pune: { latitude: "18.5204", longitude: "73.8567" },
  Ahmedabad: { latitude: "23.0225", longitude: "72.5714" },
  Jaipur: { latitude: "26.9124", longitude: "75.7873" },
  Lucknow: { latitude: "26.8467", longitude: "80.9462" },
  Chandigarh: { latitude: "30.7333", longitude: "76.7794" },
  Bhopal: { latitude: "23.2599", longitude: "77.4126" },
  Indore: { latitude: "22.7196", longitude: "75.8577" },
  Nagpur: { latitude: "21.1458", longitude: "79.0882" },
  Kochi: { latitude: "9.9312", longitude: "76.2673" },
  Thiruvananthapuram: { latitude: "8.5241", longitude: "76.9366" },
  Surat: { latitude: "21.1702", longitude: "72.8311" },
  Guwahati: { latitude: "26.1445", longitude: "91.7362" },
  Bhubaneswar: { latitude: "20.2961", longitude: "85.8245" },
  Patna: { latitude: "25.5941", longitude: "85.1376" },

  // Japan Major Cities
  Tokyo: { latitude: "35.6895", longitude: "139.6917" },
  Osaka: { latitude: "34.6937", longitude: "135.5023" },
  Kyoto: { latitude: "35.0116", longitude: "135.7681" },
  Yokohama: { latitude: "35.4437", longitude: "139.6380" },
  Sapporo: { latitude: "43.0621", longitude: "141.3544" },
  Nagoya: { latitude: "35.1815", longitude: "136.9066" },
  Fukuoka: { latitude: "33.5902", longitude: "130.4017" },
  Kobe: { latitude: "34.6901", longitude: "135.1955" },
  Hiroshima: { latitude: "34.3853", longitude: "132.4553" },
  Sendai: { latitude: "38.2682", longitude: "140.8694" },

  // USA Major Cities
  "New York": { latitude: "40.7128", longitude: "-74.0060" },
  "Los Angeles": { latitude: "34.0522", longitude: "-118.2437" },
  Chicago: { latitude: "41.8781", longitude: "-87.6298" },
  Houston: { latitude: "29.7604", longitude: "-95.3698" },
  "San Francisco": { latitude: "37.7749", longitude: "-122.4194" },
  Boston: { latitude: "42.3601", longitude: "-71.0589" },
  Seattle: { latitude: "47.6062", longitude: "-122.3321" },
  Dallas: { latitude: "32.7767", longitude: "-96.7970" },
  Miami: { latitude: "25.7617", longitude: "-80.1918" },

  // UK Major Cities
  London: { latitude: "51.5074", longitude: "-0.1278" },
  Manchester: { latitude: "53.4808", longitude: "-2.2426" },
  Birmingham: { latitude: "52.4862", longitude: "-1.8904" },
  Liverpool: { latitude: "53.4084", longitude: "-2.9916" },
  Leeds: { latitude: "53.8008", longitude: "-1.5491" },

  // Australia Major Cities
  Sydney: { latitude: "-33.8688", longitude: "151.2093" },
  Melbourne: { latitude: "-37.8136", longitude: "144.9631" },
  Brisbane: { latitude: "-27.4698", longitude: "153.0251" },
  Perth: { latitude: "-31.9505", longitude: "115.8605" },
  Adelaide: { latitude: "-34.9285", longitude: "138.6007" },

  // Canada Major Cities
  Toronto: { latitude: "43.6532", longitude: "-79.3832" },
  Vancouver: { latitude: "49.2827", longitude: "-123.1207" },
  Montreal: { latitude: "45.5017", longitude: "-73.5673" },
  Calgary: { latitude: "51.0447", longitude: "-114.0719" },
  Ottawa: { latitude: "45.4215", longitude: "-75.6997" },
};

export const getCoordinatesFromCity = async (city) => {
  // For development, mock data (case-insensitive, trimmed match)
  if (city) {
    const normalized = city.trim().toLowerCase();
    const found = Object.entries(mockCityCoordinates).find(
      ([key]) => key.trim().toLowerCase() === normalized
    );
    if (found) {
      return found[1];
    }
  }

  // When ready to use real API:
  // return await getCityCoordinates(city);

  // return {0,0} coordinates for unknown cities
  return {
    latitude: "0.0000",
    longitude: "0.0000",
  };
};
