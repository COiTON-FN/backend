const {
  Account,
  CallData,
  Contract,
  RpcProvider,
  stark,
  RPC,
  num,
} = require("starknet");
require("dotenv").config();
const { getCompiledCode } = require("./utils");
// dotenv.config();

async function main() {
  const provider = new RpcProvider({
    nodeUrl: process.env.RPC_URL,
  });

  // initialize existing predeployed account 0
  console.log("ACCOUNT_ADDRESS=", process.env.ACCOUNT_ADDRESS);
  console.log("ACCOUNT_PRIVATE_KEY=", process.env.PRIVATE_KEY);
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

  //   const myCallData = new CallData(sierraCode.abi);

  //   const constructor = myCallData.compile("constructor", {
  //     owner: process.env.DEPLOYER_ADDRESS ?? "",
  //     staking_token:
  //       "0x227e1a8c4ee85feccab767c584c0b46f5c4062e97a9219a91ec75c86ce0a840",
  //     reward_token:
  //       "0x702d2721fdcb98fae346bf1398e0702b27c8ccc97e75e632ff93653ece67253",
  //   });

  const maxQtyGasAuthorized = 1800n * 1000n; // max quantity of gas authorized
  const maxPriceAuthorizeForOneGas = 50n * 10n ** 12n * 1000n; // max FRI authorized to pay 1 gas (1 FRI=10**-18 STRK)
  console.log(
    "max authorized cost =",
    maxQtyGasAuthorized * maxPriceAuthorizeForOneGas,
    "FRI"
  );

  const val = await account0.estimateDeclareFee({
    contract: sierraCode,
    casm: casmCode,
  });

  console.log(val.resourceBounds);
  const declared = await account0.declare(
    {
      contract: sierraCode,
      casm: casmCode,
    },
    {
      maxFee: 10 ** 15,
      feeDataAvailabilityMode: RPC.EDataAvailabilityMode.L1,
      resourceBounds: val.resourceBounds,
    }
  );

  console.log(declared);

  //   const deployResponse = await account0.declareAndDeploy({
  //     contract: sierraCode,
  //     casm: casmCode,
  //     constructorCalldata: constructor,
  //     salt: stark.randomAddress(),
  //   });

  //   // Connect the new contract instance :
  //   const myTestContract = new Contract(
  //     sierraCode.abi,
  //     deployResponse.deploy.contract_address,
  //     provider
  //   );
  //   console.log(
  //     `✅ Contract has been deploy with the address: ${myTestContract.address}`
  //   );
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
