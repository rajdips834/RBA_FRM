import React, { useState } from "react";

const ClearUserHistoryButton = ({ users, token }) => {
  const [isClearing, setIsClearing] = useState(false);
  const [clearMsg, setClearMsg] = useState("");

  const handleClearUserHistory = async () => {
    if (!Array.isArray(users) || users.length === 0) {
      setClearMsg("No users to clear.");
      return;
    }
    if (!token) {
      setClearMsg("Auth token missing.");
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to clear history for all users?\nThis action is irreversible and will delete all historical data for all users.`
    );
    if (!confirmed) return;
    setIsClearing(true);
    setClearMsg("");
    const baseUrl = `${
      import.meta.env.VITE_AXIOM_URL
    }/rba/deleteBulkUsersHistoricalData`;
    const accountId = import.meta.env.VITE_ACCOUNT_ID;
    const requestTime = encodeURIComponent(
      new Date().toISOString().replace("T", " ").split(".")[0]
    );
    let allSuccess = true;
    let errorMsg = "";
    for (let type of [1, 2, 3]) {
      const url = `${baseUrl}?accountId=${accountId}&requestTime=${requestTime}&type=${type}`;
      try {
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authToken: token,
          },
          body: JSON.stringify("[Test017]"),////change to users in prod
        });
        if (!res.ok) {
          allSuccess = false;
          const err = await res.text();
          errorMsg += `Type ${type}: ${err}\n`;
        }
      } catch (e) {
        allSuccess = false;
        errorMsg += `Type ${type}: ${e.message}\n`;
      }
    }
    setIsClearing(false);
    setClearMsg(
      allSuccess ? "User history cleared!" : `Error: ${errorMsg}`
    );
  };

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleClearUserHistory}
        disabled={isClearing}
        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-500 ml-2 flex items-center"
        style={{ minWidth: 120 }}
        title="Clear history for all users"
      >
        {isClearing ? "Clearing..." : "Clear User History"}
      </button>
      {clearMsg && (
        <div className="mt-2 text-xs text-slate-400 text-right">{clearMsg}</div>
      )}
    </div>
  );
};

export default ClearUserHistoryButton;
