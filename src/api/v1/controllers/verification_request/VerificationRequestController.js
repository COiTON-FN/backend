const { VerificatonRequestService } = require("../../services");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse } = require("../../helpers");

exports.createVerificationRequest = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const data = req.body;
  try {
    const newVerificationRequest =
      await VerificatonRequestService.createVerificationRequest({
        ...data,
        approved: undefined,
      });
    const { success, ...result } = newVerificationRequest;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Verification request created Successfully",
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

exports.updateVerificationRequest = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const data = req.body;
  const { id } = req.params;
  try {
    const updatedVerificationRequest =
      await VerificatonRequestService.updateVerificationRequest(id, data);
    const { success, ...result } = updatedVerificationRequest;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Verification request updated Successfully",
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

exports.getVerificationRequest = async (req, res, next) => {
  const id = req.params.id;
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  try {
    const verification_request =
      await VerificatonRequestService.getVerificationRequest(id);
    return MessageResponse.successResponse(
      res,
      "verification request found",
      200,
      verification_request.data
    );
  } catch (error) {
    return MessageResponse.errorResponse(res, "server error", 500, error);
  }
};

exports.getVerificationRequests = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const { page, size, query } = req.query;

  try {
    const verificationRequests =
      await VerificatonRequestService.getVerificationRequests(
        query ? JSON.parse(query) : undefined,
        page,
        size
      );
    if (verificationRequests.success) {
      return MessageResponse.successResponse(
        res,
        "verification requests found",
        200,
        verificationRequests.data
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
