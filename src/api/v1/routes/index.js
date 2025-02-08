const router = require("express").Router();
const ListingRoute = require("./listing_filter/ListingFilterRoute");

router.use("/listing", ListingRoute);

module.exports = router;
