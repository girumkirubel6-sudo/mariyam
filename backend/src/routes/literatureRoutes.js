const express = require("express");

const {
  createLiterature,
  getLiterature,
  getLiteratureById,
  updateLiterature,
  deleteLiterature,
} = require("../controllers/literatureController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Public
router.get("/", getLiterature);
router.get("/:id", getLiteratureById);

// Registration
router.post(
  "/",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  createLiterature
);

// Update
router.put(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  updateLiterature
);

// Delete
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteLiterature
);

module.exports = router;