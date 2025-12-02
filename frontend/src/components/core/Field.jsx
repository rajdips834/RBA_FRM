import React from "react";

const Field = ({ label, value }) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-slate-400 font-medium">{label}</span>
    <span className="text-slate-200 font-mono">{value ?? "N/A"}</span>
  </div>
);

export default Field;
