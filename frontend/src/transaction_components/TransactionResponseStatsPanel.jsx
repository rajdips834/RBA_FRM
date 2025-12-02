import React, { useMemo, useState } from "react";
import Panel from "../components/core/Panel";
import ActionPieChart from "../login_components/ActionPieChart"; 
import UserLogsModal from "../login_components/UserLogsModal";
import Pagination from "../components/core/Pagination";

const getActionColor = (action) => {
  switch (action) {
    case "Decline Request": return "red";
    case "Review": return "yellow";
    case "Require MFA": return "cyan";
    case "Bypass MFA": return "blue";
    default: return "slate";
  }
};

const StatCard = ({ label, value, color, onClick }) => (
  <div
    className={`bg-${color}-500/10 border border-${color}-500/20 p-4 rounded-xl text-center shadow-md transition-all hover:bg-${color}-500/20 cursor-pointer`}
    onClick={onClick}
  >
    <div className="text-3xl font-bold text-white">{value}</div>
    <div className={`text-sm font-semibold text-${color}-400 mt-1`}>
      {label}
    </div>
  </div>
);

const ACTIONS = ["Bypass MFA", "Require MFA", "Review", "Decline Request", "NA"];

const TransactionResponseStatsPanel = ({ responses, n }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserLogs, setSelectedUserLogs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedActionLogs, setSelectedActionLogs] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  // **THE FIX IS HERE**: All data access now correctly uses `r.response`
  const getAction = (r) => {
    if (r && r.response?.resultData && r.response.resultData.action) {
      return r.response.resultData.action;
    }
    if (!r || !r.response || !r.response.resultData) {
      return "Decline Request";
    }
    return "NA";
  };

  const stats = useMemo(() => {
    const latestResponses = responses.slice(-n);
    const actionStats = Object.fromEntries(ACTIONS.map((action) => [action, 0]));
    const userStats = {};
    const userSet = new Set();

    for (const res of latestResponses) {
      const userId = res?.userId || "Unknown";
      userSet.add(userId);
      if (!userStats[userId]) {
        userStats[userId] = {
          total: 0, totalScore: 0, scoredRequests: 0,
          ...Object.fromEntries(ACTIONS.map((action) => [action, 0])),
        };
      }
      const action = getAction(res);
      if (action in actionStats) actionStats[action]++;
      if (action in userStats[userId]) userStats[userId][action]++;
      userStats[userId].total++;
      
      // **THE FIX IS HERE**: Correctly access the nested risk score
      const riskScore = res?.response?.resultData?.final_score ?? res?.response?.resultData?.riskScore;
      if (riskScore != null) {
        userStats[userId].totalScore += Number(riskScore);
        userStats[userId].scoredRequests++;
      }
    }
    const userPool = Array.from(userSet);
    return { actionStats, userStats, userPool };
  }, [responses, n]);

  const paginatedUsers = useMemo(() => {
    if (!stats.userPool) return [];
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return stats.userPool.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [stats.userPool, currentPage]);

  const handleUserClick = (userId) => {
    const userLogs = responses.filter((res) => (res?.userId || "Unknown") === userId);
    setSelectedUserId(userId);
    // **THE FIX IS HERE**: Pass the correctly nested response object to the modal
    setSelectedUserLogs(userLogs.map(log => log.response)); 
    setIsModalOpen(true);
  };

  const handleActionClick = (action) => {
    const actionLogs = responses.filter((res) => getAction(res) === action);
    setSelectedAction(action);
    // **THE FIX IS HERE**: Pass the correctly nested response object to the modal
    setSelectedActionLogs(actionLogs.map(log => log.response));
    setIsActionModalOpen(true);
  };

  return (
    <>
      <Panel title="Transaction Response Statistics">
        <div className="space-y-8">
          <div>
            <h3 className="text-slate-300 font-semibold mb-3 text-lg">Action Summary</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="h-full">
                <ActionPieChart stats={stats.actionStats} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {ACTIONS.map((action) => (
                  <StatCard
                    key={action}
                    label={action}
                    value={stats.actionStats[action] || 0}
                    color={getActionColor(action)}
                    onClick={() => handleActionClick(action)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-slate-300 font-semibold mb-3 text-lg">Per-User Stats</h3>
            <div className="overflow-x-auto bg-slate-900/50 rounded-lg border border-slate-700/50">
              <table className="min-w-full text-sm text-slate-200">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">User ID</th>
                    <th className="px-4 py-3 text-center font-semibold">Total</th>
                    <th className="px-4 py-3 text-center font-semibold">Avg. Risk Score</th>
                    {ACTIONS.map((action) => (
                      <th key={action} className="px-4 py-3 text-center font-semibold">{action}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedUsers.map((userId) => (
                    <tr
                      key={userId}
                      className="hover:bg-slate-800/40 cursor-pointer"
                      onClick={() => handleUserClick(userId)}
                    >
                      <td className="px-4 py-3 font-mono text-left">{userId}</td>
                      <td className="px-4 py-3 text-center font-semibold text-white">{stats.userStats[userId].total}</td>
                      <td className="px-4 py-3 text-center font-semibold text-white">
                        {stats.userStats[userId].scoredRequests > 0
                          ? (stats.userStats[userId].totalScore / stats.userStats[userId].scoredRequests).toFixed(1)
                          : "N/A"}
                      </td>
                      {ACTIONS.map((action) => (
                        <td key={action} className="px-4 py-3 text-center">{stats.userStats[userId][action]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={stats.userPool.length}
              itemsPerPage={USERS_PER_PAGE}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </Panel>

      <UserLogsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        logs={selectedUserLogs}
        userId={selectedUserId}
      />
      <UserLogsModal
        isOpen={isActionModalOpen}
        onClose={() => setIsActionModalOpen(false)}
        logs={selectedActionLogs}
        userId={selectedAction}
        title={
          <>
            Logs for Action:{" "}
            <span className="font-mono text-cyan-400">{selectedAction}</span>
          </>
        }
      />
    </>
  );
};

export default TransactionResponseStatsPanel;
