import React, { useState } from "react";
import Input from "../components/core/Input";
import Select from "../components/core/Select";
import Panel from "../components/core/Panel";
import {
  countryCityOptions,
  timezoneOptions,
  currencyOptions,
} from "../data/locationOptions";

const countryOptions = Object.keys(countryCityOptions).map((country) => ({
  value: country,
  label: country,
}));

const RequestConfigPanel = ({ txnData, setTxnData, isMultiRequest }) => {
  const onTxnDataChange = (e) =>
    setTxnData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const [selectedCountry, setSelectedCountry] = useState(txnData.country || "India");

  const paymentModeOptions = [
    { value: "upi", label: "UPI" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    // { value: "atm", label: "ATM" },
  ];

  const transactionTypeOptions = [
    { value: "Transfer", label: "Transfer" },
    { value: "Recharge", label: "Recharge" },
    { value: "Bill Payment", label: "Bill Payment" },
    { value: "Shopping", label: "Shopping" },
  ];

  return (
    <Panel title="Manual Transaction Details">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditionally render transaction amount range */}
        {isMultiRequest ? (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-slate-300 font-medium">
              Transaction Amount Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                name="transaction_amount_min"
                value={txnData.transaction_amount_min}
                onChange={onTxnDataChange}
                placeholder="Min"
                type="number"
                label="Min Amount"
              />
              <Input
                name="transaction_amount_max"
                value={txnData.transaction_amount_max}
                onChange={onTxnDataChange}
                placeholder="Max"
                type="number"
                label="Max Amount"
              />
            </div>
          </div>
        ) : (
          <Input
            label="Transaction Amount"
            name="transaction_amount"
            value={txnData.transaction_amount}
            onChange={onTxnDataChange}
            type="number"
            placeholder="e.g., 500"
          />
        )}

        {txnData.transaction_type !== "atm" &&
          (isMultiRequest ? (
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm text-slate-300 font-medium">
                Time Taken to Complete Transaction Range
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  name="time_taken_to_complete_transaction_min"
                  value={txnData.time_taken_to_complete_transaction_min}
                  onChange={onTxnDataChange}
                  placeholder="Min"
                  type="number"
                  label="Min Time"
                />
                <Input
                  name="time_taken_to_complete_transaction_max"
                  value={txnData.time_taken_to_complete_transaction_max}
                  onChange={onTxnDataChange}
                  placeholder="Max"
                  type="number"
                  label="Max Time"
                />
              </div>
            </div>
          ) : (
            <Input
              name="time_taken_to_complete_transaction"
              value={txnData.time_taken_to_complete_transaction}
              onChange={onTxnDataChange}
              placeholder="Value"
              type="number"
              label="Time Taken to Complete Transaction"
            />
          ))}

        {/* Conditionally render timestamp range */}
        {isMultiRequest ? (
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm text-slate-300 font-medium">
              Transaction Timestamp Range
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                name="timestamp_start"
                value={txnData.timestamp_start}
                onChange={onTxnDataChange}
                type="datetime-local"
                label="Start Time"
              />
              <Input
                name="timestamp_end"
                value={txnData.timestamp_end}
                onChange={onTxnDataChange}
                type="datetime-local"
                label="End Time"
              />
            </div>
          </div>
        ) : (
          <Input
            label="Timestamp"
            name="timestamp"
            value={txnData.timestamp}
            onChange={onTxnDataChange}
            type="datetime-local"
          />
        )}

                <Select
          label="Currency"
          name="transaction_currency"
          value={txnData.transaction_currency}
          onChange={onTxnDataChange}
          options={currencyOptions}
        />

        <Select
          label="Payment Mode"
          name="transaction_type"
          value={txnData.transaction_type}
          onChange={onTxnDataChange}
          options={paymentModeOptions}
        />

        <Select
          label="Transaction Type"
          name="transaction_type"
          value={txnData.transaction_type}
          onChange={onTxnDataChange}
          options={transactionTypeOptions}
        />
        
        {/* Country dropdown (local only) */}
        <Select
          label="Country"
          name="country"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            // Set city to the first city of the new country instead of empty
            const firstCity =
              countryCityOptions[e.target.value][0]?.value || "";
            onTxnDataChange({ target: { name: "city", value: firstCity } });
            onTxnDataChange({
              target: { name: "country", value: e.target.value },
            });
          }}
          options={countryOptions}
        />

        {/* City dropdown (filtered by country) */}
        <Select
          label="City"
          name="city"
          value={txnData.city}
          onChange={onTxnDataChange}
          options={countryCityOptions[selectedCountry]}
        />

        <Select
          label="Time Zone"
          name="time_zone"
          value={txnData.time_zone}
          onChange={onTxnDataChange}
          options={timezoneOptions}
        />
      </div>
    </Panel>
  );
};

export default RequestConfigPanel;
