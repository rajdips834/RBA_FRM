import fs from "fs";
import path from "path";
import { logger } from "../utils/logger.js";
import {
  generateRandomDevice
} from "../utils/deviceRandomizer.js";

export const deviceDetailsHandler = (req, res) => {
  const filePath = path.join(
    process.cwd(),
    "device_data",
    "device_details.json"
  );
//   console.log("Reading device details from:", filePath);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      logger.logRequest(
        { url: "/api/device-details" },
        { message: err.message },
        true
      );
      return res
        .status(500)
        .json({ success: false, error: "Failed to load device details" });
    }
    try {
      const deviceDetails = JSON.parse(data);
      res.json({ success: true, deviceDetails });
    } catch (parseErr) {
      logger.logRequest(
        { url: "/api/device-details" },
        { message: parseErr.message },
        true
      );
      res
        .status(500)
        .json({ success: false, error: "Invalid device details format" });
    }
  });
};


export const addDeviceProfilesHandler = (req, res) => {
  const { userIds } = req.body;
  console.log("Adding device profiles for users:", userIds);
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "userIds array required" });
  }
  const filePath = path.join(
    process.cwd(),
    "device_data",
    "device_details.json"
  );
  fs.readFile(filePath, "utf8", (err, data) => {
    let deviceDetails = {};
    if (!err && data) {
      try {
        deviceDetails = JSON.parse(data);
      } catch (parseErr) {
        // If file is corrupt, start fresh
        deviceDetails = {};
      }
    }
    for (const userId of userIds) {
      const deviceTypes = ["android", "ios", "web"];
    deviceDetails[userId] = deviceTypes.map((type) => generateRandomDevice(type));
    }
    fs.writeFile(
      filePath,
      JSON.stringify(deviceDetails, null, 2),
      (writeErr) => {
        if (writeErr) {
          return res
            .status(500)
            .json({ success: false, error: "Failed to update device details" });
        }
        res.json({ success: true, message: "Device profiles added", userIds });
      }
    );
  });
};
