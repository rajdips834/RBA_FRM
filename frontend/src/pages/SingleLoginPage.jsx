import React, { useState, useEffect, useContext } from "react";
import { Send } from "lucide-react";
import SingleLoginDevicePanel from "../components/SingleDevicePanel";
import LoginConfigPanel from "../login_components/LoginConfigPanel";
import { buildLoginPayload } from "../utils/login_utils/buildLoginPayload";
import CodePanel from "../components/CodePanel";
import { getISODateTime } from "../utils/dateUtils";
import { generateRandomDevice } from "../utils/deviceRandomizer";
import ResponseDetails from "../components/ResponseDetails";
import { GlobalContext } from "../context/GlobalContext";
import LoginResponseDetails from "../login_components/LoginResponseDetails";
import { convertDeviceType } from "../utils/urlUtils";
import { addDeviceProfiles, fetchDeviceDetails } from "../utils/deviceDetails";

function SingleLoginPage({
  userId,
  sendRequest,
  deviceType,
  apiResponse,
  setApiResponse,
}) {
  const { deviceDetails, setDeviceDetails, users } = useContext(GlobalContext);
  const [finalPayload, setFinalPayload] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [deviceData, setDeviceData] = useState(
    generateRandomDevice(deviceType)
  );
  const [loginData, setLoginData] = useState({
    timestamp: getISODateTime(),
    time_taken_to_complete_login: 5,
    city: "Mumbai",
    country: "India",
    vpn_check: "0",
    time_zone: "asia/calcutta",
  });

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

  useEffect(() => {
    const updatePayload = async () => {
      const payload = await buildLoginPayload(deviceData, loginData, userId);
      setFinalPayload(payload);
      // console.log("Final Payload:", finalPayload);
    };
    updatePayload();
  }, [deviceData, loginData, userId]);

  return (
    <div className="flex flex-col w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full">
        <div className="space-y-8">
          <SingleLoginDevicePanel
            deviceType={deviceType}
            deviceData={deviceData}
            setDeviceData={setDeviceData}
            userId={userId}
          />
          <LoginConfigPanel loginData={loginData} setLoginData={setLoginData} />
        </div>
        <div className="sticky top-28 self-start space-y-4">
          <CodePanel
            title="Live Payload Preview"
            content={{ ...finalPayload }}
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
          <LoginResponseDetails apiResponse={apiResponse.response} />
        </div>
      )}
    </div>
  );
}

export default SingleLoginPage;
