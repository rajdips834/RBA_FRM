import { getCoordinatesFromCity } from "../geoUtils";
import { getISODateTime, formatToCustomDateTime } from "../dateUtils";

function generateRandomLoginTime(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateRandomLoginTimestamp(min, max) {
  if (!min || !max) {
    return getISODateTime();
  }
  if (min == max) return min;
  const minDate = new Date(min);
  const maxDate = new Date(max);
  if (isNaN(minDate) || isNaN(maxDate) || minDate >= maxDate) {
    return getISODateTime();
  }
  const randomTime =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  const randomDate = new Date(randomTime);
  return formatToCustomDateTime(randomDate);
}

const EXCLUDED_FIELDS = [
  "time_taken_to_complete_login_min",
  "time_taken_to_complete_login_max",
  "timestamp_start",
  "timestamp_end",
];

export const buildLoginPayload = async (
  deviceData,
  loginData,
  userId,
  isMultiRequest = false,
  isFraud = false
) => {
  // console.log("Building login payload with deviceData:", deviceData);
  //   console.log("Building login payload with loginData:", loginData);
  const coordinates = await getCoordinatesFromCity(loginData.city);
  let time_taken = loginData.time_taken_to_complete_login || 5;
  let timestamp = loginData.timestamp || getISODateTime();
  if (isMultiRequest && !isFraud) {
    time_taken = generateRandomLoginTime(
      loginData.time_taken_to_complete_login_min,
      loginData.time_taken_to_complete_login_max
    );
    timestamp = generateRandomLoginTimestamp(
      loginData.timestamp_start,
      loginData.timestamp_end
    );
  }

  const initialData = {
    device_id: deviceData.device_id,
    device_fingerprint: deviceData.device_fingerprint,
    device_type: deviceData.device_type,
    operating_system_and_version: deviceData.operating_system_and_version,
    carrier_name: deviceData.carrier_name,
    network_type: deviceData.network_type,
    ip_address: deviceData.ip_address,
    screen_resolution: deviceData.screen_resolution,
    device_language: deviceData.device_language || "en-US",
    os_release: Number(deviceData.os_release) || 0,
    latitude: Number(coordinates.latitude),
    longitude: Number(coordinates.longitude),
    city: loginData.city || "Unknown",
    country: loginData.country || "Unknown",
    timestamp: timestamp,
    time_taken_to_complete_login: Number(time_taken),
    time_zone: loginData.time_zone,
    vpn_check: Number(loginData.vpn_check) || 0,
  };

  if (deviceData.device_type === "web") {
    initialData.browser_name_and_version = deviceData.browser_name_and_version;
  }
  if (
    deviceData.device_type === "android" ||
    deviceData.device_type === "ios"
  ) {
    initialData.device_model = deviceData.device_model || "Unknown";
    initialData.device_manufacturer = deviceData.device_manufacturer || "";
    initialData.device_brand = deviceData.device_brand || "";
    initialData.device_hardware = deviceData.device_hardware || "";
    initialData.os_sdk = Number(deviceData.os_sdk) || 0;
    initialData.os_security_patch = deviceData.os_security_patch || "";
    initialData.battery_level = Number(deviceData.battery_level) || 0;
    initialData.app_package = deviceData.app_package || "";
    initialData.app_version = deviceData.app_version || "";
    initialData.inclination = deviceData.inclination || "";
    initialData.deviceVelocity = deviceData.deviceVelocity || "";
    initialData.gravity = deviceData.gravity || "";
    initialData.magneticField = deviceData.magneticField || "";
    initialData.gyroscope = deviceData.gyroscope || "";
    initialData.hardware_biometric_support =
      Number(deviceData.hardware_biometric_support) || 0;
    initialData.is_emulator = Number(deviceData.is_emulator) || 0;
  }
  if (deviceData.device_type === "android") {
    initialData.is_rooted = Number(deviceData.is_rooted) || 0;
    initialData.security_adb_enabled =
      Number(deviceData.security_adb_enabled) || 0;
    initialData.security_dev_mode = Number(deviceData.security_dev_mode) || 0;
    initialData.app_install_time = deviceData.app_install_time || "";
    initialData.app_update_time = deviceData.app_update_time || "";
  }
  if (deviceData.device_type === "ios") {
    initialData.is_jailbroken = Number(deviceData.is_jailbroken) || 0;
  }

  if (isMultiRequest) {
    EXCLUDED_FIELDS.forEach((field) => delete initialData[field]);
  }
  return {
    deviceDetails: initialData,
    userDetails: {
      user_id: userId,
    },
    secret: import.meta.env.VITE_AXIOM_SECRET,
  };
};

export const buildTempLoginPayload = async (multiLoginData) => {
  //   console.log("Building login payload with loginData:", loginData);
  const initialData = {
    city: multiLoginData.city || "Unknown",
    country: multiLoginData.country || "Unknown",
    time_taken_to_complete_login_min:
      multiLoginData.time_taken_to_complete_login_min,
    time_taken_to_complete_login_max:
      multiLoginData.time_taken_to_complete_login_max,
    timestamp_start: multiLoginData.timestamp_start || getISODateTime(),
    timestamp_end: multiLoginData.timestamp_end || getISODateTime(),
    time_zone: multiLoginData.time_zone,
    vpn_check: multiLoginData.vpn_check || "0",
  };
  // console.log("Building temporary login payload with data:", initialData);
  return {
    data: initialData,
  };
};
