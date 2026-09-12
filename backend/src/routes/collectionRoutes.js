const express = require("express");

const {
  createCollection,
  getCollections,
  getCollectionById,
  archiveCollection,
} = require("../controllers/collectionController");

const {
  protect,
} = require("../middleware/authMiddleware");

const {
  authorize,
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Create collection record
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createCollection
);

// Get collections
router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getCollections
);

// Get collection
router.get(
  "/:id",
  protect,
  authorize("ADMIN"),
  getCollectionById
);

// Archive material
router.patch(
  "/archive/:submissionId",
  protect,
  authorize("ADMIN"),
  archiveCollection
);

module.exports = router;