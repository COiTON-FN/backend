const { CheckDBResponse } = require("../../helpers");
const { Inspection } = require("../../database/classes");
const { errorResponse } = require("../../helpers/messages/CheckDBStatus");

exports.createInspection = async (data) => {
  try {
    const newInspection = await Inspection.createInspection(data);
    return CheckDBResponse.response(newInspection);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};

exports.getInspection = async (id) => {
  try {
    const inspection = await Inspection.getInspection(id);

    return CheckDBResponse.response(inspection);
  } catch (error) {
    return CheckDBResponse.errorResponse(error);
  }
};

exports.updateInspection = async (id, data) => {
  try {
    const updatedInspection = await Inspection.updateInspection(id, data);
    return CheckDBResponse.response(updatedInspection);
  } catch (error) {
    console.log(error);
    return CheckDBResponse.errorResponse(error);
  }
};

exports.deleteInspection = async (id) => {
  try {
    const result = await Inspection.deleteInspection(id);
    return CheckDBResponse.successResponse(result.message);
  } catch (error) {
    console.log(error);
    CheckDBResponse.errorResponse(error);
  }
};
