import React, { useState } from "react";
import Panel from "./core/Panel";
import GraphModal from "./GraphModal";
import Field from "./core/Field";
import CircularProgress from "./core/CircularProgress";
import {
  isNumeric,
  getRiskColor,
  getAIRiskLevel,
  getFinalDecision,
  getDecisionColor,
} from "../utils/riskDetailsUtils";

const RiskDetails = ({ apiResponse }) => {
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [currentGraph, setCurrentGraph] = useState({ data: null, title: "" });

  const openGraphModal = (graphData, title) => {
    setCurrentGraph({ data: graphData, title });
    setIsGraphModalOpen(true);
  };

  if (!apiResponse)
    return <Panel title="Response Details">No response data.</Panel>;

  // Handle cases where the response might be nested
  const response = apiResponse.response || apiResponse;

  const { resultMessage, resultData, resultCode, timestamp } = response;

  // Suspicious Activity Case
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

  // User Details
  const user = resultData.user || {};
  // Other RBA Details
  const rba = resultData || {};
  // AI Risk Score
  const aiRisk = resultData.decision_info?.total_ai_risk_score;
  // Rule-Based Risk Score
  const ruleRisk = resultData.decision_info?.total_rule_risk_score;
  // Rule Score Details
  const ruleScore = resultData.rule_score || ruleRisk;

  // Model predictions
  const randomForest = resultData.Random_Forest_prediction;
  const oneClassSVM = resultData.OneClassSVM_prediction;
  const gradientBoosting = resultData.Gradient_Boosting_prediction;
  const isolationForest = resultData.Isolation_Forest_prediction;

  // Count trained models that predict risk (1)
  const trainedModels = [
    randomForest,
    oneClassSVM,
    gradientBoosting,
    isolationForest,
  ].filter(
    (model) =>
      model?.prediction !== undefined &&
      model.prediction !==
        "Model not trained, Labeled data not present in database"
  );
  const riskyPredictions = trainedModels.filter(
    (model) => model.prediction === "1"
  ).length;

  // Calculate AI risk scores
  let aiTotalScore = 4; // Total number of models
  let aiRiskScore;
  let aiRiskPercentage;
  let aiRiskLevel;

  if (trainedModels.length === 0) {
    // If no models are trained, calculate based on rule-based risk percentage
    aiRiskScore = 0;
    aiRiskLevel = "Unknown";
    aiRiskPercentage = 0;
  } else {
    // Use number of risky predictions as risk score
    aiRiskScore = aiRisk.risk_score || riskyPredictions;
    aiTotalScore = aiRisk.total_score || 4;
    aiRiskPercentage = (riskyPredictions / aiTotalScore) * 100;
    aiRiskLevel = aiRisk.ai_risk_level;
  }

  const showRiskCircles =
    ruleRisk &&
    isNumeric(ruleRisk.risk_score) &&
    isNumeric(ruleRisk.total_score) &&
    isNumeric(ruleRisk.risk_percentage);

  // Get final decision
  const finalDecision = getFinalDecision(
    aiRiskLevel,
    ruleRisk?.rule_based_risk_level
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/70 rounded-lg px-4 py-3 text-center shadow">
        <span className="text-lg font-bold text-cyan-400">{resultMessage}</span>
      </div>

      <Panel
        title={
          <span className="text-2xl font-semibold">Final Risk Assessment</span>
        }
      >
        <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 -mt-5">
          {/* Final Decision */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-slate-300">
              Final Decision:
            </span>
            <span
              className="text-sm font-semibold"
              style={{ color: getDecisionColor(finalDecision) }}
            >
              {finalDecision.toUpperCase()}
            </span>
          </div>

          {/* Rule Risk */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-slate-300">
              Rule Risk:
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                color: getRiskColor(ruleRisk?.rule_based_risk_level),
              }}
            >
              {ruleRisk?.rule_based_risk_level.toUpperCase() || "UNKNOWN"}
            </span>
          </div>

          {/* AI Risk */}
          <div className="flex items-start gap-2">
            <span className="text-sm font-medium text-slate-300">AI Risk:</span>
            <span
              className="text-sm font-semibold"
              style={{ color: getRiskColor(aiRiskLevel) }}
            >
              {aiRiskLevel.toUpperCase() || "Unknown"}
            </span>
          </div>
        </div>
      </Panel>
      {showRiskCircles && (
        <>
          <Panel title="Rule-Based Risk Score (Visual)">
            <div className="flex flex-wrap justify-center gap-4">
              <CircularProgress
                value={ruleRisk.risk_score}
                max={ruleRisk.total_score}
                label="Risk Score"
                color={getRiskColor(ruleRisk.rule_based_risk_level)}
              />
              <CircularProgress
                value={ruleRisk.total_score}
                max={ruleRisk.total_score}
                label="Total Score"
                color="#38bdf8"
              />
              <CircularProgress
                value={ruleRisk.risk_percentage}
                max={100}
                label="Risk %"
                color={getRiskColor(ruleRisk.rule_based_risk_level)}
              />
            </div>
            {ruleRisk.weightage && (
              <div className="pt-4">
                <span className="text-slate-400 text-xs font-medium">
                  Risk Level:
                </span>

                {/* Optional circle indicator */}
                {/* <div
    className="w-3 h-3 rounded-full"
    style={{ backgroundColor: getRiskColor(aiRiskLevel) }}
  /> */}

                <span
                  className="text-xs font-semibold ml-2"
                  style={{
                    color: getRiskColor(ruleRisk.rule_based_risk_level),
                  }}
                >
                  {ruleRisk.rule_based_risk_level.toUpperCase()}
                </span>

                <div className="mt-0">
                  <span className="text-xs text-slate-400 font-semibold">
                    Weightage Bands:
                  </span>
                  <div className="flex gap-4 mt-1 text-xs">
                    <span className="text-emerald-400">
                      Low: {ruleRisk.weightage.Bypass_MFA}
                    </span>
                    <span className="text-yellow-400">
                      Medium: {ruleRisk.weightage.required_MFA}
                    </span>
                    <span className="text-red-400">
                      High: {ruleRisk.weightage.decline_request}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Panel>
          <Panel title="AI Risk Score (Visual)">
            {trainedModels.length > 0 ? (
              <>
                <div className="flex flex-wrap justify-center gap-4">
                  <CircularProgress
                    value={aiRiskScore}
                    max={aiTotalScore}
                    label="Risk Score"
                    color={getRiskColor(aiRiskLevel)}
                  />
                  <CircularProgress
                    value={aiTotalScore}
                    max={aiTotalScore}
                    label="Total Score"
                    color="#38bdf8"
                  />
                  <CircularProgress
                    value={Math.round(aiRiskPercentage)}
                    max={100}
                    label="Risk %"
                    color={getRiskColor(aiRiskLevel)}
                  />
                </div>
                <div className="pt-4">
                  <span className="text-slate-400 text-xs font-medium">
                    Risk Level:
                  </span>
                  <span
                    className="text-xs font-semibold ml-2"
                    style={{ color: getRiskColor(aiRiskLevel) }}
                  >
                    {aiRiskLevel.toUpperCase()}
                  </span>
                  <div className="mt-0">
                    <span className="text-xs text-slate-400 font-semibold">
                      Weightage Bands:
                    </span>
                    <div className="flex gap-4 mt-1 text-xs">
                      <span className="text-emerald-400">
                        Low: {aiRisk.ai_weightage.Bypass_MFA}
                      </span>
                      <span className="text-yellow-400">
                        Medium: {aiRisk.ai_weightage.required_MFA}
                      </span>
                      <span className="text-red-400">
                        High: {aiRisk.ai_weightage.decline_request}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-xm font-semibold  text-slate-400">
                No models trained
              </div>
            )}
          </Panel>
        </>
      )}

      
      {/* {ruleRisk && (
        <Panel title="Rule-Based Risk Score">
          <Field label="Risk Score" value={ruleRisk.risk_score ?? "N/A"} />
          <Field label="Total Score" value={ruleRisk.total_score ?? "N/A"} />
          <Field
            label="Risk Percentage"
            value={ruleRisk.risk_percentage ?? "N/A"}
          />
          <Field
            label="Risk Level"
            value={ruleRisk.rule_based_risk_level ?? "N/A"}
          />
        </Panel>
      )} */}

      {aiRisk && (
        <Panel title="AI Score Details">
          <div className="border-t border-slate-700 pt-4">
            <h4 className="text-sm font-semibold text-slate-300">
              Model Predictions
            </h4>

            <div className="space-y-2">
              {" "}
              <div className="bg-slate-800/50 p-3 rounded">
                <h5 className="text-sm font-medium text-cyan-400">
                  Random Forest
                </h5>
                <p className="text-sm text-slate-300">
                  {randomForest?.prediction || "Model not trained"}
                  {randomForest?.risk_probabilities
                    ? ` (Risk: ${randomForest.risk_probabilities})`
                    : ""}
                  {randomForest?.graph && (
                    <button
                      onClick={() =>
                        openGraphModal(
                          randomForest.graph,
                          "Random Forest Analysis"
                        )
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                    >
                      (View Graph)
                    </button>
                  )}
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <h5 className="text-sm font-medium text-cyan-400">
                  One-Class SVM
                </h5>
                <p className="text-sm text-slate-300">
                  {oneClassSVM?.prediction || "Model not trained"}
                  {oneClassSVM?.risk_probabilities
                    ? ` (Risk: ${oneClassSVM.risk_probabilities})`
                    : ""}
                  {oneClassSVM?.graph && (
                    <button
                      onClick={() =>
                        openGraphModal(
                          oneClassSVM.graph,
                          "One-Class SVM Analysis"
                        )
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                    >
                      (View Graph)
                    </button>
                  )}
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <h5 className="text-sm font-medium text-cyan-400">
                  Gradient Boosting
                </h5>
                <p className="text-sm text-slate-300">
                  {gradientBoosting?.prediction || "Model not trained"}
                  {gradientBoosting?.risk_probabilities
                    ? ` (Risk: ${gradientBoosting.risk_probabilities})`
                    : ""}
                  {gradientBoosting?.graph && (
                    <button
                      onClick={() =>
                        openGraphModal(
                          gradientBoosting.graph,
                          "Gradient Boosting Analysis"
                        )
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                    >
                      (View Graph)
                    </button>
                  )}
                </p>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <h5 className="text-sm font-medium text-cyan-400">
                  Isolation Forest
                </h5>
                <p className="text-sm text-slate-300">
                  {isolationForest?.prediction || "Model not trained"}
                  {isolationForest?.risk_probabilities
                    ? ` (Risk: ${isolationForest.risk_probabilities})`
                    : ""}
                  {isolationForest?.graph && (
                    <button
                      onClick={() =>
                        openGraphModal(
                          isolationForest.graph,
                          "Isolation Forest Analysis"
                        )
                      }
                      className="text-xs text-cyan-400 hover:text-cyan-300 ml-2 underline cursor-pointer"
                    >
                      (View Graph)
                    </button>
                  )}
                </p>
              </div>
              {trainedModels.length > 0 && (
                <div className="mt-3 text-xs text-slate-400">
                  Models predicting risk: {riskyPredictions} /{" "}
                  {trainedModels.length}
                </div>
              )}
            </div>
          </div>
        </Panel>
      )}

      {ruleScore && (
        <Panel title="Rule Score Details">
          <Field
            label="Risk Score"
            value={`${ruleScore.risk_score ?? "N/A"} / ${
              ruleScore.total_score ?? "1760"
            }`}
          />
          {ruleScore.details && (
            <div className="mt-2 space-y-1">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">
                Score Details
              </h4>
              {Object.entries(ruleScore.details).map(([key, value]) => (
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
          )}
          {ruleScore.suspicious_attributes && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">
                Suspicious Attributes
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(ruleScore.suspicious_attributes)
                  .filter(([_, value]) => value === true)
                  .map(([key]) => (
                    <span key={key} className="text-xs text-red-400">
                      {key
                        .split("_")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </Panel>
      )}

      <Panel title="User Details">
        <Field label="UserId" value={user.userid || "N/A"} />
        <Field label="Email" value={user.email || "N/A"} />
        <Field label="Phone" value={user.phone || "N/A"} />
        <Field label="AccountId" value={user.accountid || "N/A"} />
      </Panel>

      <Panel title="Other RBA Details">
        <Field label="ActionNeeded" value={rba.actionNeeded || "N/A"} />
        <Field label="Action" value={rba.action || "N/A"} />
        <Field label="AuthType" value={rba.authType || "N/A"} />
        <Field label="Status" value={rba.status ?? "N/A"} />
        <Field label="TrackingId" value={rba.trackingId || "N/A"} />
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
