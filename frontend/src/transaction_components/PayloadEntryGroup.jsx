import React, { useState, useEffect, useCallback } from "react";
import RequestConfigPanel from "./RequestConfigPanel";
import ChannelFieldEditor from "./ChannelFieldEditor";
import CodePanel from "../components/CodePanel";
import { generateRandomPaymentChannelData } from "../utils/paymentChannelRandomizer";
import { getISODateTime } from "../utils/dateUtils";
import { buildTempTxnPayload } from "../utils/payloadUtils";

const PayloadEntryGroup = ({
  onSave,
  onCancel,
  maxAddableCount,
  initialData,
  isMultiRequest = false,
}) => {
  const isEditing = !!initialData;
  const [txnData, setTxnData] = useState(
    initialData && initialData.payload && initialData.payload.txnData
      ? { ...initialData.payload.txnData }
      : {
          time_taken_to_complete_transaction_min: 15,
          time_taken_to_complete_transaction_max: 45,
          transaction_amount_min: 500,
          transaction_amount_max: 5000,
          timestamp_start: getISODateTime(),
          timestamp_end: getISODateTime(),
          transaction_currency: "INR",
          transaction_type: "upi",
          transaction_category: "Transfer",
          city: "Mumbai",
          country: "India",
          vpn_check: "0",
          time_zone: "asia/calcutta",
        }
  );
  const [channelFields, setChannelFields] = useState(
    initialData && initialData.payload && initialData.payload.channelData
      ? { ...initialData.payload.channelData }
      : {
          recipient_account_no: "Not Applicable",
          recipient_bank_name: "Not Applicable",
          recipient_ifsc_code: "Not Applicable",
          bank_name: "Not Applicable",
          account_no: "Not Applicable",
          ifsc_code: "Not Applicable",
          recipient_upi_id: "anubhav@oksbi",
          sender_upi_id: "bb@okpbi",
          credit_card_no: "Not Applicable",
          credit_card_expiry: "Not Applicable",
          credit_card_cvv: "Not Applicable",
          debit_card_no: "Not Applicable",
          debit_card_expiry: "Not Applicable",
          debit_card_cvv: "Not Applicable",
          // ATM specific fields
          branch_code: "Not Applicable",
          number_of_pin_tries: "Not Applicable",
          atm_id: "Not Applicable",
          cash_dispenser_status: "Not Applicable",
        }
  );
  const [count, setCount] = useState(initialData?.count || 1);
  const [tempPayload, setTempPayload] = useState({});

  const handleRandomizeFields = () => {
    if (txnData.transaction_type) {
      const randomData = generateRandomPaymentChannelData(
        txnData.transaction_type
      );
      setChannelFields(randomData);
    }
  };

  useEffect(() => {
    async function updatePreview() {
      const payload = await buildTempTxnPayload(txnData, channelFields);
      setTempPayload(payload);
    }
    updatePreview();
  }, [txnData, channelFields]);

  useEffect(() => {
    if (maxAddableCount !== undefined && count > maxAddableCount) {
      setCount(maxAddableCount > 0 ? maxAddableCount : 1);
    }
  }, [maxAddableCount, count]);

  const handleSaveClick = () => {
    if (count > 0) {
      const payload = tempPayload;
      if (typeof onSave === "function") {
        onSave({ payload, count });
      }
    } else {
      alert("Request count must be greater than 0.");
    }
  };

  return (
    <div className="space-y-4 p-4 border border-slate-700 rounded-xl bg-slate-900/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-8">
          <RequestConfigPanel
            txnData={txnData}
            setTxnData={setTxnData}
            isMultiRequest={isMultiRequest}
          />
          <ChannelFieldEditor
            paymentMode={txnData.transaction_type}
            channelData={channelFields}
            onFieldsChange={setChannelFields}
            onRandomize={handleRandomizeFields}
          />
        </div>
        <CodePanel title="Live Payload Preview" content={tempPayload} />
      </div>

      {/* Controls row: always at the bottom, full width */}
      <div className="flex flex-col md:flex-row items-end gap-4 pt-4 mt-4 border-t border-slate-700">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            How many requests should use this payload?
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={maxAddableCount > 0 ? maxAddableCount : 1}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 bg-{slate-700/50}"
              style={{ accentColor: "#06b6d4" }}
              disabled={maxAddableCount <= 0 && !isEditing}
            />
            <span className="text-sm font-mono w-12 text-center">{count}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          {isEditing && (
            <button
              onClick={onCancel}
              type="button"
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSaveClick}
            disabled={maxAddableCount <= 0 && !isEditing}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEditing ? "Update Batch" : "Add Batch"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayloadEntryGroup;
