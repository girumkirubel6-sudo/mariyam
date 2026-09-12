const express = require("express");

const {
  createArchive,
  getArchives,
  getArchiveById,
  updateArchive,
  deleteArchive,
} = require("../controllers/archiveController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getArchives);
router.get("/:id", getArchiveById);

// Register archive
router.post(
  "/",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  createArchive
);

// Update archive
router.put(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  updateArchive
);

// Delete archive
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteArchive
);

module.exports = router;