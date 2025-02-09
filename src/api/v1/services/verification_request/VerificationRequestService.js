const { CheckDBResponse } = require("../../helpers");
const { VerificationRequest } = require("../../database/classes");
const { errorResponse } = require("../../helpers/messages/CheckDBStatus");

exports.createVerificationRequest = async (data) => {
  try {
    const newVerification = await VerificationRequest.createVerificationRequest(
      data
    );
    return CheckDBResponse.response(newVerification);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

exports.getVerificationRequests = async (query, page, size) => {
  try {
    const verifications = await VerificationRequest.getAllVerificationRequests(
      query,
      page,
      size
    );
    return CheckDBResponse.response(verifications);
  } catch (error) {
    return errorResponse(error);
  }
};

exports.getVerificationRequest = async (id) => {
  try {
    const verificationRequest =
      await VerificationRequest.getVerificationRequest(id);

    return CheckDBResponse.response(verificationRequest);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateVerificationRequest = async (id, data) => {
  try {
    const updatedVerificationRequest =
      await VerificationRequest.updateVerificationRequest(id, data);
    return CheckDBResponse.response(updatedVerificationRequest);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.deleteVerificationRequest = async (id) => {
  try {
    const result = await VerificationRequest.deleteVerificationRequest(id);
    return CheckDBResponse.successResponse(result.message);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};
