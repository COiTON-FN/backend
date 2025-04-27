const { param, body } = require("express-validator");
const { Inspection } = require("../../database/classes");

exports.create_inspection = [
  body("data").notEmpty().withMessage("Invalid query").bail(),
  body("id")
    .notEmpty()
    .withMessage("Invalid query")
    .bail()
    .custom(async (id) => {
      const inspection = await Inspection.getInspection(id);
      if (inspection) {
        throw new Error("Inspection Already exist");
      }
    }),
];

exports.getInspection = [
  param("id")
    .notEmpty()
    .withMessage("invalid query")
    .bail()
    .custom(async (id) => {
      const inspection = await Inspection.getInspection(id);
      if (!inspection) {
        throw new Error("invalid query");
      }
    }),
];
