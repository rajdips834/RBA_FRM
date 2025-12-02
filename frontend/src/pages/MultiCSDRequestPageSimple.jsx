import React, { useState, useContext } from "react";
import { Send, Users, User, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Panel from "../components/core/Panel";
import Field from "../components/core/Field";
import Input from "../components/core/Input";
import { GlobalContext } from "../context/GlobalContext";

function MultiCSDRequestPageSimple() {
  const navigate = useNavigate();
  const {
    addLog: _addLog,
    multiCSDResponses: _multiCSDResponses,
    setMultiCSDResponses: _setMultiCSDResponses,
    setMultiCSDTotalRequests: _setMultiCSDTotalRequests,
  } = useContext(GlobalContext);

  const [isLoading, _setIsLoading] = useState(false);
  const [bulkConfig, setBulkConfig] = useState({
    numberOfRequests: "10",
    loanAmountRange: {
      min: "5000",
      max: "50000",
    },
    incomeRange: {
      min: "25000",
      max: "150000",
    },
    loanPurpose: "mixed",
    employmentStatus: "mixed",
    riskProfile: "mixed",
  });

  const handleConfigChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBulkConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBulkConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-sm">Mode:</span>
          <button
            onClick={() => navigate("/csd/single")}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-cyan-600 text-slate-200 transition-colors"
          >
            <User size={18} className="inline mr-2" />
            Single Request
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium"
          >
            Multi Request
          </button>
        </div>
      </div>

      {/* Bulk Configuration */}
      <Panel title="Bulk Request Configuration" icon={<Users size={20} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Number of Requests" required>
            <Input
              type="number"
              min="1"
              max="100"
              value={bulkConfig.numberOfRequests}
              onChange={(e) => handleConfigChange("numberOfRequests", e.target.value)}
              placeholder="Enter number of requests"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => console.log("Bulk submit clicked")}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors disabled:opacity-50"
          >
            <Send size={18} />
            {isLoading ? "Processing..." : `Submit ${bulkConfig.numberOfRequests} Requests`}
          </button>
        </div>
      </Panel>
    </div>
  );
}

export default MultiCSDRequestPageSimple;
