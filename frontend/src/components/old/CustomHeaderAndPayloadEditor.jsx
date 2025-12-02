import React, { useState } from "react";
import { nanoid } from "nanoid";

const CustomHeaderAndPayloadEditor = ({ onHeadersChange, onPayloadChange }) => {
  const [headers, setHeaders] = useState([]); // Initialize as an empty array
  const [payload, setPayload] = useState([]); // Initialize as an empty array

  const handleHeaderChange = (id, field, value) => {
    setHeaders((prev) => {
      const updatedHeaders = prev.map((header) =>
        header.id === id ? { ...header, [field]: value } : header
      );
      onHeadersChange(updatedHeaders.filter(({ key }) => key.trim() !== ""));
      return updatedHeaders;
    });
  };

  const handleAddHeader = () => {
    setHeaders((prev) => [...prev, { id: nanoid(), key: "", value: "" }]);
  };

  const handleRemoveHeader = (id) => {
    setHeaders((prev) => {
      const updatedHeaders = prev.filter((header) => header.id !== id);
      onHeadersChange(updatedHeaders.filter(({ key }) => key.trim() !== ""));
      return updatedHeaders;
    });
  };

  const handlePayloadChange = (id, field, value) => {
    setPayload((prev) => {
      const updatedPayload = prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      );
      // Convert values based on type
      const processedPayload = updatedPayload.map((item) => ({
        ...item,
        value:
          item.type === "number" && item.value !== ""
            ? Number(item.value)
            : item.type === "boolean"
            ? item.value === "true"
            : item.value,
      }));
      onPayloadChange(processedPayload.filter(({ key }) => key.trim() !== ""));
      return updatedPayload;
    });
  };

  const handleAddPayload = () => {
    setPayload((prev) => [
      ...prev,
      { id: nanoid(), key: "", value: "", type: "string" },
    ]);
  };

  const handleRemovePayload = (id) => {
    setPayload((prev) => {
      const updatedPayload = prev.filter((item) => item.id !== id);
      onPayloadChange(updatedPayload.filter(({ key }) => key.trim() !== ""));
      return updatedPayload;
    });
  };

  const renderPayloadValueInput = (id, value, type) => {
    switch (type) {
      case "boolean":
        return (
          <select
            value={value}
            onChange={(e) => handlePayloadChange(id, "value", e.target.value)}
            className="w-1/3 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="">Select a value</option>
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            placeholder="Payload Value"
            value={value}
            onChange={(e) => handlePayloadChange(id, "value", e.target.value)}
            className="w-1/3 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        );
      default:
        return (
          <input
            type="text"
            placeholder="Payload Value"
            value={value}
            onChange={(e) => handlePayloadChange(id, "value", e.target.value)}
            className="w-1/3 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-slate-300">Custom Headers</h3>
      <div className="space-y-2">
        {headers.map(({ id, key, value }) => (
          <div key={id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Header Key"
              value={key}
              onChange={(e) => handleHeaderChange(id, "key", e.target.value)}
              className="w-1/2 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <input
              type="text"
              placeholder="Header Value"
              value={value}
              onChange={(e) => handleHeaderChange(id, "value", e.target.value)}
              className="w-1/2 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              onClick={() => handleRemoveHeader(id)}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddHeader}
          className="text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          + Add Header
        </button>
      </div>

      <h3 className="text-sm font-medium text-slate-300">Custom Payload</h3>
      <div className="space-y-2">
        {payload.map(({ id, key, value, type }) => (
          <div key={id} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Payload Key"
              value={key}
              onChange={(e) => handlePayloadChange(id, "key", e.target.value)}
              className="w-1/3 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            {renderPayloadValueInput(id, value, type)}
            <select
              value={type}
              onChange={(e) => handlePayloadChange(id, "type", e.target.value)}
              className="w-1/6 p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="string">String</option>
              <option value="number">Number</option>
              <option value="boolean">Boolean</option>
            </select>
            <button
              onClick={() => handleRemovePayload(id)}
              className="text-red-500 hover:text-red-400 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPayload}
          className="text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          + Add Payload
        </button>
      </div>
    </div>
  );
};

export default CustomHeaderAndPayloadEditor;
