import React, { useState, useContext } from "react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Maximize2,
  Trash2,
} from "lucide-react";
import Modal from "./core/Modal";
import RiskDetails from "./RiskDetails";
import { clearLogs } from "../utils/apiClient";
import { GlobalContext } from "../context/GlobalContext";

const Panel = ({ title, action, children }) => (
  <div className="bg-slate-800/50 p-1 rounded-xl shadow-lg ring-1 ring-slate-700">
    <div className="flex items-center justify-between px-4 pt-3">
      <h2 className="text-base font-semibold text-slate-300">{title}</h2>
      {action}
    </div>
    <div className="p-4 pt-2">{children}</div>
  </div>
);

const LogsPanel = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState(null);
  const { fetchLogs } = useContext(GlobalContext) || {};
  const [clearing, setClearing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formatJSON = (json) => {
    try {
      return JSON.stringify(json, null, 2);
    } catch (e) {
      return JSON.stringify(json);
    }
  };

  const handleClearLogs = async () => {
    setClearing(true);
    try {
      await clearLogs();
      if (fetchLogs) fetchLogs();
    } catch (e) {
      // Optionally show error
    } finally {
      setClearing(false);
      setShowConfirm(false);
    }
  };

  return (
    <Panel
      title="Request Logs"
      action={
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded bg-red-800 hover:bg-red-900 text-white disabled:opacity-60"
          disabled={clearing || logs.length === 0}
          title="Clear all logs"
        >
          {clearing ? "Clearing..." : "Clear Logs"}
        </button>
      }
    >
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">
            No requests sent yet.
          </p>
        ) : (
          logs.map((log, idx) => (
            <div
              key={log.timestamp + '-' + idx}
              className="p-3 rounded-lg bg-slate-700/50 ring-1 ring-slate-600/50"
            >
              <div className="flex justify-between items-center">
                <span
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    log.isError ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {log.isError ? (
                    <AlertCircle size={14} />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {log.isError ? "Error" : "Success"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 truncate flex-1 mr-2">
                    <span className="font-semibold text-slate-300">
                      Payload:
                    </span>{" "}
                    {JSON.stringify(log.request)}
                  </p>
                  <button
                    onClick={() => setSelectedLog(log)}
                    className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                    title="View Full Details"
                  >
                    <Maximize2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-slate-400 truncate">
                  <span className="font-semibold text-slate-300">
                    Response:
                  </span>{" "}
                  {JSON.stringify(log.response)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        title="Request Details"
        fullWidth={true}
      >
        {selectedLog && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            style={{ height: "72vh", minHeight: 0 }}
          >
            {/* Left column: vertically stacked Payload and Response, each scrollable and height-matched */}
            <div className="flex flex-col h-full min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`flex items-center gap-2 text-sm font-semibold ${
                    selectedLog.isError ? "text-red-400" : "text-emerald-400"
                  }`}
                >
                  {selectedLog.isError ? (
                    <AlertCircle size={14} />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  {selectedLog.isError ? "Error" : "Success"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col flex-1 min-h-0 gap-2">
                <div className="bg-slate-900/50 rounded-lg p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">
                    Payload
                  </h4>
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap break-all flex-1">
                    {formatJSON(selectedLog.request)}
                  </pre>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
                  <h4 className="text-sm font-semibold text-slate-300 mb-2">
                    Response
                  </h4>
                  <pre className="text-xs text-slate-400 whitespace-pre-wrap break-all flex-1">
                    {formatJSON(selectedLog.response)}
                  </pre>
                </div>
              </div>
            </div>
            {/* Right column: RiskDetails, scrollable and height-matched */}
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-2">
                <RiskDetails apiResponse={selectedLog.response} url={selectedLog.request.url} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Clear Logs"
      >
        <div className="space-y-4">
          <p className="text-slate-300">
            Are you sure you want to clear all logs? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 rounded bg-slate-600 text-white hover:bg-slate-700"
              onClick={() => setShowConfirm(false)}
              disabled={clearing}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded bg-red-800 text-white hover:bg-red-900 disabled:opacity-60"
              onClick={handleClearLogs}
              disabled={clearing}
            >
              {clearing ? "Clearing..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </Panel>
  );
};

export default LogsPanel;
