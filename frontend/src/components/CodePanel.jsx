import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const CodePanel = ({ title, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800/50 p-1 rounded-xl shadow-lg ring-1 ring-slate-700">
      <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          {copied ? (
            <Check size={16} className="text-emerald-400" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto h-full text-slate-300">
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
};

export default CodePanel;
