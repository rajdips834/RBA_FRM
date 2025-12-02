import React, { useState } from "react";
import Panel from "../components/core/Panel";
import Field from "../components/core/Field";
import CircularProgress from "../components/core/CircularProgress";
import GraphModal from "../components/GraphModal";
import {
  getRiskColor,
  isBase64Image,
  getAIScore,
} from "../utils/riskDetailsUtils";

const ACTION_COLOR_MAP = {
  "Require MFA": "#facc15", // yellow
  "Review": "#facc15", // yellow
  "Decline Request": "#ef4444", // red
  "Bypass MFA": "#22c55e", // green
};

const LoginResponseDetails = ({ apiResponse }) => {
  if (!apiResponse)
    return <Panel title="Response Details">No response data.</Panel>;
  const { resultMessage, resultData, resultCode, timestamp } = apiResponse;

  // Blocked/No resultData
  if (!resultData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="bg-red-900/80 border border-red-700 text-red-200 rounded-xl p-8 text-center shadow-lg max-w-lg w-full">
          <h2 className="text-2xl font-bold mb-2">
            {resultMessage || "Suspicious Activity Detected"}
          </h2>
          <p className="mb-1">
            Code: <span className="font-mono">{resultCode ?? "N/A"}</span>
          </p>
          <p>
            Time: <span className="font-mono">{timestamp ?? "N/A"}</span>
          </p>
        </div>
      </div>
    );
  }

  // Extract fields
  const {
    riskScore,
    action,
    trackingId,
    Isolation_Forest_prediction,
    xgboost_prediction,
  } = resultData;
  // console.log("Login Response Details:", resultData);
  // Action color
  const titleColor = ACTION_COLOR_MAP[action] || getRiskColor(action);
  
  // AI Model Results
  const isolationForest = Isolation_Forest_prediction;
  const xgboost = xgboost_prediction;
  const aiScore = getAIScore(isolationForest, xgboost);
  const aiColor = aiScore > riskScore ? titleColor : "#06b6d4";
  const aiMax = Math.max(100, aiScore * 1.7);
  // console.log("AI Score:", aiScore);
  // Graph Modal state
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [currentGraph, setCurrentGraph] = useState({ data: null, title: "" });
  const openGraphModal = (graphData, title) => {
    setCurrentGraph({ data: graphData, title });
    setIsGraphModalOpen(true);
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Main Status Message */}
      <div className="bg-slate-800/70 rounded-lg px-4 py-3 text-center shadow">
        <span className="text-2xl font-bold" style={{ color: titleColor }}>
          {action || "N/A"}
        </span>
      </div>

      {/* Final Score Card with Circular Progress */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-b from-slate-800/90 to-slate-900/90 rounded-2xl shadow-xl px-8 py-6 flex flex-row items-center mb-2 w-full max-w-2xl gap-8">
          {/* Risk Score Circular Bar */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-base font-semibold text-slate-200 mb-1 tracking-wide">
              Risk Score (out of 100)
            </div>
            <CircularProgress
              value={isNaN(Number(riskScore)) ? 0 : Number(riskScore)}
              max={100}
              color={titleColor}
              size={90}
              thickness={8}
            />
            <span className="text-xs text-slate-400 mt-2">
              Rule Score
            </span>
          </div>
          {/* AI Score Circular Bar */}
          <div className="flex flex-col items-center flex-1">
            <div className="text-base font-semibold text-slate-200 mb-1 tracking-wide">
              AI Score 
            </div>
            <CircularProgress
              value={isNaN(Number(aiScore)) ? 0 : Number(aiScore)}
              max={aiMax}
              color={aiColor}
              size={90}
              thickness={8}
            />
            <span className="text-xs text-slate-400 mt-2">ML Model Score</span>
          </div>
        </div>
      </div>

      {/* AI Model Results */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel: AI Model Results */}
        <div className="flex-1 flex">
          <Panel title="AI Model Results">
            <div className="space-y-2 ">
              {!isolationForest && !xgboost && (
                <div className="bg-slate-800/50 p-3 rounded text-slate-400 text-center">
                  No ML results to show.
                </div>
              )}
              {isolationForest && (
                <div className="bg-slate-800/50 p-3 rounded">
                  <h5 className="text-sm font-medium text-cyan-400">
                    Isolation Forest
                    {isBase64Image(isolationForest.graph) && (
                      <button
                        onClick={() =>
                          openGraphModal(
                            isolationForest.graph,
                            "Isolation Forest Graph"
                          )
                        }
                        className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                      >
                        (View Graph)
                      </button>
                    )}
                  </h5>
                  <p className="text-sm text-slate-300">
                    Prediction: {isolationForest.prediction || "N/A"}
                  </p>
                  <p className="text-sm text-slate-300">
                    Risk: {isolationForest.risk_probabilities || "N/A"}
                  </p>
                </div>
              )}
              {xgboost && (
                <div className="bg-slate-800/50 p-3 rounded">
                  <h5 className="text-sm font-medium text-cyan-400">
                    XGBoost
                    {isBase64Image(xgboost.graph) && (
                      <button
                        onClick={() =>
                          openGraphModal(xgboost.graph, "XGBoost Graph")
                        }
                        className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                      >
                        (View Graph)
                      </button>
                    )}
                  </h5>
                  <p className="text-sm text-slate-300">
                    Prediction: {xgboost.prediction || "N/A"}
                  </p>
                  <p className="text-sm text-slate-300">
                    Risk: {xgboost.risk_probabilities || "N/A"}
                  </p>
                </div>
              )}
            </div>
          </Panel>
        </div>
        {/* Right Panel: JWT and Details */}
        <div className="flex-1 flex">
          <Panel title="Login Attempt Details">
            <div className="space-y-2">
              <Field label="Result Message" value={resultMessage} />
              <Field label="Result Code" value={resultCode} />
              <Field label="Timestamp" value={timestamp} />
              <Field label="Tracking ID" value={trackingId || "N/A"} />
            </div>
          </Panel>
        </div>
      </div>

      {/* Graph Modal */}
      <GraphModal
        isOpen={isGraphModalOpen}
        onClose={() => setIsGraphModalOpen(false)}
        graphData={currentGraph.data}
        title={currentGraph.title}
      />
    </div>
  );
};

export default LoginResponseDetails;
