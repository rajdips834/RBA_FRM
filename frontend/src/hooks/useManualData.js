import { useState } from "react";
import { getISODateTime} from "../utils/dateUtils";

const useManualData = (initialData) => {
  const [manualData, setManualData] = useState(
    initialData || {
      payment_mode: "upi",
      transaction_type: "Transfer",
      timestamp: getISODateTime(),
      user_id: "user-123",
      transaction_amount: "100.00",
      recipient_details: "recipient-abc",
      city: "Mumbai",
      type: 2,
      vpn_check: "0",
      state: "Maharashtra",
      country: "India",
      time_zone: "asia/calcutta",
      transaction_amount_min: "50.00",
      transaction_amount_max: "5000.00",
      timestamp_start: getISODateTime(),
      timestamp_end: getISODateTime(),
    }
  );
  const handleTransactionAmountChange = (e) => {
    setManualData((prev) => ({
      ...prev,
      transaction_amount:
        Math.random() *
          (parseFloat(prev.transaction_amount_max) -
            parseFloat(prev.transaction_amount_min)) +
        parseFloat(prev.transaction_amount_min),
    }));
  };

  const handleManualDataChange = (e) => {
    const { name, value } = e.target;
    // console.log(manualData);
    setManualData((prev) => ({ ...prev, [name]: value }));
  };

  return {
    manualData,
    handleManualDataChange,
    setManualData,
    handleTransactionAmountChange,
  };
};

export default useManualData;
