const router = require("express").Router();
const ListingRoute = require("./listing_filter/ListingFilterRoute");
const VerificationRequestRoute = require("./verification_request/VerificationRequestRoute");

router.use("/listing", ListingRoute);
router.use("/verification-request", VerificationRequestRoute);

module.exports = router;
