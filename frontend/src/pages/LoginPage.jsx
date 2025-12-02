import React, { useState, useEffect, useCallback } from "react";
import SingleLoginPage from "./SingleLoginPage";
import MultiLoginPage from "./MultiLoginPage";
import { Server } from "lucide-react";
import apiClient from "../utils/apiClient";
import Panel from "../components/core/Panel";
import LogsPanel from "../components/LogsPanel";
import DeviceTypeSelector from "../components/DeviceTypeSelector";
import {
  fetchToken,
  fetchUsers,
  fetchDeviceDetails,
} from "../utils/userDataLogic";
import {
  parseQueryParams,
  reconstructUrl,
  formatRequestTime,
  convertDeviceType,
} from "../utils/urlUtils";

import UrlConfigurator from "../components/UrlConfigurator";
import { GlobalContext } from "../context/GlobalContext";

function LoginPage() {
  let initialApiUrl = `${
    import.meta.env.VITE_LOGIN_URL
  }userId=Test017&accountId=${
    import.meta.env.VITE_ACCOUNT_ID
  }&deviceType=3&requestTime=${formatRequestTime()}`;
  const [mode, setMode] = useState("single");
  const [deviceType, setDeviceType] = useState("web"); // web, android, ios
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [apiUrl, setApiUrl] = useState(initialApiUrl);
  const [token, setToken] = useState("");
  const [deviceDetails, setDeviceDetails] = useState({});

  // Response data stored locally in LoginPage
  const [singleLoginResponse, setSingleLoginResponse] = useState(null);
  const [multiLoginResponses, setMultiLoginResponses] = useState([]);
  const [multiLoginTotalRequests, setMultiLoginTotalRequests] = useState(0);

  const { params: apiParams } = parseQueryParams(apiUrl);
  const userId = apiParams.userId;

  useEffect(() => {
    fetchDeviceDetails(setDeviceDetails);
  }, []);

  useEffect(() => {
    fetchToken(setToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers(token, setUsers);
    }
  }, [token]);

  const fetchLogs = useCallback(async () => {
    try {
      const { data } = await apiClient.get("/api/logs");
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const sendRequest = useCallback(
    async (payload) => {
      try {
        let targetUrl = apiUrl;
        // console.log("Sending request to:", targetUrl);
        let user = payload.userDetails.user_id;
        // console.log("Sending request for user:", user);
        const { baseUrl, params: currentParams } = parseQueryParams(apiUrl);
        const newParams = {
          ...currentParams,
          deviceType: convertDeviceType(payload.deviceDetails.device_type),
          requestTime: formatRequestTime(),
          userId: user,
        };
        targetUrl = reconstructUrl(baseUrl, newParams);

        const requestData = {
          targetUrl,
          payload,
        };

        const res = await apiClient.post("/api/send-request", requestData);
        fetchLogs();
        return res.data;
      } catch (error) {
        const errorData = error.response
          ? error.response.data
          : { message: error.message };
        fetchLogs();
        return errorData;
      }
    },
    [apiUrl, fetchLogs]
  );

  return (
    <GlobalContext.Provider
      value={{
        mode,
        setMode,
        apiUrl,
        setApiUrl,
        sendRequest,
        logs,
        fetchLogs,
        token,
        users,
        setUsers,
        deviceDetails,
        setDeviceDetails,
        deviceType,
        setDeviceType,
      }}
    >
      <div className="bg-slate-900 text-slate-200 min-h-screen font-sans">
        <header className="bg-slate-900/70 backdrop-blur-lg p-4 border-b border-slate-700 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Server size={20} className="text-cyan-400" />
              Login Testing
            </h1>
            <ModeToggle mode={mode} onToggle={setMode} />
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-4 md:p-8">
          <Panel
            title="API URL & Bulk User Tools"
            children={<UrlConfigurator apiUrl={apiUrl} setApiUrl={setApiUrl} />}
          />
          <div className="mb-4" />
          <DeviceTypeSelector
            deviceType={deviceType}
            setDeviceType={setDeviceType}
          />
          <div className="mb-6" />
          {mode === "single" ? (
            <SingleLoginPage
              userId={userId}
              sendRequest={sendRequest}
              deviceType={deviceType}
              apiResponse={singleLoginResponse}
              setApiResponse={setSingleLoginResponse}
            />
          ) : (
            <MultiLoginPage
              sendRequest={sendRequest}
              deviceType={deviceType}
              allResponses={multiLoginResponses}
              setAllResponses={setMultiLoginResponses}
              totalRequests={multiLoginTotalRequests}
              setTotalRequests={setMultiLoginTotalRequests}
            />
          )}
          <div className="mt-8">
            <LogsPanel logs={logs} />
          </div>
        </main>
      </div>
    </GlobalContext.Provider>
  );
}

function ModeToggle({ mode, onToggle }) {
  return (
    <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-lg">
      <button
        onClick={() => onToggle("single")}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          mode === "single"
            ? "bg-cyan-600 text-white"
            : "text-slate-400 hover:bg-slate-700"
        }`}
      >
        Single Login
      </button>
      <button
        onClick={() => onToggle("multi")}
        className={`px-3 py-1 text-sm rounded-md transition-colors ${
          mode === "multi"
            ? "bg-cyan-600 text-white"
            : "text-slate-400 hover:bg-slate-700"
        }`}
      >
        Multi Login
      </button>
    </div>
  );
}

export default LoginPage;
