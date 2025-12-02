import React from "react";
import Panel from "../core/Panel";
import CircularProgress from "../core/CircularProgress";
import Field from "../core/Field";
import {
  isNumeric,
  getRiskColor,
  getFinalDecision,
} from "../../utils/riskDetailsUtils";

const SingleResponseDetails = ({ apiResponse }) => {
  if (!apiResponse) return null;

  const response = apiResponse.response || apiResponse;
  const { resultMessage, resultData, resultCode, timestamp } = response;

  if (!resultData) {
    return (
      <div className="w-full mt-6">
        <Panel title="Response Details">
          <div className="bg-red-900/80 border border-red-700 text-red-200 rounded-xl p-8 text-center shadow-lg w-full">
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
        </Panel>
      </div>
    );
  }

  const user = resultData.user || {};
  const rba = resultData || {};
  const aiRisk = resultData.decision_info?.total_ai_risk_score;
  const ruleRisk = resultData.decision_info?.total_rule_risk_score;
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
    aiRiskScore = 0;
    aiRiskLevel = "Unknown";
    aiRiskPercentage = 0;
  } else {
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
    <div className="w-full mt-6">
      <div className="w-full bg-slate-900/80 border border-cyan-700 rounded-xl shadow-lg p-6">
        <div className="space-y-6">
          <div className="bg-slate-800/70 rounded-lg px-4 py-3 text-center shadow">
            <span
              className="text-lg font-bold"
              style={{ color: getRiskColor(resultMessage) }}
            >
              {resultMessage}
            </span>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Left: Final Risk Assessment and Suspicious Attributes */}
            <div className="flex-1 min-w-0 space-y-6">
              <Panel
                title={
                  <span className="text-2xl font-semibold">
                    Final Risk Assessment
                  </span>
                }
              >
                <div className=" p-4 rounded-lg space-y-2 -mt-5">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-slate-300">
                      Final Decision:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: getRiskColor(resultMessage) }}
                    >
                      {finalDecision.toUpperCase()}
                    </span>
                  </div>
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
                      {ruleRisk?.rule_based_risk_level?.toUpperCase() ||
                        "UNKNOWN"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-slate-300">
                      AI Risk:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: getRiskColor(aiRiskLevel) }}
                    >
                      {aiRiskLevel?.toUpperCase() || "Unknown"}
                    </span>
                  </div>
                </div>
              </Panel>
              {ruleScore?.suspicious_attributes && (
                <Panel title="Suspicious Attributes">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(ruleScore.suspicious_attributes)
                      .filter(([_, value]) => value === true)
                      .map(([key]) => (
                        <span key={key} className="text-xs text-red-400">
                          {key
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </span>
                      ))}
                  </div>
                </Panel>
              )}
            </div>
            {/* Right: Visuals */}
            <div className="flex-1 min-w-0 flex flex-col gap-6 justify-center">
              {showRiskCircles && (
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <Panel
                    title="Rule-Based Risk Score (Visual)"
                    className="flex-1"
                  >
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
                  <Panel title="AI Risk Score (Visual)" className="flex-1">
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
                      <div className="pt-4 text-xs text-slate-400">
                        No models trained
                      </div>
                    )}
                  </Panel>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleResponseDetails;
