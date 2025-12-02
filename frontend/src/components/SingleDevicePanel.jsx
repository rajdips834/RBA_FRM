import React, { useEffect, useContext, useState } from "react";
import Panel from "./core/Panel";
import Select from "./core/Select";
import Input from "./core/Input";
import {
  getRandomOS,
  getRandomBrowser,
  getRandomResolution,
  getRandomDeviceModel,
  generateRandomDevice,
} from "../utils/deviceRandomizer";
import { GlobalContext } from "../context/GlobalContext";
import { convertDeviceType } from "../utils/urlUtils";
import { addDeviceProfiles, fetchDeviceDetails } from "../utils/deviceDetails";

const deviceTypes = [
  { label: "Web", value: "web" },
  { label: "Android", value: "android" },
  { label: "iOS", value: "ios" },
];

const SingleDevicePanel = ({
  deviceType,
  deviceData,
  setDeviceData,
  userId,
}) => {
  const { deviceDetails, setDeviceDetails, users } = useContext(GlobalContext);
  useEffect(() => {
    const fetchData = async () => {
      const hasDeviceDetails =
        deviceDetails && Object.keys(deviceDetails).length > 0;

      // Check if users have been loaded and userId is in the valid users pool
      const isValidUser = users && users.length > 0 && users.includes(userId);

      if (hasDeviceDetails) {
        console.log("Device Details for user:", deviceDetails[userId]);
        if (!deviceDetails[userId]) {
          if (isValidUser) {
            console.log(
              "User not found in device details but is valid, adding..."
            );
            await addDeviceProfiles([userId]);
            let data = await fetchDeviceDetails(setDeviceDetails);
            setDeviceData(data);
          }
        } else {
          setDeviceData({
            ...deviceDetails[userId][convertDeviceType(deviceType) - 1],
          });
        }
      } else if (users && users.length > 0) {
        // Device details not loaded yet, but we can check if user is valid
        if (isValidUser) {
          console.log("User is valid but device details are not loaded");
        }
      } else {
        console.log("Device details and users not loaded yet");
      }
    };

    fetchData();
  }, [deviceType, userId]);

  const handleFillFields = () => {
    const type = deviceData.device_type || deviceTypes[0].value;
    setDeviceData(generateRandomDevice(deviceType || type));
  };

  const handleChange = (e) => {
    setDeviceData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [showMore, setShowMore] = useState(false);

  // List all input/select fields as React elements
  const allFields = [
    <Input
      label="Device ID"
      name="device_id"
      value={deviceData.device_id || ""}
      onChange={handleChange}
      key="device_id"
    />,
    <Input
      label="Device Fingerprint"
      name="device_fingerprint"
      value={deviceData.device_fingerprint || ""}
      onChange={handleChange}
      key="device_fingerprint"
    />,
    <Input
      label="IP Address"
      name="ip_address"
      value={deviceData.ip_address || ""}
      onChange={handleChange}
      key="ip_address"
    />,
    <Input
      label="Operating System"
      name="operating_system_and_version"
      value={deviceData.operating_system_and_version || ""}
      onChange={handleChange}
      key="operating_system_and_version"
    />,
    deviceType === "web" && (
      <Input
        label="Browser Name"
        name="browser_name_and_version"
        value={deviceData.browser_name_and_version || ""}
        onChange={handleChange}
        key="browser_name_and_version"
      />
    ),
    <Input
      label="Screen Resolution"
      name="screen_resolution"
      value={deviceData.screen_resolution || ""}
      onChange={handleChange}
      key="screen_resolution"
    />,
    <Input
      label="Carrier Name"
      name="carrier_name"
      value={deviceData.carrier_name || ""}
      onChange={handleChange}
      key="carrier_name"
    />,
    <Input
      label="Network Type"
      name="network_type"
      value={deviceData.network_type || ""}
      onChange={handleChange}
      key="network_type"
    />,
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Model"
        name="device_model"
        value={deviceData.device_model || ""}
        onChange={handleChange}
        key="device_model"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Manufacturer"
        name="device_manufacturer"
        value={deviceData.device_manufacturer || ""}
        onChange={handleChange}
        key="device_manufacturer"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Brand"
        name="device_brand"
        value={deviceData.device_brand || ""}
        onChange={handleChange}
        key="device_brand"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Hardware"
        name="device_hardware"
        value={deviceData.device_hardware || ""}
        onChange={handleChange}
        key="device_hardware"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="OS SDK"
        name="os_sdk"
        value={deviceData.os_sdk || ""}
        onChange={handleChange}
        key="os_sdk"
      />
    ),

    <Input
      label="OS Release"
      name="os_release"
      value={deviceData.os_release || ""}
      onChange={handleChange}
      key="os_release"
    />,
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="OS Security Patch"
        name="os_security_patch"
        value={deviceData.os_security_patch || ""}
        onChange={handleChange}
        key="os_security_patch"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Battery Level"
        name="battery_level"
        value={deviceData.battery_level || ""}
        onChange={handleChange}
        key="battery_level"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="App Package"
        name="app_package"
        value={deviceData.app_package || ""}
        onChange={handleChange}
        key="app_package"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="App Version"
        name="app_version"
        value={deviceData.app_version || ""}
        onChange={handleChange}
        key="app_version"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Inclination"
        name="inclination"
        value={deviceData.inclination || ""}
        onChange={handleChange}
        key="inclination"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Velocity"
        name="deviceVelocity"
        value={deviceData.deviceVelocity || ""}
        onChange={handleChange}
        key="deviceVelocity"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Gravity"
        name="gravity"
        value={deviceData.gravity || ""}
        onChange={handleChange}
        key="gravity"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Magnetic Field"
        name="magneticField"
        value={deviceData.magneticField || ""}
        onChange={handleChange}
        key="magneticField"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Gyroscope"
        name="gyroscope"
        value={deviceData.gyroscope || ""}
        onChange={handleChange}
        key="gyroscope"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Input
        label="Device Language"
        name="device_language"
        value={deviceData.device_language || ""}
        onChange={handleChange}
        key="device_language"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Select
        label="Hardware Biometric Support"
        name="hardware_biometric_support"
        value={deviceData.hardware_biometric_support || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="hardware_biometric_support"
      />
    ),
    (deviceType == "android" || deviceType == "ios") && (
      <Select
        label="Is Emulator"
        name="is_emulator"
        value={deviceData.is_emulator || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="is_emulator"
      />
    ),
    deviceType == "android" && (
      <Select
        label="Is Rooted"
        name="is_rooted"
        value={deviceData.is_rooted || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="is_rooted"
      />
    ),
    deviceType == "android" && (
      <Select
        label="Security ADB Enabled"
        name="security_adb_enabled"
        value={deviceData.security_adb_enabled || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="security_adb_enabled"
      />
    ),
    deviceType == "android" && (
      <Select
        label="Security Dev Mode"
        name="security_dev_mode"
        value={deviceData.security_dev_mode || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="security_dev_mode"
      />
    ),
    deviceType == "android" && (
      <Input
        label="App Install Time"
        name="app_install_time"
        value={deviceData.app_install_time || ""}
        onChange={handleChange}
        key="app_install_time"
      />
    ),
    deviceType == "android" && (
      <Input
        label="App Update Time"
        name="app_update_time"
        value={deviceData.app_update_time || ""}
        onChange={handleChange}
        key="app_update_time"
      />
    ),
    deviceType == "ios" && (
      <Select
        label="Is Jailbroken"
        name="is_jailbroken"
        value={deviceData.is_jailbroken || ""}
        onChange={handleChange}
        options={[
          { label: "Yes", value: "1" },
          { label: "No", value: "0" },
        ]}
        className="w-full"
        key="is_jailbroken"
      />
    ),
  ].filter(Boolean);

  const visibleFields = showMore ? allFields : allFields.slice(0, 8);

  return (
    <Panel title="Device Configuration">
      <div className="p-4 bg-slate-700/50 rounded-lg space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-200">
            Device Details
          </h3>
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={handleFillFields}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors text-sm font-semibold"
            >
              Fill Fields
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFields}
        </div>
        {allFields.length > 8 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              className="px-4 py-2 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 text-sm font-semibold"
              onClick={() => setShowMore((v) => !v)}
            >
              {showMore
                ? "Show Less"
                : `Show More (${allFields.length - 8} more)`}
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default SingleDevicePanel;
