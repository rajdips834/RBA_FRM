import { getISODateTime, formatToCustomDateTime } from "./dateUtils";
import { getCoordinatesFromCity } from "./geoUtils";
import { countryCityOptions } from "../data/locationOptions";
import { generateRandomDevice } from "./deviceRandomizer";

/**
 * Generates a random transaction ID.
 * @returns {string} A transaction ID string.
 */
function generateTransactionId() {
  const randomDigits = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
  return `TXN${randomDigits}`;
}

function generateRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateRandomTxnTimestamp(min, max) {
  if (!min || !max) {
    return getISODateTime();
  }
  if (min == max) return min;
  const minDate = new Date(min);
  const maxDate = new Date(max);
  if (isNaN(minDate) || isNaN(maxDate) || minDate >= maxDate) {
    return getISODateTime();
  }
  const randomTime =
    minDate.getTime() + Math.random() * (maxDate.getTime() - minDate.getTime());
  const randomDate = new Date(randomTime);
  return formatToCustomDateTime(randomDate);
}

const EXCLUDED_FIELDS = [
  "time_taken_to_complete_transaction_min",
  "time_taken_to_complete_transaction_max",
  "timestamp_start",
  "timestamp_end",
];

/**
 * Builds the nested payload required for the FRM /txMonitor API.
 * @param {object} deviceData - Data related to the user's device.
 * @param {object} txnData - Manually entered data, including user and transaction info.
 * @param {object} channelFields - Data specific to the selected payment channel.
 * @returns {object} The formatted payload object for a transaction request.
 */
export const buildPayload = async (
  deviceData,
  txnData,
  channelFields,
  userId,
  isMultiRequest = false,
  isFraud = false
) => {
  const { transaction_type } = txnData;
  const NotApplicable = "Not Applicable";

  const coordinates = await getCoordinatesFromCity(txnData.city);
  let time_taken = txnData.time_taken_to_complete_transaction || 5;
  let timestamp = txnData.timestamp || getISODateTime();
  let transaction_amount = txnData.transaction_amount || 100.0;
  if (isMultiRequest && !isFraud) {
    time_taken = generateRandomInt(
      txnData.time_taken_to_complete_transaction_min,
      txnData.time_taken_to_complete_transaction_max
    );
    transaction_amount = generateRandomInt(
      txnData.transaction_amount_min || 10,
      txnData.transaction_amount_max || 1000
    );
    timestamp = generateRandomTxnTimestamp(
      txnData.timestamp_start,
      txnData.timestamp_end
    );
  }

  // --- 1. Assemble the deviceDetails object ---
  const deviceDetails = {
    device_id: deviceData.device_id,
    device_fingerprint: deviceData.device_fingerprint,
    device_type: deviceData.device_type,
    operating_system_and_version: deviceData.operating_system_and_version,
    carrier_name: deviceData.carrier_name,
    network_type: deviceData.network_type,
    ip_address: deviceData.ip_address,
    screen_resolution: deviceData.screen_resolution,
    device_language: deviceData.device_language || "en-US",
    os_release: Number(deviceData.os_release) || 0,
    latitude: Number(coordinates.latitude),
    longitude: Number(coordinates.longitude),
    city: txnData.city || "Unknown",
    country: txnData.country || "Unknown",
    timestamp: timestamp,
    time_zone: txnData.time_zone,
    vpn_check: Number(txnData.vpn_check) || 0,
  };

  if (deviceData.device_type === "web") {
    deviceDetails.browser_name_and_version =
      deviceData.browser_name_and_version;
  }
  if (
    deviceData.device_type === "android" ||
    deviceData.device_type === "ios"
  ) {
    deviceDetails.device_model = deviceData.device_model || "Unknown";
    deviceDetails.device_manufacturer = deviceData.device_manufacturer || "";
    deviceDetails.device_brand = deviceData.device_brand || "";
    deviceDetails.device_hardware = deviceData.device_hardware || "";
    deviceDetails.os_sdk = Number(deviceData.os_sdk) || 0;
    deviceDetails.os_security_patch = deviceData.os_security_patch || "";
    deviceDetails.battery_level = Number(deviceData.battery_level) || 0;
    deviceDetails.app_package = deviceData.app_package || "";
    deviceDetails.app_version = deviceData.app_version || "";
    deviceDetails.inclination = deviceData.inclination || "";
    deviceDetails.deviceVelocity = deviceData.deviceVelocity || "";
    deviceDetails.gravity = deviceData.gravity || "";
    deviceDetails.magneticField = deviceData.magneticField || "";
    deviceDetails.gyroscope = deviceData.gyroscope || "";
    deviceDetails.hardware_biometric_support =
      Number(deviceData.hardware_biometric_support) || 0;
    deviceDetails.is_emulator = Number(deviceData.is_emulator) || 0;
  }
  if (deviceData.device_type === "android") {
    deviceDetails.is_rooted = Number(deviceData.is_rooted) || 0;
    deviceDetails.security_adb_enabled =
      Number(deviceData.security_adb_enabled) || 0;
    deviceDetails.security_dev_mode = Number(deviceData.security_dev_mode) || 0;
    deviceDetails.app_install_time = deviceData.app_install_time || "";
    deviceDetails.app_update_time = deviceData.app_update_time || "";
  }
  if (deviceData.device_type === "ios") {
    deviceDetails.is_jailbroken = Number(deviceData.is_jailbroken) || 0;
  }

  if (isMultiRequest) {
    EXCLUDED_FIELDS.forEach((field) => delete deviceDetails[field]);
  }

  // --- 2. Assemble the userDetails object ---
  const userDetails = {
    user_id: userId || "UnknownUser",
  };

  // --- 3. Assemble the transactionDetails object ---
  const transactionDetails = {
    transactionId: generateTransactionId(),
    transaction_amount: Number(transaction_amount),
    transaction_category: txnData.transaction_category || "Online",
    transaction_currency: txnData.transaction_currency || "INR",
    transaction_frequency: "one-time",
    transaction_type: txnData.transaction_type,
    payment_mode: txnData.transaction_type,

    // Payment channel specific fields
    recipient_account_no:
      transaction_type === "bank_transfer"
        ? channelFields.recipient_account_no
        : NotApplicable,
    recipient_bank_name:
      transaction_type === "bank_transfer"
        ? channelFields.recipient_bank_name
        : NotApplicable,
    recipient_ifsc_code:
      transaction_type === "bank_transfer"
        ? channelFields.recipient_ifsc_code
        : NotApplicable,
    bank_name:
      transaction_type === "bank_transfer" || transaction_type === "atm"
        ? channelFields.bank_name
        : NotApplicable,
    account_no:
      transaction_type === "bank_transfer" || transaction_type === "atm"
        ? channelFields.account_no
        : NotApplicable,
    ifsc_code:
      transaction_type === "bank_transfer" || transaction_type === "atm"
        ? channelFields.ifsc_code
        : NotApplicable,
    recipient_upi_id:
      transaction_type === "upi"
        ? channelFields.recipient_upi_id
        : NotApplicable,
    sender_upi_id:
      transaction_type === "upi" ? channelFields.sender_upi_id : NotApplicable,
    credit_card_no:
      transaction_type === "credit_card"
        ? channelFields.credit_card_no
        : NotApplicable,
    credit_card_expiry:
      transaction_type === "credit_card"
        ? channelFields.credit_card_expiry
        : NotApplicable,
    credit_card_cvv:
      transaction_type === "credit_card"
        ? channelFields.credit_card_cvv
        : NotApplicable,
    debit_card_no:
      transaction_type === "debit_card" || transaction_type === "atm"
        ? channelFields.debit_card_no
        : NotApplicable,
    debit_card_expiry:
      transaction_type === "debit_card" || transaction_type === "atm"
        ? channelFields.debit_card_expiry
        : NotApplicable,
    debit_card_cvv:
      transaction_type === "debit_card" || transaction_type === "atm"
        ? channelFields.debit_card_cvv
        : NotApplicable,
    branch_code:
      transaction_type === "atm" ? channelFields.branch_code : NotApplicable,
    number_of_pin_tries:
      transaction_type === "atm"
        ? channelFields.number_of_pin_tries
        : NotApplicable,
    atm_id: transaction_type === "atm" ? channelFields.atm_id : NotApplicable,
    cash_dispenser_status:
      transaction_type === "atm"
        ? channelFields.cash_dispenser_status
        : NotApplicable,
  };

  if (transaction_type === "bank_transfer") {
    transactionDetails.transaction_type = "net_banking";
    transactionDetails.payment_mode = "netbanking";
  }
  if (transaction_type === "credit_card") {
    transactionDetails.transaction_type = "card";
    transactionDetails.payment_mode = "creditcard";
  }
  if (transaction_type === "debit_card") {
    transactionDetails.transaction_type = "card";
    transactionDetails.payment_mode = "debitcard";
  }
  if (transaction_type === "upi") {
    transactionDetails.transaction_type = "upi";
    transactionDetails.payment_mode = "upi";
  }
  if (transaction_type !== "atm") {
    transactionDetails.time_taken_to_complete_transaction =
      Number(time_taken) || 5;
  }

  // --- 4. Assemble the final payload ---
  return {
    deviceDetails,
    userDetails,
    transactionDetails,
    secret: import.meta.env.VITE_AXIOM_SECRET,
  };
};

export const buildTempTxnPayload = async (multiTxnData, channelFields) => {
  const txnData = {
    city: multiTxnData.city || "Unknown",
    country: multiTxnData.country || "Unknown",
    time_taken_to_complete_transaction_min:
      multiTxnData.time_taken_to_complete_transaction_min,
    time_taken_to_complete_transaction_max:
      multiTxnData.time_taken_to_complete_transaction_max,
    timestamp_start: multiTxnData.timestamp_start || getISODateTime(),
    timestamp_end: multiTxnData.timestamp_end || getISODateTime(),
    transaction_amount_min: multiTxnData.transaction_amount_min || 100,
    transaction_amount_max: multiTxnData.transaction_amount_max || 1000,
    transaction_currency: multiTxnData.transaction_currency || "INR",
    time_zone: multiTxnData.time_zone,
    vpn_check: multiTxnData.vpn_check || "0",
    transaction_category: multiTxnData.transaction_category || "Transfer",
    transaction_type: multiTxnData.transaction_type || "upi",
    transaction_frequency: "one-time",
  };
  const channelData = {
    recipient_account_no:
      channelFields.recipient_account_no || "Not Applicable",
    recipient_bank_name: channelFields.recipient_bank_name || "Not Applicable",
    recipient_ifsc_code: channelFields.recipient_ifsc_code || "Not Applicable",
    bank_name: channelFields.bank_name || "Not Applicable",
    account_no: channelFields.account_no || "Not Applicable",
    ifsc_code: channelFields.ifsc_code || "Not Applicable",
    recipient_upi_id: channelFields.recipient_upi_id || "Not Applicable",
    sender_upi_id: channelFields.sender_upi_id || "Not Applicable",
    credit_card_no: channelFields.credit_card_no || "Not Applicable",
    credit_card_expiry: channelFields.credit_card_expiry || "Not Applicable",
    credit_card_cvv: channelFields.credit_card_cvv || "Not Applicable",
    debit_card_no: channelFields.debit_card_no || "Not Applicable",
    debit_card_expiry: channelFields.debit_card_expiry || "Not Applicable",
    debit_card_cvv: channelFields.debit_card_cvv || "Not Applicable",
    // ATM specific fields
    branch_code: channelFields.branch_code || "Not Applicable",
    number_of_pin_tries: channelFields.number_of_pin_tries || "Not Applicable",
    atm_id: channelFields.atm_id || "Not Applicable",
    cash_dispenser_status:
      channelFields.cash_dispenser_status || "Not Applicable",
  };
  return {
    txnData: txnData,
    channelData: channelData,
  };
};

// Flatten all cities and countries from locationOptions
const FRAUD_COUNTRIES = Object.keys(countryCityOptions);
const FRAUD_CITIES = Object.values(countryCityOptions)
  .flat()
  .map((opt) => opt.value);

export async function createFraudTxnPayloads({
  numFraudRequests,
  baseTxnData,
  usedCities,
  usedCountries,
  maxTimeTaken,
  maxAmount,
  useRandomUsers,
  deviceType,
  selectedRandomUsers,
  urlUserId,
}) {
  // Find available city/country not used
  // console.log(maxTimeTaken);
  const availableCities = FRAUD_CITIES.filter(
    (c) => !usedCities.includes(c.toLowerCase())
  );
  const availableCountries = FRAUD_COUNTRIES.filter(
    (c) => !usedCountries.includes(c.toLowerCase())
  );
  let fraudPayloads = [];
  for (let i = 0; i < numFraudRequests; i++) {
    // Pick userId
    let userId = useRandomUsers
      ? selectedRandomUsers[
          Math.floor(Math.random() * selectedRandomUsers.length)
        ]
      : urlUserId;
    // Generate random device
    const randomDevice = generateRandomDevice(deviceType);
    // Pick city/country not used
    const city = availableCities[i % availableCities.length] || "UnknownCity";
    const country =
      availableCountries[i % availableCountries.length] || "UnknownCountry";
    // Set fraud fields
    const fraudTxnData = {
      ...baseTxnData.txnData,
      city,
      country,
      time_taken_to_complete_transaction:
        maxTimeTaken + 100 * (1 + Math.random()),
      transaction_amount: generateRandomInt(
        maxAmount + 100000,
        (maxAmount + 200000) * 2
      ),
    };
    const fraudChannelData = {
      ...baseTxnData.channelData,
    };
    console.log("Fraud Transaction Data:", fraudTxnData);
    const txnPayload = await buildPayload(
      randomDevice,
      fraudTxnData,
      fraudChannelData,
      userId,
      true,
      true
    );
    fraudPayloads.push(txnPayload);
  }
  return fraudPayloads;
}
