const { Contract, Account, RpcProvider } = require("starknet");
require("dotenv").config();
const { getCompiledCode } = require("./utils");

async function main() {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_URL,
  });

  const privateKey0 = process.env.PRIVATE_KEY ?? "";
  const accountAddress0 = process.env.ACCOUNT_ADDRESS ?? "";
  const account0 = new Account(provider, accountAddress0, privateKey0);
  console.log("Account connected.\n");
  // Declare & deploy contract
  let sierraCode, casmCode;

  try {
    ({ sierraCode, casmCode } = await getCompiledCode("coiton_Coiton"));
  } catch (error) {
    console.log("Failed to read contract files");
    console.log(error);
    process.exit(1);
  }

  // Connect the new contract instance:
  const contract = new Contract(
    sierraCode.abi,
    process.env.CONTRACT_ADDRESS,
    provider
  );

  const call = contract.populate("upgrade", [
    "0x59f231e38e8d4955698b257b16a139393138e2f2c0f9eeb165570cce80ba908",
  ]);

  const tx = await account0.execute(call);
  const receipt = await account0.waitForTransaction(tx.transaction_hash);
  console.log(receipt);
}

main().catch(console.log);
