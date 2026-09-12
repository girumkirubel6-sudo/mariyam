const express = require("express");

const {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
} = require("../controllers/regionController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getRegions);
router.get("/:id", getRegionById);

// Admin only
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createRegion
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateRegion
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteRegion
);

module.exports = router;