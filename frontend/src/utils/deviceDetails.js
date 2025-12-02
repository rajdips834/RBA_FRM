import apiClient from "./apiClient";

export const addDeviceProfiles = async (userIds) => {
  try {
    await apiClient.post("/api/add-device-profiles", { userIds });
  } catch (err) {
    console.error("Failed to add device profiles:", err);
  }
};

export const fetchDeviceDetails = async (setDeviceDetails) => {
  try {
    const { data } = await apiClient.get("/api/device-details");
    if (data.success && data.deviceDetails) {
      setDeviceDetails(data.deviceDetails);
    }
    return data.deviceDetails;
  } catch (err) {
    console.error("Failed to fetch device details:", err);
  }
};
