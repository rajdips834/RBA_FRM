// Utility functions for RiskDetails

function isNumeric(val) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

const isBase64Image = (str) => {
  if (!str || typeof str !== "string") return false;
  return str.length > 100 && !str.toLowerCase().includes("not trained");
};

const getRiskColor = (resultMessage) => {
  const level = getLevel(resultMessage);
  switch (level) {
    case "high":
      return "#ef4444"; // red-500
    case "medium":
      return "#f59e42"; // amber-500
    case "low":
      return "#22c55e"; // green-500
    default:
      return "#38bdf8"; // cyan-400
  }
};

const getLevel = (resultMessage) => {
  if (!resultMessage) return "unknown";
  if (resultMessage.toLowerCase().includes("blocked")) return "high";
  if (resultMessage.toLowerCase().includes("decline")) return "high";
  if (resultMessage.toLowerCase().includes("bypass")) return "low";
  if (resultMessage.toLowerCase().includes("mfa")) return "medium";
  if (resultMessage.toLowerCase().includes("case")) return "medium";
  if (resultMessage.toLowerCase().includes("review")) return "medium";
  if (resultMessage.toLowerCase().includes("authenticated")) return "low";
  
  return "unknown";
};

const getFinalDecision = (aiRisk, ruleRisk) => {
  const matrix = {
    low: {
      low: "Continue",
      medium: "Continue",
      high: "Require MFA",
    },
    medium: {
      low: "Continue",
      medium: "Require MFA",
      high: "Require MFA",
    },
    high: {
      low: "Require MFA",
      medium: "Require MFA",
      high: "Block",
    },
    unknown: {
      low: "Continue",
      medium: "Require MFA",
      high: "Block",
    },
  };
  return matrix[aiRisk?.toLowerCase()]?.[ruleRisk?.toLowerCase()] || "Unknown";
};

const parseRisk = (risk) => {
  if (!risk || typeof risk !== "string") return null;
  const num = parseFloat(risk);
  return isNaN(num) ? null : num;
};

const getAIScore = (isolationForest, xgboost) => {
  const aiRisks = [];

  if (isolationForest && isolationForest.risk_probabilities) {
    const val = parseRisk(isolationForest.risk_probabilities);
    if (val !== null && val !==0) aiRisks.push(val);
  }
  if (xgboost && xgboost.risk_probabilities) {
    const val = parseRisk(xgboost.risk_probabilities);
    if (val !== null && val !==0) aiRisks.push(val);
  }
  const aiScore =
    aiRisks.length > 0
      ? (aiRisks.reduce((a, b) => a + b, 0) / aiRisks.length).toFixed(2)
      : "N/A";
  return aiScore;
};

export { isNumeric, isBase64Image, getRiskColor, getFinalDecision, getLevel, getAIScore };
