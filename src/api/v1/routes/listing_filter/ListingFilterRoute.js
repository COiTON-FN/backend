const router = require("express").Router();
const { ListingFilterController } = require("../../controllers");
const ListingFilterValidator = require("../../validators/listing_filter/ListingFilterValidator");

// add verification on token middleware

router.get(
  "/",
  ListingFilterValidator.get_listing_by_keywords,
  ListingFilterController.getListingsByKeywords
);
router.get(
  "/:id",
  ListingFilterValidator.get_listing_by_id,
  ListingFilterController.getListingFilter
);
router.post(
  "/",
  ListingFilterValidator.create_listing_filter,
  ListingFilterController.createListingFilter
);

module.exports = router;
