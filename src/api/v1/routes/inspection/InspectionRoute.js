const router = require("express").Router();
const { InspectionController } = require("../../controllers");
const InspectionValidator = require("../../validators/inspection/InspectionValidator");

// add verification on token middleware

router.get(
  "/:id",
  InspectionValidator.getInspection,
  InspectionController.getInspection
);
router.post(
  "/",
  InspectionValidator.create_inspection,
  InspectionController.createInspection
);

router.put(
  "/:id",
  InspectionValidator.getInspection,
  InspectionController.updateInspection
);

router.delete(
  "/:id",
  InspectionValidator.getInspection,
  InspectionController.deleteInspection
);

module.exports = router;
