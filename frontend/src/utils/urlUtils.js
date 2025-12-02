// Utility to parse a URL into base and query parameters
export const parseQueryParams = (url) => {
  try {
    const [baseUrl, queryString] = url.split("?");
    const params = new URLSearchParams(queryString);
    const paramObj = {};
    for (const [key, value] of params.entries()) {
      paramObj[key] = value;
    }
    return { baseUrl, params: paramObj };
  } catch {
    return { baseUrl: url, params: {} };
  }
};

// Utility to reconstruct a URL from base and param object
export const reconstructUrl = (baseUrl, paramObj) => {
  const query = new URLSearchParams(paramObj).toString();
  return `${baseUrl}?${query}`;
};

// Utility to format date-time into requestTime format
export const formatRequestTime = (date = new Date()) => {
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const convertDeviceType = (device_type) => {
  switch (device_type.toLowerCase()) {
    case "web":
      return 3;
    case "ios":
      return 2;
    case "android":
      return 1;
    default:
      return 3;
  }
}