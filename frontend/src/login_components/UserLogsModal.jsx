import React, { useState } from "react";
import { X, Code } from "lucide-react";
import LoginResponseDetails from "./LoginResponseDetails";

const getActionColorClass = (action) => {
  switch (action) {
    case "Decline Request":
      return "text-red-400";
    case "Review":
      return "text-yellow-400";
    case "Require MFA":
      return "text-cyan-400";
    case "Bypass MFA":
      return "text-blue-400";
    default:
      return "text-slate-400";
  }
};

const UserLogsModal = ({ isOpen, onClose, logs, userId, title }) => {
  const [expandedLogIndex, setExpandedLogIndex] = useState(null);

  if (!isOpen) return null;

  const getAction = (r) => {
    if (r && r.resultMessage?.includes("User authenticate successfully."))
      return "Bypass MFA";
    if (r && r.resultMessage?.includes("Login successfull.User authenticate."))
      return "Bypass MFA";
    if (r && r.resultMessage?.includes("resultData is null")) return "NA";
    if (r && r.resultData && r.resultData.action) return r.resultData.action;
    if (!r || (!r.resultData && !!r.resultMessage)) return "Decline Request";
    return "NA";
  };

  const handleToggleLog = (index) => {
    setExpandedLogIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  // Use custom title if provided, otherwise default to user-specific title
  const modalTitle = title || (
    <>
      Logs for User: <span className="font-mono text-cyan-400">{userId}</span>
    </>
  );

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-6">
          <div className="space-y-4">
            {logs.map((log, index) => {
              const action = getAction(log);
              const riskScore = log?.resultData?.riskScore || "N/A";
              const timestamp = log?.timestamp || "N/A";

              return (
                <div
                  key={index}
                  className="bg-slate-900/70 p-4 rounded-lg border border-slate-700 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span
                        className={`font-bold text-lg ${getActionColorClass(
                          action
                        )}`}
                      >
                        {action}
                      </span>
                      <div className="mt-2 text-xs text-slate-500 font-mono">
                        {timestamp}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-sm text-slate-400">
                        Risk Score:{" "}
                        <span className="font-semibold text-white">
                          {riskScore}
                        </span>
                      </span>
                      <button
                        onClick={() => handleToggleLog(index)}
                        className="flex items-center gap-1.5 text-xs px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors"
                      >
                        <Code size={12} />
                        {expandedLogIndex === index
                          ? "Hide Details"
                          : "Analyze"}
                      </button>
                    </div>
                  </div>

                  {/* CHANGED: We now render the formatted LoginResponseDetails component */}
                  {expandedLogIndex === index && (
                    <div className="mt-4 border-t border-slate-700 pt-4">
                      <LoginResponseDetails apiResponse={log} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogsModal;
