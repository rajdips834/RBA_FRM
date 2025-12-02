import express from "express";
import { logger } from "../utils/logger.js";
import { sendRequestHandler } from "../controllers/sendRequestController.js";
import {
  deviceDetailsHandler,
  addDeviceProfilesHandler,
} from "../controllers/deviceDetailsController.js";


const router = express.Router();

// POST /api/send-request
router.post("/send-request", sendRequestHandler);

// POST /api/clear-logs
router.post("/clear-logs", (req, res) => {
  logger.clearLogs();
  res.json({ success: true, message: "Logs cleared" });
});

// GET /api/logs
router.get("/logs", (req, res) => {
  res.json(logger.getLogs());
});

// GET /api/device-details
router.get("/device-details", deviceDetailsHandler);

// POST /api/add-device-profiles
router.post("/add-device-profiles", addDeviceProfilesHandler);

export default router;
