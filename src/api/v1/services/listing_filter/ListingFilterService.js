const { CheckDBResponse } = require("../../helpers");
const { ListingFilter } = require("../../database/classes");
const { errorResponse } = require("../../helpers/messages/CheckDBStatus");

exports.createListingFilter = async (data) => {
  try {
    const newListingFilter = await ListingFilter.createListingFilter(data);
    return CheckDBResponse.response(newListingFilter);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

exports.getAllListingFilters = async (page, size) => {
  try {
    const listingFilters = await ListingFilter.getAllListingFilters(page, size);
    return CheckDBResponse.response(listingFilters);
  } catch (error) {
    return errorResponse(error);
  }
};

exports.getListingFilter = async (id) => {
  try {
    const listingFilter = await ListingFilter.getListingFilter(id);

    return CheckDBResponse.response(listingFilter);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

exports.getListingsByKeywords = async (queries, page, size) => {
  try {
    const result = await ListingFilter.getListingsByKeywords(
      queries,
      page,
      size
    );
    return CheckDBResponse.response(result);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateListingFilter = async (id, data) => {
  try {
    const updatedListingFilter = await ListingFilter.updateListingFilter(
      id,
      data
    );
    return CheckDBResponse.response(updatedListingFilter);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.deleteListingFilter = async (id) => {
  try {
    const result = await ListingFilter.deleteListingFilter(id);
    return CheckDBResponse.successResponse(result.message);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};
