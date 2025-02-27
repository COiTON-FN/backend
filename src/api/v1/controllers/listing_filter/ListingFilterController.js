const { ListingFilterService } = require("../../services");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse, Converter } = require("../../helpers");
const {
  get_transaction_events,
  get_listing,
} = require("../contract/contract.controller");

function extractKeywords(data) {
  const keywords = [
    "title",
    "price",
    "interior",
    "exterior",
    "rooms",
    "utilities",
    "description",
    "region",
    "area",
  ];

  const extractedValues = [];

  Object.entries(data).forEach(([key, value]) => {
    if (keywords.includes(key)) {
      if (Array.isArray(value)) {
        extractedValues.push(value.map((item) => item.text)); // Extract text from arrays
      } else if (key === "region") {
        extractedValues.push(value.city.cityName);
        extractedValues.push(value.state.stateName);
        extractedValues.push(value.country.countryName);
      } else {
        extractedValues.push(value);
      }
    }
  });

  return extractedValues.flat().join(", ");
}

exports.createListingFilter = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  try {
    const events = await get_transaction_events(req.body.tx_hash);
    const id = events[0][Object.keys(events[0])[0]].id;
    const listing = await get_listing(id);
    const details = Converter.byteArrayToString(listing.details);

    const data = {
      id: Number(listing.id),
      price: Number(listing.price).toString(),
      keywords: extractKeywords(details),
    };

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
  const { page, size, query } = req.query;

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
