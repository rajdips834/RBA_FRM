// Util functions
import axios from "axios";
import apiClient from "./apiClient";
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomFloat = (min, max, decimals = 2) => {
  const factor = 10 ** decimals;
  return (
    Math.floor(
      Math.random() * (max * factor - min * factor + 1) + min * factor
    ) / factor
  );
};

export const getRequestTime = () => {
  return new Date().toISOString().replace("T", " ").split(".")[0];
};

export const getJWTToken = async (userId) => {
  const requestTime = getRequestTime();
  const axiomUrl = import.meta.env.VITE_AXIOM_URL;
  const accountId = import.meta.env.VITE_ACCOUNT_ID;
  const url = `${axiomUrl}/adaptivetoken/getJWTToken?accountId=${accountId}&requestTime=${encodeURIComponent(
    requestTime
  )}&userId=${userId}`;
  const { data } = await apiClient.post(url);
  return data.resultData; // Assumes API returns { token: "..." }
};
export const fetchAllUsers = async (token) => {
  const requestTime = getRequestTime();
  const axiomUrl = import.meta.env.VITE_AXIOM_URL;
  const accountId = import.meta.env.VITE_ACCOUNT_ID;
  const url = `${axiomUrl}/user/getAllUsers?accountId=${accountId}&requestTime=${encodeURIComponent(
    requestTime
  )}`;

  const response = await axios.get(url, {
    headers: {
      AuthToken: `${token}`,
    },
  });
  return response.data.resultData.map((user) => user.userid);
};


export const createBulkUsers = async (file, token) => {
  const axiomUrl = import.meta.env.VITE_AXIOM_URL;
  const accountId = import.meta.env.VITE_ACCOUNT_ID;
  const appId = import.meta.env.VITE_APP_ID;
  const url = `${axiomUrl}/user/createBulkUsers?accountId=${accountId}&sendEmail=false&appId=${appId}`;

  const response = await axios.post(url, file, {
    headers: {
      "Content-Type": "multipart/form-data",
      AuthToken: `${token}`,
    },
  });

  return response.data;
};

export const generateRandomUsersFile = () => {
  const csvContent =
    "name,email\n" +
    Array.from({ length: 10 }, () => {
      const name = `User${Math.floor(Math.random() * 10000)}`;
      const email = `${name.toLowerCase()}@example.com`;
      return `${name},${email}`;
    }).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  return new File([blob], "users.csv", { type: "text/csv" });
};
function getRandomDateTimeISO(start, end) {
  // start and end are strings in datetime-local format or Date objects
  const startDate = typeof start === "string" ? new Date(start) : start;
  const endDate = typeof end === "string" ? new Date(end) : end;
  const randomTime =
    startDate.getTime() +
    Math.random() * (endDate.getTime() - startDate.getTime());
  const randomDate = new Date(randomTime);
  // Return in ISO string (YYYY-MM-DDTHH:mm:ss)
  return randomDate.toISOString().slice(0, 19);
}

const getRandomId = (length = 22) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const getRandomGeoLocation = () => {
  const lat = getRandomFloat(8, 37, 4);
  const long = getRandomFloat(68, 97, 4);
  return { latitude: lat.toString(), longitude: long.toString() };
};

const randomTimestamp = (start, end) => getRandomDateTimeISO(start, end);
const randomTransactionTime = () => getRandomInt(1, 30);
const randomTransactionId = () => getRandomId();
const randomTransactionAmount = (min, max) =>
  getRandomFloat(min, max).toFixed(2);
const randomTransactionType = () => "Transfer";
const randomRecipientDetails = () => `recipient-${getRandomId(3)}`;
const randomTransactionCategory = () => "Online";
const randomCurrency = () => "INR";
const randomTimeZone = () => "IST";
const randomTransactionFrequency = () => "one-time";
const randomWalletId = () => `wallet-${getRandomInt(1, 100)}`;
const randomPaymentMode = () => "upi";

// Always "Not Applicable" in your example
const constantNotApplicable = () => "Not Applicable";
const emptyField = () => "";

// Export the utility functions for use in other files
export { getRandomFloat, getRandomDateTimeISO };

