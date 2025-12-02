import React, { useState, useContext } from "react";
import PayloadEntryGroup from "../transaction_components/PayloadEntryGroup";
import MultiReqConfigPanel from "../components/MultiReqConfigPanel";
import { Send } from "lucide-react";
import PayloadBatchesPanel from "../components/PayloadBatchesPanel";
import { calculateDispatchTimes } from "../utils/multiRequestPageUtils";
import { selectRandomUsers } from "../utils/userRandomizer";
import { GlobalContext } from "../context/GlobalContext";
import { parseQueryParams } from "../utils/urlUtils";
import {
  handleSaveBatch as handleSaveBatchUtil,
  handleAddNewGroup as handleAddNewGroupUtil,
  handleCancelEdit as handleCancelEditUtil,
  handleDeleteBatch as handleDeleteBatchUtil,
  handleStartEdit as handleStartEditUtil,
} from "../utils/payloadBatchUtils";
import { buildPayload, createFraudTxnPayloads } from "../utils/payloadUtils";
import { convertDeviceType } from "../utils/urlUtils";
import TransactionResponseStatsPanel from "../transaction_components/TransactionResponseStatsPanel";

const MultiRequestPage = ({
  sendRequest,
  deviceType,
  allResponses,
  setAllResponses,
  totalRequests: propTotalRequests,
  setTotalRequests: setPropTotalRequests,
}) => {
  const { users, apiUrl, deviceDetails, setDeviceDetails } =
    useContext(GlobalContext);
  const [dispatchStrategy, setDispatchStrategy] = useState("interval");
  const [totalRequests, setTotalRequests] = useState(10);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [interval, setInterval] = useState(1000);
  const [payloadBatches, setPayloadBatches] = useState([]);
  const [showNewGroup, setShowNewGroup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBatchIndex, setEditingBatchIndex] = useState(null);

  const totalBatchedCount = payloadBatches.reduce(
    (sum, batch) => sum + batch.count,
    0
  );
  const [fraud, _setFraud] = useState(0);
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
  function getBaseTxnData() {
    return payloadBatches[0]?.payload || {};
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
        const loginPayload = await buildPayload(
          deviceData,
          payload.txnData,
          payload.channelData,
          userId,
          true
        );
        normalPayloads.push(loginPayload);
        if (payload.txnData.city)
          usedCities.add(payload.txnData.city.toLowerCase());
        if (payload.txnData.country)
          usedCountries.add(payload.txnData.country.toLowerCase());
        userIdx++;
      }
    }

    let maxTimeTaken = 30;
    let maxAmount = 50000;
    if (normalPayloads.length > 0) {
      maxTimeTaken = Math.max(
        ...normalPayloads.map((p) => {
          if (
            p &&
            p.transactionDetails &&
            typeof p.transactionDetails.time_taken_to_complete_transaction ===
              "number"
          ) {
            return p.transactionDetails.time_taken_to_complete_transaction;
          }
          // fallback to 0 if not found
          return 0;
        })
      );
      maxAmount = Math.max(
        ...normalPayloads.map((p) => {
          if (
            p &&
            p.transactionDetails &&
            typeof p.transactionDetails.transaction_amount === "number"
          ) {
            return p.transactionDetails.transaction_amount;
          }
          // fallback to 0 if not found
          return 0;
        })
      );
    }

    const fraudPayloads = await createFraudTxnPayloads({
      numFraudRequests,
      baseTxnData: getBaseTxnData(),
      usedCities: Array.from(usedCities),
      usedCountries: Array.from(usedCountries),
      maxTimeTaken,
      maxAmount,
      useRandomUsers,
      deviceType,
      selectedRandomUsers,
      urlUserId,
    });

    const allPayloads = [...normalPayloads, ...fraudPayloads];
    for (let i = allPayloads.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPayloads[i], allPayloads[j]] = [allPayloads[j], allPayloads[i]];
    }

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
    const requests = allPayloads.map((basePayload, index) => {
      return async () => {
        if (dispatchStrategy !== "immediate") {
          const delay = dispatchTimes[index] - Date.now();
          await new Promise((resolve) =>
            setTimeout(resolve, Math.max(0, delay))
          );
        }
        const resp = await sendRequest(basePayload);
        const user =
          basePayload && basePayload.userDetails
            ? basePayload.userDetails.user_id
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
        PayloadEntryGroupComponent={PayloadEntryGroup}
      />
      <button
        onClick={handleSend}
        disabled={isLoading || payloadBatches.length === 0}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {allResponses.length > 0 && (
        <div className="mt-8">
          <TransactionResponseStatsPanel
            responses={allResponses}
            n={totalRequests}
          />
        </div>
      )}
    </div>
  );
};

export default MultiRequestPage;
