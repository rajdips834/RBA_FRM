/******* Device Details Generator Script *******/
import axios from "axios";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  generateRandomDevice
} from "./deviceRandomizer.js";

dotenv.config();

const getAllUsers = async (token) => {
  const requestTime = new Date().toISOString().replace("T", " ").split(".")[0];
  const axiomUrl = process.env.AXIOM_URL;
  const accountId = process.env.ACCOUNT_ID;
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

const getJWTToken = async (userId) => {
  const requestTime = new Date().toISOString().replace("T", " ").split(".")[0];
  const axiomUrl = process.env.AXIOM_URL;
  const accountId = process.env.ACCOUNT_ID;
  const url = `${axiomUrl}/adaptivetoken/getJWTToken?accountId=${accountId}&requestTime=${encodeURIComponent(
    requestTime
  )}&userId=${userId}`;
  const { data } = await axios.post(url);
  return data.resultData;
};

const main = async () => {
  const userId = process.env.JWT_USER_ID;
  const token = await getJWTToken(userId);
  const users = await getAllUsers(token);
  const deviceDetails = {};
  for (const user of users) {
    // Always assign three device profiles: android, ios, web (in order)
    const deviceTypes = ["android", "ios", "web"];
    deviceDetails[user] = deviceTypes.map((type) => generateRandomDevice(type));
  }
  const outPath = path.join(
    process.cwd(),
    "../backend/device_data/device_details.json"
  );
  fs.writeFileSync(outPath, JSON.stringify(deviceDetails, null, 2));
  console.log(`Device details written to ${outPath}`);
};

main().catch((err) => {
  console.error("Error generating device details:", err);
});
