const express = require("express");

const {
  createSubmission,
  getSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
} = require("../controllers/submissionController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Create submission
router.post(
  "/",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  createSubmission
);

// Get submissions
router.get(
  "/",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  getSubmissions
);

// Pending submissions
router.get(
  "/pending",
  protect,
  authorize("ADMIN"),
  getPendingSubmissions
);

// Get single submission
router.get(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  getSubmissionById
);

// Update status
router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateSubmissionStatus
);

module.exports = router;