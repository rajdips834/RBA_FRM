import React from "react";
import Panel from "./core/Panel";
import Select from "./core/Select";
import Input from "./core/Input";
import {
  generateRandomDevice,
  getRandomOS,
  getRandomBrowser,
  getRandomResolution,
} from "../utils/deviceRandomizer";

const DeviceConfigPanel = ({ configData, onConfigChange }) => {
  const deviceTypes = [
    { label: "Browser", value: "browser" },
    { label: "Android", value: "android" },
    { label: "iOS", value: "ios" },
  ];
  const profileCountOptions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1} ${i === 0 ? "Profile" : "Profiles"}`,
    value: i + 1,
  }));
  const handleProfileCountChange = (e) => {
    const count = parseInt(e.target.value, 10);
    const currentProfiles = [...configData.profiles];

    // Add or remove profiles as needed
    if (count > currentProfiles.length) {
      while (currentProfiles.length < count) {
        let profileToPush = generateRandomDevice();
        profileToPush.device_id = "d3f1c2e4a5b6c7d8e9f0a1b2c3d4e5f6";
        currentProfiles.push(profileToPush);
      }
    } else if (count < currentProfiles.length) {
      currentProfiles.splice(count);
    }

    onConfigChange({ ...configData, profiles: currentProfiles });
  };
  const updateProfile = (index, updates) => {
    const updatedProfiles = configData.profiles.map((profile, i) =>
      i === index ? { ...profile, ...updates } : profile
    );
    onConfigChange({ ...configData, profiles: updatedProfiles });
  };
  const handleRandomizeAll = () => {
    // Shuffle device types
    const shuffledTypes = [...deviceTypes]
      .map((dt) => dt.value)
      .sort(() => Math.random() - 0.5);
    // Assign a different device type to each profile, cycling if needed
    const newProfiles = configData.profiles.map((profile, idx) => {
      const deviceType = shuffledTypes[idx % shuffledTypes.length];
      return generateRandomDevice(deviceType);
    });
    onConfigChange({ ...configData, profiles: newProfiles });
  };

  return (
    <Panel title="Device Configuration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-48">
            <Select
              label="Number of Device Profiles"
              value={configData.profiles.length}
              onChange={handleProfileCountChange}
              options={profileCountOptions}
            />
          </div>
          <button
            onClick={handleRandomizeAll}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
          >
            Randomize All
          </button>
        </div>{" "}
        <div className="space-y-6">
          {configData.profiles.map((profile, index) => (
            <div
              key={index}
              className="p-4 bg-slate-700/50 rounded-lg space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-200">
                  Device Profile {index + 1}
                </h3>
                <Select
                  value={profile.device_type}
                  onChange={(e) =>
                    updateProfile(index, {
                      device_type: e.target.value,
                      operating_system_and_version: getRandomOS(e.target.value),
                      browser_version: getRandomBrowser(e.target.value),
                      screen_resolution: getRandomResolution(e.target.value),
                    })
                  }
                  options={deviceTypes}
                  className="w-32"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Device ID"
                  value={profile.device_id}
                  onChange={(e) =>
                    updateProfile(index, { device_id: e.target.value })
                  }
                />
                <Input
                  label="IP Address"
                  value={profile.ip_address}
                  onChange={(e) =>
                    updateProfile(index, { ip_address: e.target.value })
                  }
                />
                <Input
                  label="Operating System"
                  value={profile.operating_system_and_version}
                  onChange={(e) =>
                    updateProfile(index, {
                      operating_system_and_version: e.target.value,
                    })
                  }
                />
                <Input
                  label="Browser Version"
                  value={profile.browser_version}
                  onChange={(e) =>
                    updateProfile(index, { browser_version: e.target.value })
                  }
                />
                <Input
                  label="Screen Resolution"
                  value={profile.screen_resolution}
                  onChange={(e) =>
                    updateProfile(index, { screen_resolution: e.target.value })
                  }
                />
                <Input
                  label="ISP Name"
                  value={profile.isp_name}
                  onChange={(e) =>
                    updateProfile(index, { isp_name: e.target.value })
                  }
                />
                <Input
                  label="Network Type"
                  value={profile.network_type}
                  onChange={(e) =>
                    updateProfile(index, { network_type: e.target.value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
};

export default DeviceConfigPanel;
