const {
  RpcProvider,
  Contract,
  Account,
  ec,
  hash,
  CallData,
} = require("starknet");
const ABI = require("../../database/config/ABI.json");
const { stringToByteArray } = require("../../helpers/converter/Converter");

const get_contract_instance = () => {
  const RPC_URL = process.env.RPC_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;

  const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

  const provider = new RpcProvider({ nodeUrl: `${RPC_URL}` });
  const account = new Account(provider, ACCOUNT_ADDRESS, PRIVATE_KEY);
  const contract = new Contract(ABI, CONTRACT_ADDRESS, provider);
  // Connect account with the contract
  contract.connect(account);
  return { contract, account };
};

const extractDecodedErrorReasons = (errorMsg) => {
  const hexMatches = errorMsg.match(/0x[0-9a-fA-F]{8,}/g);
  if (!hexMatches) return [];

  const decodeHex = (hex) => {
    hex = hex.replace(/^0x/, "");
    let decoded = "";
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.slice(i, i + 2), 16);
      decoded +=
        charCode >= 32 && charCode <= 126 ? String.fromCharCode(charCode) : ""; // skip unreadable characters
    }
    return decoded;
  };

  const priorityOrder = [
    "INVALID_LISTING",
    "UNAUTHORIZED",
    "ALREADY_EXIST",
    "INVALID_PARAM",
    "PRICE_TOO_LOW",
    "INSUFFICIENT_ALLOWANCE",
    "INSUFFICIENT_BALANCE",
    "NOT_REGISTERED",
    "INVALID_ADDRESS",
    "NOT_FOR_SALE",
  ];

  const decoded = hexMatches
    .map(decodeHex)
    .filter((str) => str && /^[A-Z0-9_\/-]{5,}$/.test(str)); // keep error-like strings

  return decoded.sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a);
    const bIndex = priorityOrder.indexOf(b);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
};

const execute_admin_call = async (data) => {
  try {
    const signature = data.signature;
    const msgHash = hash.computeHashOnElements(
      stringToByteArray(JSON.stringify(data.payload))
    );
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const publicKey = ec.starkCurve.getPublicKey(PRIVATE_KEY);
    const isValid = ec.starkCurve.verify(signature, msgHash, publicKey);
    if (!isValid) {
      return { success: false, data: {}, message: "INVALID_SIGNATURE" };
    }
    const { account } = get_contract_instance();
    const tx = await account.execute(data.payload);
    const receipt = await account.waitForTransaction(tx.transaction_hash);
    return { success: true, data: receipt, message: "Transaction successful" };
  } catch (error) {
    console.log(error, "======>>>>>>>>>\n\n\n\n\n\n\n\n\n========>>>>>>> END");
    const match = error.message.match(/'([^']+)'/);

    // If a match is found, get the error message
    if (match) {
      const errorMessage = match[1];
      return { success: false, data: {}, message: errorMessage };
    }
    return { success: false, data: {}, message: error.message };
  }
};

const execute_contract_call = async (call) => {
  try {
    if (!call) {
      console.log("INVALID_CALL=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "Invalid call" };
    }

    if (
      !call.entrypoint ||
      !call.contractAddress ||
      (!call.calldata && !Array.isArray(call.calldata)) ||
      call.calldata.length < 6
    ) {
      console.log("CALLDATA_LENGTH=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "Invalid call" };
    }
    if (call.entrypoint !== "execute_from_outside_v2") {
      console.log("OUTSIDE_V2=======================>>>>>>>>>>>>");
      return { success: false, data: {}, message: "Invalid call" };
    }

    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (call.calldata[5] !== CallData.compile([CONTRACT_ADDRESS])[0]) {
      console.log("INVALID_ADDRESS=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "Invalid call" };
    }

    const { account } = get_contract_instance();
    const tx = await account.execute(call);
    return { success: true, data: tx, message: "Transaction successful" };
  } catch (error) {
    console.log(
      error.message,
      "======>>>>>>>>>\n\n\n\n\n\n\n\n\n========>>>>>>> END"
    );
    const match = error.message.match(/'([^']+)'/);

    const errMessage = extractDecodedErrorReasons(error.message);
    if (errMessage?.length) {
      return { success: false, data: {}, message: errMessage[0] };
    }

    // If a match is found, get the error message
    if (match) {
      const errorMessage = match[1];
      return { success: false, data: {}, message: errorMessage };
    }
    return { success: false, data: {}, message: error.message };
  }
};

const get_transaction_events = async (tx_hash) => {
  try {
    const { account, contract } = get_contract_instance();
    const receipt = await account.getTransactionReceipt(tx_hash);
    return contract.parseEvents(receipt);
  } catch (error) {
    throw error;
  }
};

const get_listing = async (id) => {
  try {
    const { contract } = get_contract_instance();
    const data = await contract.get_listing(id);
    // console.log(id, "=======>>>>>> id");
    // console.log(data, "========>>>> data");
    if (Number(data.id) === 0) {
      throw new Error("Invalid listing");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  get_transaction_events,
  get_listing,
  execute_contract_call,
  execute_admin_call,
};
