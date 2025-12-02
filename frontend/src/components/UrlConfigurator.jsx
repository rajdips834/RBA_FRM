import React, { useEffect, useMemo, useState, useContext } from "react";
import { parseQueryParams, reconstructUrl } from "../utils/urlUtils";
import { GlobalContext } from "../context/GlobalContext";
import BulkUserUploader from "./BulkUserUploader";
import ClearUserHistoryButton from "./ClearUserHistoryButton";

const UrlConfigurator = ({ apiUrl, setApiUrl }) => {
  const { users, token } = useContext(GlobalContext);
  const { baseUrl, params } = useMemo(() => parseQueryParams(apiUrl), [apiUrl]);
  const [base, setBase] = useState(baseUrl);
  const [queryParams, setQueryParams] = useState(params);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const newUrl = reconstructUrl(base, queryParams);
    setApiUrl(newUrl);
    // userId = queryParams.userId;
  }, [base, queryParams, setApiUrl]);

  const handleParamChange = (key, value) => {
    setQueryParams((prev) => ({ ...prev, [key]: value }));
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    if (searchTerm === "") return users;
    return users.filter((user) =>
      user.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const renderParamInput = (key, value) => {
    if (key === "userId") {
      return (
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleParamChange(key, e.target.value);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            placeholder="Search users..."
            className="w-full p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-lg bg-slate-800 border border-slate-700">
              {filteredUsers.map((user, item) => (
                <div
                  key={item}
                  onClick={() => {
                    handleParamChange(key, user);
                    setSearchTerm("");
                    setIsDropdownOpen(false);
                  }}
                  className="p-2 hover:bg-slate-700 cursor-pointer text-slate-300"
                >
                  {user}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    // For modal, reuse this input
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleParamChange(key, e.target.value)}
        className="w-full p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-2">
          URL Parameters
        </h3>
        <div className="flex items-end gap-2">
          {Object.entries(queryParams)
            .filter(([key]) => key === "userId")
            .map(([key, value]) => (
              <div key={key} className="flex flex-col flex-1">
                <label className="text-xs text-slate-400 mb-1">{key}</label>
                {renderParamInput(key, value)}
              </div>
            ))}
          <BulkUserUploader />
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 bg-slate-700 text-white rounded-md text-sm hover:bg-slate-600"
          >
            Show More
          </button>
          <ClearUserHistoryButton users={users} token={token} />
        </div>
      </div>

      {/* Modal for other query params */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center min-h-screen"
          style={{
            background: "rgba(0,0,0,0.45)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-900 rounded-lg p-6 w-full max-w-md shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold text-slate-200 mb-4">
              Other Query Parameters
            </h3>
            <div className="space-y-3">
              {Object.entries(queryParams)
                .filter(([key]) => key !== "userId")
                .map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="flex flex-col flex-1">
                      <label className="text-xs text-slate-400 mb-1">
                        {key}
                      </label>
                      {renderParamInput(key, value)}
                    </div>
                    <button
                      onClick={() => {
                        const newParams = { ...queryParams };
                        delete newParams[key];
                        setQueryParams(newParams);
                      }}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
            <button
              onClick={() => {
                const newKey = prompt("Enter new parameter name:");
                if (!newKey) return;
                if (queryParams.hasOwnProperty(newKey)) {
                  alert("This parameter already exists.");
                  return;
                }
                setQueryParams((prev) => ({ ...prev, [newKey]: "" }));
              }}
              className="mt-4 px-3 py-1 bg-cyan-700 text-white rounded-md text-sm hover:bg-cyan-600"
            >
              + Add Parameter
            </button>
          </div>
        </div>
      )}

      {/* <div className="text-xs text-slate-500 mt-4 break-all">
        <strong>Final API URL:</strong> {apiUrl}
      </div> */}
    </div>
  );
};

export default UrlConfigurator;
