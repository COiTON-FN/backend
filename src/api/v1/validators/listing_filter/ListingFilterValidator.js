const { param, body, query } = require("express-validator");
const { ListingFilter } = require("../../database/classes");

exports.create_listing_filter = [
  body("tx_hash").notEmpty().withMessage("Invalid query").bail(),
];

exports.get_listing_by_keywords = [
  query("query")
    .notEmpty()
    .withMessage("invalid query")
    .bail()
    .custom(async (query) => {
      if (!Array.isArray(JSON.parse(query))) {
        throw new Error("invalid query");
      }
    }),
];

exports.get_listing_by_id = [
  param("id")
    .notEmpty()
    .withMessage("invalid query")
    .bail()
    .custom(async (query) => {
      const listing_exist = await ListingFilter.getListingFilter(id);
      if (!listing_exist) {
        throw new Error("invalid query");
      }
    }),
];
