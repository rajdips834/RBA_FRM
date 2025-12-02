import React, { useState } from "react";
import Panel from "./core/Panel";
import CircularProgress from "./core/CircularProgress";
import Field from "./core/Field";
import {
  getRiskColor,
  isBase64Image,
  getAIScore,
} from "../utils/riskDetailsUtils";
import GraphModal from "./GraphModal";
import { parseQueryParams } from "../utils/urlUtils";

const RiskDetails = ({ apiResponse, url }) => {
  const { baseUrl, params } = parseQueryParams(url);
  const isLoginResponse = baseUrl.includes("userLogin");
  if (!apiResponse)
    return <Panel title="Response Details">No response data.</Panel>;

  const { resultMessage, resultData, resultCode, timestamp } = apiResponse;
  // Case 1: Blocked Transaction (resultData: null)
  if (resultData == null) {
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

  // Case 2/3/4: resultData is present
  const user = resultData.user || {};
  const rba = resultData || {};
  const ruleScore = resultData.rule_score || {};
  const finalScore = resultData.riskScore ?? resultData.final_score ?? "N/A";

  // AI Model Results
  const isolationForest =
    resultData.Isolation_Forest_prediction ||
    resultData.isolation_forest_prediction;
  const xgboost = resultData.xgboost_prediction;

  const aiScore = getAIScore(isolationForest, xgboost);

  // Graph Modal state
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [currentGraph, setCurrentGraph] = useState({ data: null, title: "" });
  const openGraphModal = (graphData, title) => {
    setCurrentGraph({ data: graphData, title });
    setIsGraphModalOpen(true);
  };

  const titleColor = isLoginResponse
    ? getRiskColor(resultData.action)
    : getRiskColor(resultMessage);
  const titleText = isLoginResponse
    ? resultData.action || "No Result Message"
    : resultMessage || "No Result Message";

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/70 rounded-lg px-4 py-3 text-center shadow">
        {isLoginResponse && (
          <div className="text-sm text-slate-400 mt-1">
            <span className="text-xl font-bold" style={{ color: "#06b6d4" }}>
              {resultMessage}
            </span>
          </div>
        )}
        <span className="text-2xl font-bold" style={{ color: titleColor }}>
          {titleText}
        </span>
      </div>

      {/* Final Score Card with Circular Progress */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-t from-slate-800/90 to-slate-900/90 rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center mb-2 w-full max-w-md">
          <div className="mb-2">
            <div className="text-base font-semibold text-slate-200 mb-1 tracking-wide">
              Final Score (out of 100)
            </div>
            <CircularProgress
              value={isNaN(Number(finalScore)) ? 0 : Number(finalScore)}
              max={100}
              //   label={
              //     <span className="text-lg font-bold text-cyan-300">
              //       {finalScore}
              //     </span>
              //   }
              color="#06b6d4"
              size={90}
              thickness={8}
            />
          </div>

          <div className="flex gap-6 w-full justify-center mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">Rule Score</span>
              <span className="text-base font-semibold text-slate-100">
                {ruleScore.risk_score || finalScore || "N/A"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-slate-400">AI Score</span>
              <span className="text-base font-semibold text-slate-100">
                {aiScore}
              </span>
            </div>
            {ruleScore.total_score && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400">Total Score</span>
                <span className="text-base font-semibold text-slate-100">
                  {ruleScore.total_score}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Model Results Panel */}
      {(isolationForest || xgboost) && (
        <Panel title="AI Model Results">
          <div className="space-y-2">
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
      )}

      {/* ...existing code... */}
      {ruleScore.details && (
        <Panel title="Attributes Scores">
          <div className="space-y-1">
            {Object.entries(ruleScore.details)
              .filter(([_, value]) => value > 0)
              .map(([key, value]) => (
                <Field
                  key={key}
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  value={value}
                />
              ))}
          </div>
        </Panel>
      )}

      {ruleScore.derived_enriched_attributes && (
        <Panel title="Derived Attributes Score">
          <div className=" space-y-1">
            {Object.entries(ruleScore.derived_enriched_attributes)
              .filter(([_, value]) => value > 0)
              .map(([key, value]) => (
                <Field
                  key={key}
                  label={key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                  value={Number(value).toFixed(2)}
                />
              ))}
          </div>
        </Panel>
      )}

      {ruleScore.suspicious_attributes && (
        <Panel title="Suspicious Attributes">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(ruleScore.suspicious_attributes)
              .filter(([_, value]) => value === true)
              .map(([key]) => (
                <span key={key} className="text-xs text-red-400">
                  {key
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
              ))}
          </div>
        </Panel>
      )}

      {!isLoginResponse && (
        <Panel title="User Details">
          <Field label="UserId" value={user.userid || rba.userId || "N/A"} />
          <Field label="Email" value={user.email || "N/A"} />
          <Field label="Phone" value={user.phone || "N/A"} />
          <Field
            label="AccountId"
            value={user.accountid || rba.accountId || "N/A"}
          />
        </Panel>
      )}

      <Panel title="Other Details">
        {!isLoginResponse && (
          <Field label="ActionNeeded" value={rba.actionNeeded || "N/A"} />
        )}
        {!isLoginResponse && <Field label="Type" value={rba.type ?? "N/A"} />}
        <Field label="Result Code" value={resultCode} />
        <Field label="AuthType" value={rba.authType || "N/A"} />
        <Field label="TrackingId" value={rba.trackingId || "N/A"} />
        <Field label="Timestamp" value={timestamp || "N/A"} />
      </Panel>

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

export default RiskDetails;
