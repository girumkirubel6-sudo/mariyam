const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register literature
const createLiterature = async (req, res) => {
  try {
    const {
      title,
      author,
      language,
      publicationYear,
      category,
      description,
      regionId,
      zoneId,
      location,
    } = req.body;

    if (!title || !regionId || !zoneId) {
      return res.status(400).json({
        message: "Title, region and zone are required",
      });
    }

    const literature = await prisma.literature.create({
      data: {
        title,
        author,
        language,
        publicationYear,
        category,
        description,
        regionId,
        zoneId,
        location,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Literature registered successfully",
      literature,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to register literature",
    });
  }
};

// Get all literature
const getLiterature = async (req, res) => {
  try {
    const literature = await prisma.literature.findMany({
      include: {
        region: true,
        zone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(literature);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch literature",
    });
  }
};

// Get literature by ID
const getLiteratureById = async (req, res) => {
  try {
    const { id } = req.params;

    const literature = await prisma.literature.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
      },
    });

    if (!literature) {
      return res.status(404).json({
        message: "Literature not found",
      });
    }

    res.json(literature);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch literature",
    });
  }
};

// Update literature
const updateLiterature = async (req, res) => {
  try {
    const { id } = req.params;

    const literature = await prisma.literature.update({
      where: { id },
      data: req.body,
    });

    res.json({
      message: "Literature updated successfully",
      literature,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update literature",
    });
  }
};

// Delete literature
const deleteLiterature = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.literature.delete({
      where: { id },
    });

    res.json({
      message: "Literature deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete literature",
    });
  }
};

module.exports = {
  createLiterature,
  getLiterature,
  getLiteratureById,
  updateLiterature,
  deleteLiterature,
};