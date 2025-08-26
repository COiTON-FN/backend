const { AuthService } = require("../../services");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse } = require("../../helpers");
//sign up new user
exports.signUp = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const data = req.body;

  try {
    const verification = await AuthService.signUp({
      email: data.email,
    });
    const { success, ...result } = verification;
    if (success) {
      MessageResponse.successResponse(
        res,
        "user successfully checked in",
        201,
        result.message
      );
    } else {
      MessageResponse.errorResponse(res, result.message, 422, result.message);
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

exports.verify = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const otp = req.params.otp;
  const authHeader = req.headers["authorization"];
  const jwt = authHeader && authHeader.split(" ")[1];

  try {
    const verification = await AuthService.verify({ otp, jwt });

    const { success, ...result } = verification;
    if (success) {
      MessageResponse.successResponse(
        res,
        "user successfully verified",
        201,
        result.message
      );
    } else {
      MessageResponse.errorResponse(res, result.error, 422, result.message);
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

exports.sendVerification = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const { email } = req.body;

  try {
    await AuthService.sendVerification(email);
    MessageResponse.successResponse(res, "Email verification sent", 201, {});
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
