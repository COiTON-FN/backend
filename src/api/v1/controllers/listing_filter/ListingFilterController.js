const { ListingFilterService } = require("../../services");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse, Converter } = require("../../helpers");
const {
  get_transaction_events,
  get_listing,
} = require("../contract/contract.controller");

exports.createListingFilter = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const data = req.body;
  try {
    const events = await get_transaction_events(data.tx_hash);
    const id = events[0][Object.keys(events[0])[0]].id;
    const listing = await get_listing(id);
    const details = Converter.byteArrayToString(listing.details);
    const newListingFilter = await ListingFilterService.createListingFilter(
      data
    );
    const { success, ...result } = newListingFilter;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Listing filter created Successfully",
        201,
        result.data
      );
    } else {
      MessageResponse.errorResponse(
        res,
        "unprocessible entity",
        422,
        result.error
      );
    }
  } catch (error) {
    console.log(error);
    MessageResponse.errorResponse(
      res,
      "internal server error",
      500,
      error.message
    );
  }
};

exports.getListingFilter = async (req, res, next) => {
  const id = req.params.id;
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  try {
    const listing_filter = await ListingFilterService.getListingFilter(id);
    return MessageResponse.successResponse(
      res,
      "listing found",
      200,
      listing_filter.data
    );
  } catch (error) {
    return MessageResponse.errorResponse(res, "server error", 500, error);
  }
};

exports.getListingsByKeywords = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const { query } = req.query;
  const { page, size } = req.pagination;

  try {
    const listing = await ListingFilterService.getListingsByKeywords(
      JSON.parse(query),
      page,
      size
    );
    if (listing.success) {
      return MessageResponse.successResponse(
        res,
        "listing found",
        200,
        listing.data
      );
    }
    return MessageResponse.errorResponse(
      res,
      listing.message,
      200,
      listing.data
    );
  } catch (error) {
    return MessageResponse.errorResponse(res, "server error", 500, error);
  }
};
