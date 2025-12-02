const AtmFields = ({ data, onChange, errors }) => (
  <>
    <InputWithValidation
      label="Bank Name"
      name="bank_name"
      value={data.bank_name}
      onChange={onChange}
      placeholder="e.g., HDFC"
      error={errors.bank_name}
      maxLength={50}
    />
    <InputWithValidation
      label="IFSC Code"
      name="ifsc_code"
      value={data.ifsc_code}
      onChange={onChange}
      placeholder="e.g., HDFC0001234"
      error={errors.ifsc_code}
      maxLength={11}
    />
    <InputWithValidation
      label="Account No"
      name="account_no"
      value={data.account_no}
      onChange={onChange}
      placeholder="••••1234"
      error={errors.account_no}
      maxLength={18}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Debit Card No"
      name="debit_card_no"
      value={data.debit_card_no}
      onChange={onChange}
      placeholder="•••• •••• •••• ••••"
      error={errors.debit_card_no}
      maxLength={16}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Debit Card Expiry (MM/YY)"
      name="debit_card_expiry"
      value={data.debit_card_expiry}
      onChange={onChange}
      placeholder="MM/YY"
      error={errors.debit_card_expiry}
      maxLength={5}
    />
    <InputWithValidation
      label="Debit Card CVV"
      name="debit_card_cvv"
      value={data.debit_card_cvv}
      onChange={onChange}
      placeholder="•••"
      type="password"
      error={errors.debit_card_cvv}
      maxLength={3}
      inputMode="numeric"
    />
    <InputWithValidation
      label="Branch Code"
      name="branch_code"
      value={data.branch_code}
      onChange={onChange}
      placeholder="e.g., 1234"
      error={errors.branch_code}
      maxLength={10}
    />
    <InputWithValidation
      label="Number of PIN Tries"
      name="number_of_pin_tries"
      value={data.number_of_pin_tries}
      onChange={onChange}
      placeholder="e.g., 1"
      error={errors.number_of_pin_tries}
      maxLength={2}
      inputMode="numeric"
      type="number"
    />
    <InputWithValidation
      label="ATM ID"
      name="atm_id"
      value={data.atm_id}
      onChange={onChange}
      placeholder="e.g., ATM12345"
      error={errors.atm_id}
      maxLength={20}
    />
    <InputWithValidation
      label="Cash Dispenser Status"
      name="cash_dispenser_status"
      value={data.cash_dispenser_status}
      onChange={onChange}
      placeholder="e.g., OK, Jam, Empty"
      error={errors.cash_dispenser_status}
      maxLength={10}
    />
  </>
);
import React, { useEffect, useState } from "react";
import Input from "../components/core/Input";
import Panel from "../components/core/Panel";
import { generateRandomPaymentChannelData } from "../utils/paymentChannelRandomizer";

const validateField = (name, value) => {
  switch (name) {
    case "recipient_upi_id":
    case "sender_upi_id":
      if (!value) return "UPI ID is required.";
      if (!/^\w+@\w+$/.test(value)) return "Invalid UPI ID format.";
      break;
    case "credit_card_no":
    case "debit_card_no":
      if (!value) return "Card number is required.";
      if (!/^\d{16}$/.test(value.replace(/\s/g, "")))
        return "Card number must be 16 digits.";
      break;
    case "credit_card_expiry":
    case "debit_card_expiry":
      if (!value) return "Expiry date is required.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return "Invalid expiry.";
      break;
    case "credit_card_cvv":
    case "debit_card_cvv":
      if (!value) return "CVV is required.";
      if (!/^\d{3}$/.test(value)) return "CVV must be 3 digits.";
      break;
    case "recipient_account_no":
    case "account_no":
      if (!value) return "Account number is required.";
      if (!/^\d{6,18}$/.test(value))
        return "Account number must be 6–18 digits.";
      break;
    case "recipient_bank_name":
    case "bank_name":
      if (!value) return "Bank name is required.";
      if (!/^[A-Za-z\s]+$/.test(value))
        return "Bank name must contain letters only.";
      break;
    default:
      return null;
  }
  return null;
};

const InputWithValidation = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
  inputMode,
}) => (
  <div>
    <Input
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      maxLength={maxLength}
      inputMode={inputMode}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const UpiFields = ({ data, onChange, errors }) => (
  <>
    <InputWithValidation
      label="Recipient UPI ID"
      name="recipient_upi_id"
      value={data.recipient_upi_id}
      onChange={onChange}
      placeholder="user@bank"
      error={errors.recipient_upi_id}
      maxLength={50}
    />
    <InputWithValidation
      label="Sender UPI ID"
      name="sender_upi_id"
      value={data.sender_upi_id}
      onChange={onChange}
      placeholder="sender@bank"
      error={errors.sender_upi_id}
      maxLength={50}
    />
  </>
);

const CreditCardFields = ({ data, onChange, errors }) => (
  <>
    <InputWithValidation
      label="Credit Card No"
      name="credit_card_no"
      value={data.credit_card_no}
      onChange={onChange}
      placeholder="•••• •••• •••• ••••"
      error={errors.credit_card_no}
      maxLength={16}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Expiry (MM/YY)"
      name="credit_card_expiry"
      value={data.credit_card_expiry}
      onChange={onChange}
      placeholder="MM/YY"
      error={errors.credit_card_expiry}
      maxLength={5}
    />
    <InputWithValidation
      label="CVV"
      name="credit_card_cvv"
      value={data.credit_card_cvv}
      onChange={onChange}
      placeholder="•••"
      type="password"
      error={errors.credit_card_cvv}
      maxLength={3}
      inputMode="numeric"
    />
  </>
);

const DebitCardFields = ({ data, onChange, errors }) => (
  <>
    <InputWithValidation
      label="Debit Card No"
      name="debit_card_no"
      value={data.debit_card_no}
      onChange={onChange}
      placeholder="•••• •••• •••• ••••"
      error={errors.debit_card_no}
      maxLength={16}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Expiry (MM/YY)"
      name="debit_card_expiry"
      value={data.debit_card_expiry}
      onChange={onChange}
      placeholder="MM/YY"
      error={errors.debit_card_expiry}
      maxLength={5}
    />
    <InputWithValidation
      label="CVV"
      name="debit_card_cvv"
      value={data.debit_card_cvv}
      onChange={onChange}
      placeholder="•••"
      type="password"
      error={errors.debit_card_cvv}
      maxLength={3}
      inputMode="numeric"
    />
  </>
);

const BankTransferFields = ({ data, onChange, errors }) => (
  <>
    <InputWithValidation
      label="Recipient Account No"
      name="recipient_account_no"
      value={data.recipient_account_no}
      onChange={onChange}
      placeholder="••••5678"
      error={errors.recipient_account_no}
      maxLength={18}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Recipient Bank Name"
      name="recipient_bank_name"
      value={data.recipient_bank_name}
      onChange={onChange}
      placeholder="e.g., ICICI"
      error={errors.recipient_bank_name}
      maxLength={50}
    />
    <InputWithValidation
      label="Recipient IFSC Code"
      name="recipient_ifsc_code"
      value={data.recipient_ifsc_code}
      onChange={onChange}
      placeholder="e.g., HDFC0001234"
      error={errors.recipient_ifsc_code}
      maxLength={11}
    />
    <InputWithValidation
      label="Your Account No"
      name="account_no"
      value={data.account_no}
      onChange={onChange}
      placeholder="••••1234"
      error={errors.account_no}
      maxLength={18}
      inputMode="numeric"
      type="text"
    />
    <InputWithValidation
      label="Your Bank Name"
      name="bank_name"
      value={data.bank_name}
      onChange={onChange}
      placeholder="e.g., HDFC"
      error={errors.bank_name}
      maxLength={50}
    />
    <InputWithValidation
      label="Your IFSC Code"
      name="ifsc_code"
      value={data.ifsc_code}
      onChange={onChange}
      placeholder="e.g., HDFC0001234"
      error={errors.ifsc_code}
      maxLength={11}
    />
  </>
);

const ChannelFieldEditor = ({
  paymentMode,
  channelData,
  onFieldsChange,
  onRandomize,
}) => {
  const [errors, setErrors] = useState({});
  const getRandomChannelData = generateRandomPaymentChannelData(paymentMode);
  useEffect(() => {
    let initialFields = {};
    switch (paymentMode) {
      case "upi":
        initialFields = {
          recipient_upi_id:
            channelData.recipient_upi_id ||
            getRandomChannelData.recipient_upi_id,
          sender_upi_id:
            channelData.sender_upi_id || getRandomChannelData.sender_upi_id,
        };
        break;
      case "credit_card":
        initialFields = {
          credit_card_no:
            channelData.credit_card_no || getRandomChannelData.credit_card_no,
          credit_card_expiry:
            channelData.credit_card_expiry ||
            getRandomChannelData.credit_card_expiry,
          credit_card_cvv:
            channelData.credit_card_cvv || getRandomChannelData.credit_card_cvv,
        };
        break;
      case "debit_card":
        initialFields = {
          debit_card_no:
            channelData.debit_card_no || getRandomChannelData.debit_card_no,
          debit_card_expiry:
            channelData.debit_card_expiry ||
            getRandomChannelData.debit_card_expiry,
          debit_card_cvv:
            channelData.debit_card_cvv || getRandomChannelData.debit_card_cvv,
        };
        break;
      case "bank_transfer":
        initialFields = {
          recipient_account_no:
            channelData.recipient_account_no ||
            getRandomChannelData.recipient_account_no,
          recipient_bank_name:
            channelData.recipient_bank_name ||
            getRandomChannelData.recipient_bank_name,
          recipient_ifsc_code:
            channelData.recipient_ifsc_code ||
            getRandomChannelData.recipient_ifsc_code,
          account_no: channelData.account_no || getRandomChannelData.account_no,
          bank_name: channelData.bank_name || getRandomChannelData.bank_name,
          ifsc_code: channelData.ifsc_code || getRandomChannelData.ifsc_code,
        };
        break;
      case "atm":
        initialFields = {
          bank_name:
            channelData.bank_name || getRandomChannelData.bank_name || "",
          ifsc_code:
            channelData.ifsc_code || getRandomChannelData.ifsc_code || "",
          account_no:
            channelData.account_no || getRandomChannelData.account_no || "",
          debit_card_no:
            channelData.debit_card_no ||
            getRandomChannelData.debit_card_no ||
            "",
          debit_card_expiry:
            channelData.debit_card_expiry ||
            getRandomChannelData.debit_card_expiry ||
            "",
          debit_card_cvv:
            channelData.debit_card_cvv ||
            getRandomChannelData.debit_card_cvv ||
            "",
          branch_code:
            channelData.branch_code || getRandomChannelData.branch_code || "",
          number_of_pin_tries:
            channelData.number_of_pin_tries ||
            getRandomChannelData.number_of_pin_tries ||
            "",
          atm_id: channelData.atm_id || getRandomChannelData.atm_id || "",
          cash_dispenser_status:
            channelData.cash_dispenser_status ||
            getRandomChannelData.cash_dispenser_status ||
            "",
        };
        break;
      default:
        initialFields = {};
        break;
    }
    onFieldsChange(initialFields);
    setErrors({});
  }, [paymentMode, onFieldsChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    onFieldsChange((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const renderFields = () => {
    const props = { data: channelData, onChange: handleChange, errors };
    switch (paymentMode) {
      case "upi":
        return <UpiFields {...props} />;
      case "credit_card":
        return <CreditCardFields {...props} />;
      case "debit_card":
        return <DebitCardFields {...props} />;
      case "bank_transfer":
        return <BankTransferFields {...props} />;
      case "atm":
        return <AtmFields {...props} />;
      default:
        return null;
    }
  };

  return (
    <Panel title="Payment Mode Specific Fields">
      <div className="space-y-4">
        {/* UPI: two fields in two rows; others: previous grid */}
        {paymentMode === "upi" ? (
          <div className="flex flex-col gap-4">{renderFields()}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderFields()}
          </div>
        )}
        {paymentMode && (
          <div className="flex justify-end pt-2">
            <button
              onClick={onRandomize}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
              title="Generate random values for payment fields"
            >
              Fill Fields
            </button>
          </div>
        )}
      </div>
    </Panel>
  );
};

export default ChannelFieldEditor;
