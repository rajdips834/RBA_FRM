import React from "react";
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, DollarSign, Percent } from "lucide-react";
import Panel from "./core/Panel";

const CreditResponseDetails = ({ response }) => {
  if (!response) {
    return <Panel title="Credit Score Response">No response data available.</Panel>;
  }

  const {
    creditScore,
    decision,
    riskLevel,
    approvedAmount,
    interestRate,
    factors,
    applicantName,
    requestTime,
  } = response;

  const getDecisionIcon = () => {
    switch (decision) {
      case "APPROVED":
        return <CheckCircle className="text-green-600" size={24} />;
      case "DENIED":
        return <XCircle className="text-red-600" size={24} />;
      case "CONDITIONAL":
        return <AlertTriangle className="text-yellow-600" size={24} />;
      default:
        return <AlertTriangle className="text-gray-600" size={24} />;
    }
  };

  const getDecisionColor = () => {
    switch (decision) {
      case "APPROVED":
        return "text-green-600 bg-green-50 border-green-200";
      case "DENIED":
        return "text-red-600 bg-red-50 border-red-200";
      case "CONDITIONAL":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case "LOW":
        return "text-green-600 bg-green-100";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-100";
      case "HIGH":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getScoreColor = () => {
    if (creditScore >= 750) return "text-green-600";
    if (creditScore >= 700) return "text-green-500";
    if (creditScore >= 650) return "text-yellow-600";
    if (creditScore >= 600) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Panel title="Credit Score Response">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Applicant:</strong> {applicantName}
            </div>
            <div>
              <strong>Request Time:</strong> {new Date(requestTime).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Main Decision */}
        <div className={`border rounded-lg p-6 mb-6 ${getDecisionColor()}`}>
          <div className="flex items-center gap-3 mb-2">
            {getDecisionIcon()}
            <h3 className="text-2xl font-bold">{decision}</h3>
          </div>
          {decision === "CONDITIONAL" && (
            <p className="text-sm opacity-80">
              Approval subject to additional verification or conditions.
            </p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className={getScoreColor()} size={24} />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor()}`}>
              {creditScore}
            </div>
            <div className="text-sm text-gray-600">Credit Score</div>
          </div>

          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="text-gray-600" size={24} />
            </div>
            <div className={`text-lg font-semibold px-2 py-1 rounded ${getRiskColor()}`}>
              {riskLevel}
            </div>
            <div className="text-sm text-gray-600 mt-1">Risk Level</div>
          </div>

          {approvedAmount > 0 && (
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${approvedAmount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Approved Amount</div>
            </div>
          )}

          {interestRate && (
            <div className="bg-white border rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Percent className="text-blue-600" size={24} />
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {interestRate}%
              </div>
              <div className="text-sm text-gray-600">Interest Rate</div>
            </div>
          )}
        </div>

        {/* Credit Score Range */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Credit Score Range</h4>
          <div className="relative">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>300</span>
              <span>500</span>
              <span>650</span>
              <span>750</span>
              <span>850</span>
            </div>
            <div className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-600 rounded-full relative">
              <div
                className="absolute top-0 w-3 h-3 bg-white border-2 border-gray-800 rounded-full transform -translate-y-0.5"
                style={{ left: `${((creditScore - 300) / 550) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>

        {/* Decision Factors */}
        {factors && (factors.positive?.length > 0 || factors.negative?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {factors.positive?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-600">Positive Factors</h4>
                <ul className="space-y-2">
                  {factors.positive.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {factors.negative?.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-red-600">Negative Factors</h4>
                <ul className="space-y-2">
                  {factors.negative.map((factor, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <XCircle className="text-red-600" size={16} />
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default CreditResponseDetails;
