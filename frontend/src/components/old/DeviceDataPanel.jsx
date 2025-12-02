// DeviceDataPanel.jsx
import React, { useState, useEffect } from "react";
import { Smartphone, Monitor, Globe, Maximize, Chrome } from "lucide-react";
import { getDeviceData, getDeviceId } from "../../utils/deviceDataUtils";

const DataRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="flex items-center gap-2 text-slate-400">
      {icon}
      {label}
    </span>
    <span className="font-mono text-slate-200">{value}</span>
  </div>
);

const DeviceDataPanel = ({ onDataFetched, initialData }) => {
  const [deviceData, setDeviceData] = useState(
    initialData || {
      device_id: getDeviceId(),
      device_type: "N/A",
      operating_system_and_version: "N/A",
      browser_version: "N/A",
      ip_address: "N/A",
      screen_resolution: "N/A",
    }
  );

  useEffect(() => {
    if (initialData) {
      setDeviceData(initialData);
      onDataFetched(initialData);
    } else {
      const fetchAndSetData = async () => {
        const data = await getDeviceData();
        data.device_id = getDeviceId();
        setDeviceData(data);
        onDataFetched(data);
      };
      fetchAndSetData();
    }
  }, [initialData, onDataFetched]);

  return (
    <div className="bg-slate-800/50 p-4 rounded-xl shadow-lg ring-1 ring-slate-700">
      <h2 className="text-base font-semibold mb-3 text-slate-300">
        Auto-Fetched Device Data
      </h2>
      <div className="space-y-2">
        <DataRow
          icon={<Smartphone size={14} />}
          label="Device Type"
          value={deviceData.device_type}
        />
        <DataRow
          icon={<Monitor size={14} />}
          label="Operating System"
          value={deviceData.operating_system_and_version}
        />
        <DataRow
          icon={<Chrome size={14} />}
          label="Browser Version"
          value={deviceData.browser_version}
        />
        <DataRow
          icon={<Globe size={14} />}
          label="IP Address"
          value={deviceData.ip_address}
        />
        <DataRow
          icon={<Maximize size={14} />}
          label="Screen Resolution"
          value={deviceData.screen_resolution}
        />
      </div>
    </div>
  );
};

export default DeviceDataPanel;
