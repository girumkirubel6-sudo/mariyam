const express = require("express");

const {
  createZone,
  getZones,
  getZonesByRegion,
  getZoneById,
  updateZone,
  deleteZone,
} = require("../controllers/zoneController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getZones);
router.get("/region/:regionId", getZonesByRegion);
router.get("/:id", getZoneById);

// Admin / Regional Admin
router.post(
  "/",
  protect,
  authorize("ADMIN", "REGIONAL_ADMIN"),
  createZone
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "REGIONAL_ADMIN"),
  updateZone
);

router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteZone
);

module.exports = router;