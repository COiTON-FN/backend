const router = require("express").Router();
const { VerificationRequestController } = require("../../controllers");
const VerificationRequestValidator = require("../../validators/verification_request/VerificationRequest");

// add verification on token middleware

router.get("/", VerificationRequestController.getVerificationRequests);
router.get(
  "/:id",
  VerificationRequestValidator.get_verification_request,
  VerificationRequestController.getVerificationRequest
);
router.post(
  "/",
  VerificationRequestValidator.create_verification_request,
  VerificationRequestController.createVerificationRequest
);

router.put(
  "/:id",
  VerificationRequestValidator.get_verification_request,
  VerificationRequestController.updateVerificationRequest
);

module.exports = router;
