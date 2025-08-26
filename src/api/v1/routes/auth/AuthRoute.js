const router = require("express").Router();
const { AuthController } = require("../../controllers");
const { VerifyToken } = require("../../middlewares");
const AuthValidator = require("../../validators/auth/AuthValidator");

router.post("/sign-up", AuthValidator.addUser, AuthController.signUp);

router.get(
  "/verify/:otp",
  VerifyToken,
  AuthValidator.getVerificationToken,
  AuthController.verify
);
router.post(
  "/send-verification",
  AuthValidator.emailExists,
  AuthController.sendVerification
);

module.exports = router;
