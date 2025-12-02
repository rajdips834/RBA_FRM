import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-900 text-slate-200 min-h-screen font-sans flex flex-col items-center justify-center">
      <div className="max-w-xl w-full px-8 py-12 rounded-2xl shadow-lg bg-slate-800/80 border border-slate-700 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
          <span className="text-cyan-400">Testing Tool</span>
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          Choose what you want to test:
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-lg shadow hover:bg-cyan-500 transition-colors"
          >
            Login Request
          </button>
          <button
            onClick={() => navigate("/transaction")}
            className="px-6 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-lg shadow hover:bg-cyan-500 transition-colors"
          >
            Transaction Request
          </button>
          <button
            onClick={() => navigate("/csd/builder")}
            className="px-6 py-3 rounded-lg bg-cyan-600 text-white font-semibold text-lg shadow hover:bg-cyan-500 transition-colors"
          >
            CSD Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
