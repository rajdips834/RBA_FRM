import { useState } from "react";

const useHeaderAndPayload = () => {
  const [headers, setHeaders] = useState([]); // State for custom headers
  const [customPayload, setCustomPayload] = useState([]); // State for custom payload as an array of objects

  const transformHeaders = () => {
    return headers.reduce((acc, { key, value }) => {
      if (key.trim() !== "") acc[key] = value;
      return acc;
    }, {});
  };

  const transformPayload = () => {
    return customPayload.reduce((acc, { key, value, type }) => {
      if (key.trim() !== "") {
        if (type === "number" && value !== "") {
          acc[key] = Number(value);
        } else if (type === "boolean") {
          acc[key] = value === "true";
        } else {
          acc[key] = value;
        }
      }
      return acc;
    }, {});
  };

  return {
    headers,
    setHeaders,
    customPayload,
    setCustomPayload,
    transformHeaders,
    transformPayload,
  };
};

export default useHeaderAndPayload;
