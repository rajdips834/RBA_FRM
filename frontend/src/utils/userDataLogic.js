import { getJWTToken, fetchAllUsers } from "../utils/globalUtils";
import apiClient from "../utils/apiClient";

export async function fetchToken(setToken) {
  try {
    const user = import.meta.env.VITE_JWT_USER_ID;
    const response = await getJWTToken(user);
    setToken(response);
  } catch (error) {
    console.error("Failed to fetch token:", error);
  }
}

export async function fetchUsers(token, setUsers) {
  try {
    const response = await fetchAllUsers(token);
    // Filter out client demo users
    const filteredUsers = Array.isArray(response)
      ? response.filter(
          (user) =>
            user !== "Shubham" && user !== "AvinashLande" && user !== "OmkarDJ"
        )
      : response;
    setUsers(filteredUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
}

export async function fetchDeviceDetails(setDeviceDetails) {
  try {
    const { data } = await apiClient.get("/api/device-details");
    if (data.success && data.deviceDetails) {
      setDeviceDetails(data.deviceDetails);
      // console.log("Fetched device details:", data.deviceDetails["anubhav1"]);
    } else {
      console.error("Device details fetch failed:", data.error || data);
    }
  } catch (error) {
    console.error("Error fetching device details:", error);
  }
}