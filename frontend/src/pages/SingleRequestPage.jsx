import React, { useState, useEffect, useContext } from "react";
import { Send } from "lucide-react";

import RequestConfigPanel from "../transaction_components/RequestConfigPanel";
import ChannelFieldEditor from "../transaction_components/ChannelFieldEditor";
import SingleDevicePanel from "../components/SingleDevicePanel";
import { GlobalContext } from "../context/GlobalContext";
import { buildPayload } from "../utils/payloadUtils";
import { generateRandomPaymentChannelData } from "../utils/paymentChannelRandomizer";
import CodePanel from "../components/CodePanel";
import ResponseDetails from "../components/ResponseDetails";
import { getISODateTime } from "../utils/dateUtils";
import { generateRandomDevice } from "../utils/deviceRandomizer";
import { addDeviceProfiles, fetchDeviceDetails } from "../utils/deviceDetails";
import { convertDeviceType } from "../utils/urlUtils";

const SingleRequestPage = ({
  userId,
  sendRequest,
  deviceType,
  apiResponse,
  setApiResponse,
}) => {
  const { deviceDetails, setDeviceDetails, users } = useContext(GlobalContext);
  const [deviceData, setDeviceData] = useState(
    generateRandomDevice(deviceType)
  );

  useEffect(() => {
    const fetchData = async () => {
      const hasDeviceDetails =
        deviceDetails && Object.keys(deviceDetails).length > 0;

      // Check if users have been loaded and userId is in the valid users pool
      const isValidUser = users && users.length > 0 && users.includes(userId);

      if (hasDeviceDetails) {
        if (!deviceDetails[userId]) {
          if (isValidUser) {
            console.log(
              "User not found in device details but is valid, adding..."
            );
            await addDeviceProfiles([userId]);
            let data = await fetchDeviceDetails(setDeviceDetails);
            setDeviceData({
              ...data[userId][convertDeviceType(deviceType) - 1],
            });
          }
        } else {
          setDeviceData({
            ...deviceDetails[userId][convertDeviceType(deviceType) - 1],
          });
        }
      } else if (users && users.length > 0) {
        // Device details not loaded yet, but we can check if user is valid
        if (isValidUser) {
          console.log("User is valid but device details are not loaded");
        }
      } else {
        console.log("Device details and users not loaded yet");
      }
    };

    fetchData();
  }, [deviceDetails, userId, deviceType, users]);

  const [txnData, setTxnData] = useState({
    transaction_type: "upi",
    transaction_category: "Transfer",
    timestamp: getISODateTime(),
    transaction_amount: "100.00",
    recipient_details: "recipient-abc",
    city: "Mumbai",
    country: "India",
    vpn_check: 0,
    time_zone: "asia/calcutta",
    time_taken_to_complete_transaction: 5,
    transaction_currency: "INR",
  });

  const [channelFields, setChannelFields] = useState({});
  const [finalPayload, setFinalPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const updatePayload = async () => {
      const payload = await buildPayload(
        deviceData,
        txnData,
        channelFields,
        userId
      );
      setFinalPayload(payload);
    };
    updatePayload();
  }, [deviceData, txnData, channelFields, userId]);

  const handleSendRequest = async () => {
    setIsLoading(true);
    setApiResponse(null);

    try {
      const res = await sendRequest(finalPayload, true);
      setApiResponse(res);
    } catch (error) {
      setApiResponse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
        <div className="space-y-8">
          <SingleDevicePanel
            deviceData={deviceData}
            setDeviceData={setDeviceData}
            userId={userId}
            deviceType={deviceType}
          />
          <RequestConfigPanel txnData={txnData} setTxnData={setTxnData} />
          <ChannelFieldEditor
            paymentMode={txnData.transaction_type}
            channelData={channelFields}
            onFieldsChange={setChannelFields}
            onRandomize={() => {
              if (txnData.transaction_type) {
                const randomData = generateRandomPaymentChannelData(
                  txnData.transaction_type
                );
                setChannelFields(randomData);
              }
            }}
          />
        </div>
        <div className="sticky top-28 self-start space-y-4">
          <CodePanel
            title="Live Payload Preview"
            content={{
              ...finalPayload,
            }}
          />
          <button
            onClick={handleSendRequest}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-cyan-900/50 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>
      </div>
      {apiResponse && (
        <div className="w-full mt-8">
          <ResponseDetails apiResponse={apiResponse.response} />
        </div>
      )}
    </div>
  );
};

export default SingleRequestPage;
