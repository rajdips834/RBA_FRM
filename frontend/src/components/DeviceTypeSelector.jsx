import React from "react";

const DeviceTypeSelector = ({ deviceType, setDeviceType }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-slate-800 rounded-xl shadow-lg ring-1 ring-slate-700 w-fit">
      <span className="text-slate-300 font-semibold">Device Type:</span>
      {["web", "android", "ios"].map((type) => (
        <button
          key={type}
          onClick={() => setDeviceType(type)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            deviceType === type
              ? "bg-cyan-600 text-white"
              : "text-slate-400 hover:bg-slate-700"
          }`}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default DeviceTypeSelector;
