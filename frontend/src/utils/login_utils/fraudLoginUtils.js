// Use country/city options from locationOptions.js
import { countryCityOptions } from "../../data/locationOptions";

// Flatten all cities and countries from locationOptions
const FRAUD_COUNTRIES = Object.keys(countryCityOptions);
const FRAUD_CITIES = Object.values(countryCityOptions)
  .flat()
  .map((opt) => opt.value);

export async function createFraudLoginPayloads({
  numFraudRequests,
  baseLoginData,
  usedCities,
  usedCountries,
  maxTimeTaken,
  useRandomUsers,
  deviceType,
  selectedRandomUsers,
  urlUserId,
  buildLoginPayload,
  generateRandomDevice,
}) {
  // Find available city/country not used
  console.log(maxTimeTaken);
  const availableCities = FRAUD_CITIES.filter(
    (c) => !usedCities.includes(c.toLowerCase())
  );
  const availableCountries = FRAUD_COUNTRIES.filter(
    (c) => !usedCountries.includes(c.toLowerCase())
  );
  let fraudPayloads = [];
  for (let i = 0; i < numFraudRequests; i++) {
    // Pick userId
    let userId = useRandomUsers
      ? selectedRandomUsers[
          Math.floor(Math.random() * selectedRandomUsers.length)
        ]
      : urlUserId;
    // Generate random device
    const randomDevice = generateRandomDevice(deviceType);
    // Pick city/country not used
    const city = availableCities[i % availableCities.length] || "UnknownCity";
    const country =
      availableCountries[i % availableCountries.length] || "UnknownCountry";
    // Set fraud fields
    const fraudLoginData = {
      ...baseLoginData,
      city,
      country,
      time_taken_to_complete_login: maxTimeTaken + 100 * (1 + Math.random()), // much higher
    };
    // console.log("Fraud Login Data:", fraudLoginData);
    const loginPayload = await buildLoginPayload(
      randomDevice,
      fraudLoginData,
      userId,
      true,
      true
    );
    fraudPayloads.push(loginPayload);
  }
  return fraudPayloads;
}
