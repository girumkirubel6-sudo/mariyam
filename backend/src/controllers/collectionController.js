const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create collection record
const createCollection = async (req, res) => {
  try {
    const {
      submissionId,
      collectedBy,
      collectionDate,
      collectionLocation,
      notes,
    } = req.body;

    if (!submissionId) {
      return res.status(400).json({
        message: "Submission ID is required",
      });
    }

    const submission = await prisma.submission.findUnique({
      where: {
        id: submissionId,
      },
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    if (submission.status !== "APPROVED") {
      return res.status(400).json({
        message: "Only approved submissions can be collected",
      });
    }

    const collection = await prisma.collection.create({
      data: {
        submissionId,
        collectedBy,
        collectionDate: collectionDate
          ? new Date(collectionDate)
          : new Date(),
        collectionLocation,
        notes,
      },
    });

    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "COLLECTED",
      },
    });

    res.status(201).json({
      message: "Collection recorded successfully",
      collection,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to record collection",
    });
  }
};

// Get all collections
const getCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        submission: true,
      },
      orderBy: {
        collectionDate: "desc",
      },
    });

    res.json(collections);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch collections",
    });
  }
};

// Get collection by ID
const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await prisma.collection.findUnique({
      where: { id },
      include: {
        submission: true,
      },
    });

    if (!collection) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.json(collection);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch collection",
    });
  }
};

// Mark collection as archived
const archiveCollection = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status: "ARCHIVED",
      },
    });

    res.json({
      message: "Material successfully archived",
      submission,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to archive material",
    });
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  archiveCollection,
};