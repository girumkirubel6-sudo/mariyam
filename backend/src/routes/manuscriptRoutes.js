const express = require("express");

const {
  createManuscript,
  getManuscripts,
  getManuscriptById,
  updateManuscript,
  deleteManuscript,
} = require("../controllers/manuscriptController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const {
  upload,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getManuscripts);
router.get("/:id", getManuscriptById);

// Register manuscript
router.post(
  "/",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  upload.single("file"),
  createManuscript
);

// Update manuscript
router.put(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "REGIONAL_ADMIN",
    "ZONE_ADMIN"
  ),
  updateManuscript
);

// Delete manuscript
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  deleteManuscript
);

module.exports = router;