const router = require("express").Router();
const {
  execute_contract_call,
} = require("../../controllers/contract/contract.controller");

router.post("/execute", async (req, res) => {
  try {
    const call = req.body;
    const execution = await execute_contract_call(call);
    if (!execution.success) {
      return res.status(400).json(execution);
    }

    return res.status(200).json(execution);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: {},
    });
  }
});

module.exports = router;
