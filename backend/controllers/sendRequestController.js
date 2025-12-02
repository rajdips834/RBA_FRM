import axios from "axios";
import { logger } from "../utils/logger.js";

function getRequestTime() {
  const pad = (n) => String(n).padStart(2, "0");
  const date = new Date();
  const yyyy = date.getFullYear();
  const MM = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());
  const SSS = String(date.getMilliseconds()).padStart(3, "0");
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}.${SSS}`;
}

function getRandomStatus() {
  return Math.random() < 0.9 ? 1 : 2;
}

export const sendRequestHandler = async (req, res) => {
  const { targetUrl, payload, headers } = req.body;

  try {
    if (!targetUrl) {
      throw new Error("Target URL is required");
    }

    // TEMPORARY: Mock mode for testing when API is not configured
    const useMockMode = process.env.USE_MOCK_MODE === "true";
    
    if (useMockMode) {
      // Return mock successful response
      const mockResponse = {
        resultMessage: "Transaction processed successfully",
        resultCode: "0000",
        timestamp: new Date().toISOString(),
        resultData: {
          riskScore: Math.floor(Math.random() * 100),
          decision: Math.random() > 0.7 ? "APPROVE" : "REVIEW",
          transactionId: payload.transactionDetails.transactionId,
          userId: payload.userDetails.user_id,
          paymentMode: payload.transactionDetails.payment_mode,
          riskFactors: [
            "Standard device profile",
            "Normal transaction pattern",
            "Verified location"
          ]
        }
      };
      
      logger.logRequest({ url: targetUrl, payload }, mockResponse);
      return res.json({ success: true, response: mockResponse });
    }

    const response = await axios.post(targetUrl, payload, { headers });
    const axiomUrl = process.env.AXIOM_URL;
    if (response.data?.resultMessage === "Required MFA approval"|| response.data?.resultData?.action === "Require MFA") {
      const trackingId = response.data?.resultData?.trackingId;
      const [baseUrl, queryString] = targetUrl.split("?");
      const params = new URLSearchParams(queryString);
      const userId = params.get("userId");
      const deviceType = params.get("deviceType") || "3";
      const requestTime = encodeURIComponent(getRequestTime());
      const status = getRandomStatus();
      const accountId = process.env.ACCOUNT_ID;

      const mfaUrl = `${axiomUrl}/FRM/updateMFAStatus?deviceType=${deviceType}&requestTime=${requestTime}&status=${status}&trackingId=${trackingId}&userId=${userId}&accountId=${accountId}`;
      const jwtUrl = `${axiomUrl}/adaptivetoken/getJWTToken?requestTime=${requestTime}&userId=${userId}`;
      let jwtToken;
      try {
        const jwtResponse = await axios.post(jwtUrl);
        jwtToken = jwtResponse.data.resultData;
      } catch (jwtError) {
        console.error("Error fetching JWT token:", jwtError);
      }

      try {
        const response2 = await axios.post(
          mfaUrl,
          {},
          {
            headers: {
              AuthToken: `${jwtToken}`,
            },
          }
        );
        console.log(
          "[MFA response] :",
          response2.data.resultMessage,
          "for",
          userId,
          "to",
          status
        );
        // logger.logRequest({ url: mfaUrl }, response2.data);
      } catch (mfaError) {
        const mfaErrorResponse = mfaError.response
          ? mfaError.response.data
          : { message: mfaError.message };
        logger.logRequest({ url: mfaUrl }, mfaErrorResponse, true);
      }
    }

    logger.logRequest({ url: targetUrl, payload }, response.data);
    res.json({ success: true, response: response.data });
  } catch (error) {
    const errorResponse = error.response
      ? error.response.data
      : { message: error.message };

    logger.logRequest(
      { url: targetUrl, payload, headers },
      errorResponse,
      true
    );

    res
      .status(error.response?.status || 500)
      .json({ success: false, error: errorResponse });
  }
};
