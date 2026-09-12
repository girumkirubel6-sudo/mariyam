const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register ancient manuscript
const createManuscript = async (req, res) => {
  try {
    const {
      title,
      author,
      estimatedDate,
      language,
      script,
      description,
      historicalSignificance,
      physicalCondition,
      currentLocation,
      regionId,
      zoneId,
    } = req.body;

    if (!title || !regionId || !zoneId) {
      return res.status(400).json({
        message: "Title, region and zone are required",
      });
    }

    const manuscript = await prisma.manuscript.create({
      data: {
        title,
        author,
        estimatedDate,
        language,
        script,
        description,
        historicalSignificance,
        physicalCondition,
        currentLocation,
        regionId,
        zoneId,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Manuscript registered successfully",
      manuscript,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to register manuscript",
    });
  }
};

// Get all manuscripts
const getManuscripts = async (req, res) => {
  try {
    const manuscripts = await prisma.manuscript.findMany({
      include: {
        region: true,
        zone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(manuscripts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch manuscripts",
    });
  }
};

// Get manuscript by ID
const getManuscriptById = async (req, res) => {
  try {
    const { id } = req.params;

    const manuscript = await prisma.manuscript.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
      },
    });

    if (!manuscript) {
      return res.status(404).json({
        message: "Manuscript not found",
      });
    }

    res.json(manuscript);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch manuscript",
    });
  }
};

// Update manuscript
const updateManuscript = async (req, res) => {
  try {
    const { id } = req.params;

    const manuscript = await prisma.manuscript.update({
      where: { id },
      data: req.body,
    });

    res.json({
      message: "Manuscript updated successfully",
      manuscript,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update manuscript",
    });
  }
};

// Delete manuscript
const deleteManuscript = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.manuscript.delete({
      where: { id },
    });

    res.json({
      message: "Manuscript deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete manuscript",
    });
  }
};

module.exports = {
  createManuscript,
  getManuscripts,
  getManuscriptById,
  updateManuscript,
  deleteManuscript,
};