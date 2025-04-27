const router = require("express").Router();
const ListingRoute = require("./listing_filter/ListingFilterRoute");
const VerificationRequestRoute = require("./verification_request/VerificationRequestRoute");
const ContractRoute = require("./contract/ContractRoute");

router.use("/listing", ListingRoute);
router.use("/verification-request", VerificationRequestRoute);
router.use("/contract", ContractRoute);

module.exports = router;
