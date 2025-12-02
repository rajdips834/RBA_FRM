// utils/deviceData.js
import axios from "axios";
import { nanoid } from "nanoid"; // Ensure nanoid is imported

const getDeviceType = () => {
  const ua = navigator.userAgent;

  if (/Android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";

  // iPadOS (Safari on iPad pretends to be Mac)
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return "ios";
  }

  return "web";
};


const getOS = () => {
  const ua = navigator.userAgent;
  let os = "Unknown";

  if (/Windows NT 10.0/i.test(ua)) os = "Windows 10";
  else if (/Windows NT 11.0/i.test(ua))
    os = "Windows 11"; // unofficial, since UA often doesn't reflect 11
  else if (/Windows NT 6.3/i.test(ua)) os = "Windows 8.1";
  else if (/Windows NT 6.2/i.test(ua)) os = "Windows 8";
  else if (/Windows NT 6.1/i.test(ua)) os = "Windows 7";
  else if (/Mac OS X (\d+[\._]\d+)/i.test(ua)) {
    const match = ua.match(/Mac OS X (\d+[\._]\d+)/i);
    os = `macOS ${match[1].replace("_", ".")}`;
  } else if (/Android (\d+[\.\d]+)/i.test(ua)) {
    const match = ua.match(/Android (\d+[\.\d]+)/i);
    os = `Android ${match[1]}`;
  } else if (/iPhone OS (\d+[_\d]*)/i.test(ua)) {
    const match = ua.match(/iPhone OS (\d+[_\d]*)/i);
    os = `iOS ${match[1].replace(/_/g, ".")}`;
  } else if (/Linux/i.test(ua)) os = "Linux";

  return os;
};

const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let version = "Unknown";

  if (/OPR\/(\d+\.\d+\.\d+\.\d+)/i.test(ua)) {
    browser = "Opera";
    version = ua.match(/OPR\/(\d+\.\d+\.\d+\.\d+)/i)[1];
  } else if (/Edg\/(\d+\.\d+\.\d+\.\d+)/i.test(ua)) {
    browser = "Edge (Chromium)";
    version = ua.match(/Edg\/(\d+\.\d+\.\d+\.\d+)/i)[1];
  } else if (/Chrome\/(\d+\.\d+\.\d+\.\d+)/i.test(ua) && !/OPR|Edg/i.test(ua)) {
    // Possible Brave or Chrome
    const isBrave =
      navigator.brave && typeof navigator.brave.isBrave === "function";
    browser = isBrave ? "Brave" : "Chrome";
    version = ua.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/i)[1];
  } else if (/Firefox\/(\d+\.\d+)/i.test(ua)) {
    browser = "Firefox";
    version = ua.match(/Firefox\/(\d+\.\d+)/i)[1];
  } else if (
    /Version\/(\d+\.\d+).*Safari/i.test(ua) &&
    !/Chrome|Edg|OPR/i.test(ua)
  ) {
    browser = "Safari";
    version = ua.match(/Version\/(\d+\.\d+)/i)[1];
  }

  return `${browser} ${version}`;
};

const getDeviceId = () => {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = "d3f1c2e4a5b6c7d8e9f0a1b2c3d4e5f6"; // Generate new if not present
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
};

export const getDeviceData = async () => {
  const data = {
    device_type: getDeviceType(),
    operating_system_and_version: getOS(),
    browser_version: getBrowserInfo(),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    ip_address: "129.48.218.104",
    isp_name: "Bharti Airtel Ltd., Telemedia Services",
    network_type: "4g",
  };

  try {
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    data.ip_address = ipResponse.data.ip;
  } catch (error) {
    console.error("Could not fetch IP address:", error);
    data.ip_address = "129.48.218.104";
  }

  return data;
};

export { getDeviceId };
