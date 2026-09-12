const express = require("express");

const {
  createAssessment,
  getAssessments,
  getAssessmentBySubmission,
} = require("../controllers/assessmentController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Create assessment
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createAssessment
);

// Get assessments
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getAssessments
);

// Get assessment for submission
router.get(
  "/submission/:submissionId",
  protect,
  authorize("ADMIN"),
  getAssessmentBySubmission
);

module.exports = router;