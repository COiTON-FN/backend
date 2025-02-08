const { RpcProvider, Contract, Account, cairo } = require("starknet");
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
    if (Number(data[0].id) === 0) {
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
};
