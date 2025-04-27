const { InspectionService } = require("../../services");
const { CheckBadRequest } = require("../../validations");
const { MessageResponse } = require("../../helpers");

exports.createInspection = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  try {
    const newInspection = await InspectionService.createInspection(req.body);
    const { success, ...result } = newInspection;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Inspection created Successfully",
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

exports.updateInspection = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const data = req.body;
  const { id } = req.params;
  try {
    const updatedInspection = await InspectionService.updateInspection(id, {
      ...data,
      id: undefined,
    });
    const { success, ...result } = updatedInspection;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Inspection updated Successfully",
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

exports.deleteInspection = async (req, res, next) => {
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  const { id } = req.params;

  try {
    const deletedInspection = await InspectionService.deleteInspection(id);
    const { success, ...result } = deletedInspection;
    if (success) {
      MessageResponse.successResponse(
        res,
        "Inspection deleted Successfully",
        200,
        result.data
      );
    } else {
      console.log(result);
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

exports.getInspection = async (req, res, next) => {
  const id = req.params.id;
  //check for errors
  const errors = CheckBadRequest(req, res, next);
  if (errors) return next(errors);
  try {
    const inspection = await InspectionService.getInspection(id);
    return MessageResponse.successResponse(
      res,
      "Inspection found",
      200,
      inspection.data
    );
  } catch (error) {
    return MessageResponse.errorResponse(res, "server error", 500, error);
  }
};
