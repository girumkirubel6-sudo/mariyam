const express = require("express");

const {
  getDashboardStats,
  getRecentSubmissions,
} = require("../controllers/adminController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Dashboard
router.get(
  "/dashboard",
  protect,
  authorize("ADMIN"),
  getDashboardStats
);

// Recent submissions
router.get(
  "/recent-submissions",
  protect,
  authorize("ADMIN"),
  getRecentSubmissions
);

module.exports = router;