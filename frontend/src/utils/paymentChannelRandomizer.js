const generateRandomString = (length, allowedChars) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += allowedChars.charAt(
      Math.floor(Math.random() * allowedChars.length)
    );
  }
  return result;
};

const generateRandomNumber = (length) => {
  return generateRandomString(length, "0123456789");
};

const BANKS = [
  { name: "State Bank of India", code: "SBIN" },
  { name: "HDFC Bank", code: "HDFC" },
  { name: "ICICI Bank", code: "ICIC" },
  { name: "Axis Bank", code: "UTIB" },
  { name: "Punjab National Bank", code: "PNBN" },
  { name: "Bank of Baroda", code: "BARB" },
  { name: "Canara Bank", code: "CNRB" },
  { name: "Union Bank of India", code: "UBIN" },
  { name: "Kotak Mahindra Bank", code: "KKBK" },
  { name: "Yes Bank", code: "YESB" },
  { name: "IDFC FIRST Bank", code: "IDFB" },
];

const generateRandomBankName = () => {
  const bank = BANKS[Math.floor(Math.random() * BANKS.length)];
  return bank.name;
};

const getBankCodeByName = (name) => {
  const found = BANKS.find((b) => b.name === name);
  return found ? found.code : "HDFC";
};

const generateRandomUPIId = () => {
  const usernames = ["user", "pay", "personal", "business", "shop", "store"];
  const domains = ["okicici", "oksbi", "okhdfc", "okhdfcbank", "okaxis"];
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const randomNum = generateRandomNumber(4);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${username}${randomNum}@${domain}`;
};

const generateRandomAccountNo = () => {
  return generateRandomNumber(12);
};

const generateRandomCardExpiry = () => {
  const currentYear = new Date().getFullYear();
  const month = Math.floor(Math.random() * 12) + 1;
  const year = currentYear + Math.floor(Math.random() * 5);
  return `${month.toString().padStart(2, "0")}/${year.toString().slice(-2)}`;
};

const generateRandomCVV = () => {
  return generateRandomNumber(3);
};

const generateRandomCardNumber = () => {
  // Generate a random 16-digit card number
  return generateRandomNumber(16);
};

export const generateRandomIFSC = (bankName) => {
  // IFSC: 4 letters + 0 + 6 digits (e.g., HDFC0001234)
  const code = getBankCodeByName(bankName);
  const branch = generateRandomNumber(6);
  return `${code}0${branch}`;
};

export const generateRandomPaymentChannelData = (paymentMode) => {
  const NotApplicable = "Not Applicable";
  let channelData = {
    recipient_account_no: NotApplicable,
    recipient_bank_name: NotApplicable,
    bank_name: NotApplicable,
    account_no: NotApplicable,
    upi_id: NotApplicable,
    sender_upi_id: NotApplicable,
    credit_card_no: NotApplicable,
    credit_card_expiry: NotApplicable,
    credit_card_cvv: NotApplicable,
    debit_card_no: NotApplicable,
    debit_card_expiry: NotApplicable,
    debit_card_cvv: NotApplicable,
    ifsc_code: NotApplicable,
    recipient_ifsc_code: NotApplicable,
  };

  switch (paymentMode) {
    case "bank_transfer": {
      channelData.recipient_account_no = generateRandomAccountNo();
      channelData.recipient_bank_name = generateRandomBankName();
      channelData.bank_name = generateRandomBankName();
      channelData.account_no = generateRandomAccountNo();
      channelData.recipient_ifsc_code = generateRandomIFSC(
        channelData.recipient_bank_name
      );
      channelData.ifsc_code = generateRandomIFSC(channelData.bank_name);
      break;
    }
    case "upi":
      channelData.recipient_upi_id = generateRandomUPIId();
      channelData.sender_upi_id = generateRandomUPIId();
      break;

    case "credit_card":
      channelData.credit_card_no = generateRandomCardNumber();
      channelData.credit_card_expiry = generateRandomCardExpiry();
      channelData.credit_card_cvv = generateRandomCVV();
      break;

    case "debit_card":
      channelData.debit_card_no = generateRandomCardNumber();
      channelData.debit_card_expiry = generateRandomCardExpiry();
      channelData.debit_card_cvv = generateRandomCVV();
      break;
      break;
    case "atm": {
      channelData.bank_name = generateRandomBankName();
      channelData.ifsc_code = generateRandomIFSC(channelData.bank_name);
      channelData.account_no = generateRandomAccountNo();
      channelData.debit_card_no = generateRandomCardNumber();
      channelData.debit_card_expiry = generateRandomCardExpiry();
      channelData.debit_card_cvv = generateRandomCVV();
      channelData.branch_code = generateRandomNumber(4);
      channelData.number_of_pin_tries = String(
        Math.floor(Math.random() * 3) + 1
      ); // 1-3
      channelData.atm_id = `ATM${generateRandomNumber(5)}`;
      const statuses = ["OK", "Jam", "Empty"];
      channelData.cash_dispenser_status =
        statuses[Math.floor(Math.random() * statuses.length)];
      break;
    }
  }

  return channelData;
};
