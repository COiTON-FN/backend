const { param, body, query } = require("express-validator");
const { VerificationRequest } = require("../../database/classes");

exports.create_verification_request = [
  body("address")
    .notEmpty()
    .withMessage("Invalid query")
    .bail()
    .custom(async (address) => {
      const checkIfExist = await VerificationRequest.getVerificationRequest(
        address
      );
      if (checkIfExist) {
        throw new Error("Verification request already created");
      }
    }),
  body("details").notEmpty().withMessage("Invalid query").bail(),
];

exports.get_verification_request = [
  param("id")
    .notEmpty()
    .withMessage("invalid query")
    .bail()
    .custom(async (query) => {
      const requestExist = await VerificationRequest.getVerificationRequest(id);
      if (!requestExist) {
        throw new Error("invalid query");
      }
    }),
];
