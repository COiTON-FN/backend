const { RpcProvider, Contract, Account, cairo, CallData } = require("starknet");
const ABI = require("../../database/config/ABI.json");

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

const execute_contract_call = async (call) => {
  try {
    if (!call) {
      console.log("INVALID_CALL=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "INVALID_CALL" };
    }

    if (
      !call.entrypoint ||
      !call.contractAddress ||
      (!call.calldata && !Array.isArray(call.calldata)) ||
      call.calldata.length < 6
    ) {
      console.log("CALLDATA_LENGTH=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "INVALID_CALLDATA_LENGTH" };
    }
    if (call.entrypoint !== "execute_from_outside_v2") {
      console.log("INVALID_ENTRYPOINT=======================>>>>>>>>>>>>");
      return { success: false, data: {}, message: "INVALID_ENTRYPOINT" };
    }

    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (
      call.calldata[5] !== CallData.compile([CONTRACT_ADDRESS])[0] &&
      call.calldata[5] !=
        CallData.compile([
          "0x0683244c4a12de16630a8bae12dc435c7212cdeef0d3da08b6dd161ca5cc2f07",
        ])
    ) {
      console.log("INVALID_ADDRESS=======================>>>>>>>>>>>>");

      return { success: false, data: {}, message: "INVALID_ADDRESS" };
    }

    const { account } = get_contract_instance();
    const tx = await account.execute(call);
    return { success: true, data: tx, message: "Transaction successful" };
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
};
