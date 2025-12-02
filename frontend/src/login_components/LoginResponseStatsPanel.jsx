import React, { useMemo, useState } from "react";
import Panel from "../components/core/Panel";
import ActionPieChart from "./ActionPieChart";
import UserLogsModal from "./UserLogsModal";
import Pagination from "../components/core/Pagination"; // RESTORED: Pagination import

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

// CLEANUP: Moved getAction outside the component so it's not redefined multiple times.
const getAction = (r) => {
  if (r && r.resultMessage?.includes("User authenticate successfully.")) return "Bypass MFA";
  if (r && r.resultMessage?.includes("Login successfull.User authenticate.")) return "Bypass MFA";
  if (r && r.resultMessage?.includes("resultData is null")) return "NA";
  if (r && r.resultData && r.resultData.action) return r.resultData.action;
  if (!r || (!r.resultData && !!r.resultMessage)) return "Decline Request";
  return "NA";
};

const LoginResponseStatsPanel = ({ responses, n }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserLogs, setSelectedUserLogs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedActionLogs, setSelectedActionLogs] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);

  // RESTORED: State and constants for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

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
      if (res?.resultData?.riskScore != null) {
        const riskScore = Number(res.resultData.riskScore);
        userStats[userId].totalScore += riskScore;
        userStats[userId].scoredRequests++;
      }
    }
    const userPool = Array.from(userSet);
    return { actionStats, userStats, userPool };
  }, [responses, n]);

  // RESTORED: Calculation for the currently visible users on the page
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return stats.userPool.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [stats.userPool, currentPage]);

  const handleUserClick = (userId) => {
    const userLogs = responses.filter((res) => (res?.userId || "Unknown") === userId);
    setSelectedUserId(userId);
    setSelectedUserLogs(userLogs);
    setIsModalOpen(true);
  };

  const handleActionClick = (action) => {
    const actionLogs = responses.filter((res) => getAction(res) === action);
    setSelectedAction(action);
    setSelectedActionLogs(actionLogs);
    setIsActionModalOpen(true);
  };

  return (
    <>
      <Panel title="Response Statistics">
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
                  {/* CHANGED: Map over the paginated user list */}
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
        userId={selectedAction} // Note: This passes the action name as the 'userId' prop for the title
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

export default LoginResponseStatsPanel;