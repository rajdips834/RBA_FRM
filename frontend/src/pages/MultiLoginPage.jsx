import React, { useState, useContext, useEffect } from "react";
import { Send } from "lucide-react";
import { calculateDispatchTimes } from "../utils/multiRequestPageUtils";
import { generateRandomDevice } from "../utils/deviceRandomizer";
import { selectRandomUsers } from "../utils/userRandomizer";
import { GlobalContext } from "../context/GlobalContext";
import { parseQueryParams } from "../utils/urlUtils";
import { buildLoginPayload } from "../utils/login_utils/buildLoginPayload";
import { createFraudLoginPayloads } from "../utils/login_utils/fraudLoginUtils";
import {
  handleSaveBatch as handleSaveBatchUtil,
  handleAddNewGroup as handleAddNewGroupUtil,
  handleCancelEdit as handleCancelEditUtil,
  handleDeleteBatch as handleDeleteBatchUtil,
  handleStartEdit as handleStartEditUtil,
} from "../utils/payloadBatchUtils";
import { convertDeviceType } from "../utils/urlUtils";
import { addDeviceProfiles, fetchDeviceDetails } from "../utils/deviceDetails";
import MultiReqConfigPanel from "../components/MultiReqConfigPanel";
import PayloadBatchesPanel from "../components/PayloadBatchesPanel";
import LoginPayloadEntryGroup from "../login_components/LoginPayloadEntryGroup";
import LoginResponseStatsPanel from "../login_components/LoginResponseStatsPanel";

function MultiLoginPage({
  sendRequest,
  deviceType,
  allResponses,
  setAllResponses,
  totalRequests: propTotalRequests,
  setTotalRequests: setPropTotalRequests,
}) {
  const { users, apiUrl, deviceDetails, setDeviceDetails } =
    useContext(GlobalContext);
  const [dispatchStrategy, setDispatchStrategy] = useState("interval");
  const [totalRequests, setTotalRequests] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [fraud, _setFraud] = useState(0);
  const [interval, setInterval] = useState(1000);
  const [payloadBatches, setPayloadBatches] = useState([]);
  const [showNewGroup, setShowNewGroup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBatchIndex, setEditingBatchIndex] = useState(null);
  const [numUsers, _setNumUsers] = useState(1);

  const setFraud = (val) => {
    const nextVal = typeof val === "function" ? val(fraud) : val;
    _setFraud(Math.max(0, Math.min(nextVal, totalRequests)));
  };
  const setNumUsers = (val) => {
    const maxUsers = users?.length || 1;
    const nextVal = typeof val === "function" ? val(numUsers) : val;
    _setNumUsers(Math.max(1, Math.min(nextVal, maxUsers)));
  };
  const totalBatchedCount = payloadBatches.reduce(
    (sum, batch) => sum + batch.count,
    0
  );

  const handleSaveBatch = (batch) => {
    const maxNormal = totalRequests - fraud;
    handleSaveBatchUtil({
      batch,
      editingBatchIndex,
      payloadBatches,
      totalBatchedCount,
      totalRequests: maxNormal,
      setPayloadBatches,
      setEditingBatchIndex,
      setShowNewGroup,
    });
  };
  const handleCancelEdit = () =>
    handleCancelEditUtil({ setEditingBatchIndex, setShowNewGroup });
  const handleDeleteBatch = (index) =>
    handleDeleteBatchUtil({
      index,
      payloadBatches,
      setPayloadBatches,
      editingBatchIndex,
      setEditingBatchIndex,
    });
  const handleStartEdit = (index) =>
    handleStartEditUtil({ index, setEditingBatchIndex, setShowNewGroup });
  const handleAddNewGroup = () =>
    handleAddNewGroupUtil({ setEditingBatchIndex, setShowNewGroup });

  async function getDeviceDataForUser(userId, deviceType) {
    const hasDeviceDetails =
      deviceDetails && Object.keys(deviceDetails).length > 0;
    const isValidUser = users && users.length > 0 && users.includes(userId);
    let data = deviceDetails;
    if (hasDeviceDetails) {
      if (!deviceDetails[userId]) {
        if (isValidUser) {
          console.log(
            "User not found in device details but is valid, adding..."
          );
          await addDeviceProfiles([userId]);
          data = await fetchDeviceDetails(setDeviceDetails);
          setDeviceDetails(data);
        }
      }
    } else {
      console.log("Device details not loaded yet");
    }

    return data[userId]?.[convertDeviceType(deviceType) - 1];
  }
  function getBaseLoginData() {
    return payloadBatches[0]?.payload?.data || {};
  }

  const handleSend = async () => {
    setIsLoading(true);
    setAllResponses([]);
    setPropTotalRequests(totalRequests);

    const numFraudRequests = fraud;
    const useRandomUsers = numUsers > 1;
    const { params } = parseQueryParams(apiUrl);
    const urlUserId = params.userId;
    const selectedRandomUsers = useRandomUsers
      ? selectRandomUsers(numUsers, users)
      : [];

    let normalPayloads = [];
    let userIdx = 0;
    let usedCities = new Set();
    let usedCountries = new Set();

    for (const { payload, count } of payloadBatches) {
      for (let i = 0; i < count; i++) {
        let userId = useRandomUsers
          ? selectedRandomUsers[userIdx % selectedRandomUsers.length]
          : urlUserId;
        const deviceData = await getDeviceDataForUser(userId, deviceType);
        const loginPayload = await buildLoginPayload(
          deviceData,
          payload.data,
          userId,
          true
        );
        normalPayloads.push(loginPayload);
        if (payload.data.city) usedCities.add(payload.data.city.toLowerCase());
        if (payload.data.country)
          usedCountries.add(payload.data.country.toLowerCase());
        userIdx++;
      }
    }

    // Calculate maxTimeTaken from normalPayloads
    let maxTimeTaken = 15;
    if (normalPayloads.length > 0) {
      maxTimeTaken = Math.max(
        ...normalPayloads.map((p) => {
          // Try to extract time_taken_to_complete_login from payload
          if (
            p &&
            p.deviceDetails &&
            typeof p.deviceDetails.time_taken_to_complete_login === "number"
          ) {
            return p.deviceDetails.time_taken_to_complete_login;
          }
          // fallback to 0 if not found
          return 0;
        })
      );
    }

    const fraudPayloads = await createFraudLoginPayloads({
      numFraudRequests,
      baseLoginData: getBaseLoginData(),
      usedCities: Array.from(usedCities),
      usedCountries: Array.from(usedCountries),
      maxTimeTaken,
      useRandomUsers,
      deviceType,
      selectedRandomUsers,
      urlUserId,
      buildLoginPayload,
      generateRandomDevice,
    });

    const allPayloads = [...normalPayloads, ...fraudPayloads];
    for (let i = allPayloads.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPayloads[i], allPayloads[j]] = [allPayloads[j], allPayloads[i]];
    }

    // Calculate dispatch times
    const dispatchTimes = calculateDispatchTimes(
      dispatchStrategy,
      interval,
      startTime,
      endTime,
      allPayloads
    );
    if (!dispatchTimes) {
      alert("Invalid time range for random dispatch.");
      setIsLoading(false);
      return;
    }

    // Prepare request functions
    const requests = allPayloads.map((payload, index) => {
      return async () => {
        if (dispatchStrategy !== "immediate") {
          const delay = dispatchTimes[index] - Date.now();
          await new Promise((resolve) =>
            setTimeout(resolve, Math.max(0, delay))
          );
        }
        const resp = await sendRequest(payload);
        const user =
          payload && payload.userDetails
            ? payload.userDetails.user_id
            : "Unknown";
        const newResponseObject =
          resp && resp.success && resp.response
            ? { ...resp.response, userId: user }
            : { resultData: null, userId: user };
        return newResponseObject;
      };
    });

    // Run all requests in parallel
    const responses = await Promise.all(requests.map((fn) => fn()));

    setAllResponses(responses);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <MultiReqConfigPanel
        setDispatchStrategy={setDispatchStrategy}
        totalRequests={totalRequests}
        setTotalRequests={setTotalRequests}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        interval={interval}
        setInterval={setInterval}
        dispatchStrategy={dispatchStrategy}
        numUsers={numUsers}
        setNumUsers={setNumUsers}
        fraud={fraud}
        setFraud={setFraud}
      />
      <PayloadBatchesPanel
        payloadBatches={payloadBatches}
        totalBatchedCount={totalBatchedCount}
        totalRequests={totalRequests - fraud}
        editingBatchIndex={editingBatchIndex}
        showNewGroup={showNewGroup}
        handleStartEdit={handleStartEdit}
        handleDeleteBatch={handleDeleteBatch}
        handleSaveBatch={handleSaveBatch}
        handleCancelEdit={handleCancelEdit}
        handleAddNewGroup={handleAddNewGroup}
        PayloadEntryGroupComponent={LoginPayloadEntryGroup}
      />
      <button
        onClick={handleSend}
        disabled={
          isLoading ||
          payloadBatches.length === 0 ||
          totalBatchedCount !== totalRequests - fraud
        }
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
        title={
          totalBatchedCount !== totalRequests - fraud
            ? `Please fill all normal request batches (${
                totalRequests - fraud
              } required, ${totalBatchedCount} filled)`
            : "Send Batch Request"
        }
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span>Sending Batch...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Start Sending {totalRequests} Requests</span>
          </>
        )}
      </button>

      {/* {allResponses.length > 0 && console.log("3. Data being passed to Stats Panel:", allResponses)} */}

      {allResponses.length > 0 && (
        <LoginResponseStatsPanel
          responses={allResponses}
          n={propTotalRequests || totalRequests}
        />
      )}
    </div>
  );
}

export default MultiLoginPage;
