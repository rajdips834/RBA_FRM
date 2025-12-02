// Randomizer for device_hardware
const hardwareOptions = [
  "qcom",
  "exynos",
  "kirin",
  "apple",
  "mediatek",
  "unisoc",
];
const getRandomDeviceHardware = () =>
  hardwareOptions[Math.floor(Math.random() * hardwareOptions.length)];

// Randomizer for os_sdk (Android SDK versions 21-35)
const getRandomOsSdk = () => Math.floor(Math.random() * (35 - 21 + 1)) + 21;

// Randomizer for os_release (Android/iOS major versions 10-17)
const getRandomOsRelease = () => Math.floor(Math.random() * (17 - 10 + 1)) + 10;

// Randomizer for os_security_patch (YYYY-MM-DD, last 2 years)
const getRandomOsSecurityPatch = () => {
  const year = 2024 + Math.floor(Math.random() * 2); // 2024 or 2025
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Randomizer for battery_level (0-100)
const getRandomBatteryLevel = () => Math.floor(Math.random() * 101);

// Randomizer for app_package (pick from list)
const appPackages = [
  "com.bluebricks.rbasampleapp",
  "com.example.app",
  "com.test.app",
  "com.demo.rba",
];
const getRandomAppPackage = () =>
  appPackages[Math.floor(Math.random() * appPackages.length)];

// Randomizer for app_version (1.0-3.5)
const getRandomAppVersion = () => (Math.random() * 2.5 + 1).toFixed(1);

// Device model mapping for manufacturer and brand
const deviceModelInfo = {
  "Pixel 7": { manufacturer: "Google", brand: "Pixel" },
  "Samsung Galaxy S23": { manufacturer: "Samsung", brand: "Galaxy" },
  "OnePlus 11": { manufacturer: "OnePlus", brand: "OnePlus" },
  "Xiaomi Mi 13": { manufacturer: "Xiaomi", brand: "Mi" },
  "iPhone 14": { manufacturer: "Apple", brand: "iPhone" },
  "iPhone 13 Pro": { manufacturer: "Apple", brand: "iPhone" },
  "iPad Pro": { manufacturer: "Apple", brand: "iPad" },
  "iPhone SE": { manufacturer: "Apple", brand: "iPhone" },
  Macintosh: { manufacturer: "Apple", brand: "Macintosh" },
  "Windows PC": { manufacturer: "Microsoft", brand: "Windows" },
  Chromebook: { manufacturer: "Google", brand: "Chromebook" },
  "Linux Desktop": { manufacturer: "Linux", brand: "Linux" },
};

const getDeviceManufacturer = (model) =>
  deviceModelInfo[model]?.manufacturer || "vivo";
const getDeviceBrand = (model) => deviceModelInfo[model]?.brand || "iQOO";

const getRandomInclination = () => {
  // 3 floats between -1 and 10
  const arr = Array.from({ length: 3 }, () =>
    (Math.random() * 10 - 1).toFixed(8)
  );
  return `[${arr.join(", ")}]`;
};
const getRandomDeviceVelocity = () => {
  // 3 floats between -5 and 5
  const arr = Array.from({ length: 3 }, () =>
    (Math.random() * 10 - 5).toFixed(8)
  );
  return `[${arr.join(", ")}]`;
};
const getRandomGravity = () => {
  // 3 floats between -1 and 10
  const arr = Array.from({ length: 3 }, () =>
    (Math.random() * 10 - 1).toFixed(8)
  );
  return `[${arr.join(", ")}]`;
};
const getRandomMagneticField = () => {
  // 3 floats between -50 and 50
  const arr = Array.from({ length: 3 }, () =>
    (Math.random() * 100 - 50).toFixed(8)
  );
  return `[${arr.join(", ")}]`;
};
const getRandomGyroscope = () => {
  // 3 floats between -0.01 and 0.01
  const arr = Array.from({ length: 3 }, () =>
    (Math.random() * 0.02 - 0.01).toExponential(8)
  );
  return `[${arr.join(", ")}]`;
};
// Randomizer for app install/update times (simulate a recent timestamp)
const getRandomAppTimestamp = () => {
  // Use a timestamp in the near future for demo
  const now = Date.now();
  // Random offset up to 7 days
  const offset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
  return String(now + offset);
};

export const getRandomBoolean = (threshold) => {
  return Math.random() < threshold ? "1" : "0";
};

const deviceLanguages = ["en-US", "hi-IN", "fr-FR", "es-ES", "zh-CN", "de-DE"];

export const getRandomDeviceLanguage = () => {
  return deviceLanguages[Math.floor(Math.random() * deviceLanguages.length)];
};

const androidOSVersions = ["Android 13", "Android 12", "Android 11"];

const iosOSVersions = ["iOS 16.5", "iOS 16.4", "iOS 15.7"];

const webOSVersions = [
  "Windows 11",
  "Windows 10",
  "macOS 13.4",
  "macOS 12.6",
  "Ubuntu 22.04",
  "Ubuntu 20.04",
];

const browserVersionMap = {
  android: [
    { name: "Chrome", versions: ["137.0.0.0", "136.0.0.0"] },
    { name: "Firefox", versions: ["114.0", "113.0"] },
  ],
  ios: [
    { name: "Safari", versions: ["16.5", "16.4", "15.7"] },
    { name: "Chrome", versions: ["137.0.0.0", "136.0.0.0"] }, // Chrome on iOS uses Safari engine
  ],
  web: [
    { name: "Chrome", versions: ["137.0.0.0", "136.0.0.0"] },
    { name: "Firefox", versions: ["114.0", "113.0"] },
    { name: "Safari", versions: ["16.5"] }, // Only for macOS
    { name: "Edge", versions: ["114.0.1823.43", "113.0.1774.57"] },
  ],
};

const screenResolutions = {
  android: ["1080x1920"],
  ios: ["1170x2532"],
  web: ["1920x1080"],
};

const ispNames = [
  "Bharti Airtel Ltd., Telemedia Services",
  "Reliance Jio Infocomm Ltd.",
  "Vodafone Idea Ltd.",
  "BSNL Broadband",
  "Hathway Cable & Datacom Ltd.",
  "ACT Fibernet",
];

const networkTypes = ["4G", "5G", "Wi-Fi", "Ethernet"];

const deviceModels = {
  web: ["Macintosh", "Windows PC", "Chromebook", "Linux Desktop"],
  android: ["Pixel 7", "Samsung Galaxy S23", "OnePlus 11", "Xiaomi Mi 13"],
  ios: ["iPhone 14", "iPhone 13 Pro", "iPad Pro", "iPhone SE"],
};

export const generateRandomIP = () => {
  // Generate a random public IP address (avoiding private IP ranges)
  const firstOctet = Math.floor(Math.random() * (223 - 1 + 1)) + 1;
  const secondOctet = Math.floor(Math.random() * 256);
  const thirdOctet = Math.floor(Math.random() * 256);
  const fourthOctet = Math.floor(Math.random() * 256);
  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
};

export const generateRandomDeviceId = () => {
  // Generate a 32-character hexadecimal string (like: e3c00fd833a242a91e0eaf232d7fe7b2)
  const hex = "0123456789abcdef";
  let deviceId = "";
  for (let i = 0; i < 32; i++) {
    deviceId += hex[Math.floor(Math.random() * 16)];
  }
  return deviceId;
};

export const getRandomISP = () => {
  return ispNames[Math.floor(Math.random() * ispNames.length)];
};

export const getRandomNetworkType = () => {
  return networkTypes[Math.floor(Math.random() * networkTypes.length)];
};

export const getRandomOS = (deviceType) => {
  const osVersions = {
    android: androidOSVersions,
    ios: iosOSVersions,
    web: webOSVersions,
  };
  const versions = osVersions[deviceType] || webOSVersions;
  return versions[Math.floor(Math.random() * versions.length)];
};

export const getRandomResolution = (deviceType) => {
  const resolutions = screenResolutions[deviceType] || screenResolutions.web;
  return resolutions[Math.floor(Math.random() * resolutions.length)];
};

export const getRandomBrowser = (deviceType, osVersion) => {
  const browserList = browserVersionMap[deviceType] || browserVersionMap.web;
  let filteredBrowsers = browserList;
  // For web type, filter Safari only for macOS
  if (
    deviceType === "web" &&
    osVersion &&
    !osVersion.toLowerCase().includes("macos")
  ) {
    filteredBrowsers = browserList.filter((b) => b.name !== "Safari");
  }
  // For ios, only Safari and Chrome (which is Safari engine)
  // For android, only Chrome and Firefox
  const browser =
    filteredBrowsers[Math.floor(Math.random() * filteredBrowsers.length)];
  const version =
    browser.versions[Math.floor(Math.random() * browser.versions.length)];
  return `${browser.name} ${version}`;
};

export const getRandomDeviceModel = (deviceType) => {
  const models = deviceModels[deviceType] || deviceModels.web;
  return models[Math.floor(Math.random() * models.length)];
};

export const generateRandomDevice = (deviceType = "web") => {
  const osVersion = getRandomOS(deviceType);
  const base = {
    device_id: generateRandomDeviceId(),
    device_fingerprint: generateRandomDeviceId(),
    device_type: deviceType,
    ip_address: generateRandomIP(),
    operating_system_and_version: osVersion,
    browser_name_and_version: getRandomBrowser(deviceType, osVersion),
    screen_resolution: getRandomResolution(deviceType),
    isp_name: getRandomISP(),
    carrier_name: getRandomISP(),
    network_type: getRandomNetworkType(),
    device_language: getRandomDeviceLanguage(),
    os_release: getRandomOsRelease(),
  };
  if (deviceType === "web") {
    base.browser_name_and_version = getRandomBrowser(deviceType, osVersion);
  }
  if (deviceType === "android" || deviceType === "ios") {
    base.hardware_biometric_support = getRandomBoolean(0.7);
    base.is_emulator = getRandomBoolean(0.1);
    base.device_model = getRandomDeviceModel(deviceType);
    base.device_manufacturer = getDeviceManufacturer(base.device_model);
    base.device_brand = getDeviceBrand(base.device_model);
    base.device_hardware = getRandomDeviceHardware();
    base.os_sdk = getRandomOsSdk();
    base.os_security_patch = getRandomOsSecurityPatch();
    base.battery_level = getRandomBatteryLevel();
    base.app_package = getRandomAppPackage();
    base.app_version = getRandomAppVersion();
    base.inclination = getRandomInclination();
    base.deviceVelocity = getRandomDeviceVelocity();
    base.gravity = getRandomGravity();
    base.magneticField = getRandomMagneticField();
    base.gyroscope = getRandomGyroscope();
  }
  if (deviceType === "android") {
    base.is_rooted = getRandomBoolean(0.2);
    base.security_adb_enabled = getRandomBoolean(0.5);
    base.security_dev_mode = getRandomBoolean(0.5);
    base.app_install_time = getRandomAppTimestamp();
    base.app_update_time = getRandomAppTimestamp();
  }
  if (deviceType === "ios") {
    base.is_jailbroken = getRandomBoolean(0.15);
  }
  return base;
};
