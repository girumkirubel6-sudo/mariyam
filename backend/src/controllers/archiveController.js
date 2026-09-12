const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Register archive
const createArchive = async (req, res) => {
  try {
    const {
      title,
      archiveType,
      description,
      date,
      language,
      regionId,
      zoneId,
      location,
    } = req.body;

    if (!title || !regionId || !zoneId) {
      return res.status(400).json({
        message: "Title, region and zone are required",
      });
    }

    const archive = await prisma.archive.create({
      data: {
        title,
        archiveType,
        description,
        date,
        language,
        regionId,
        zoneId,
        location,
        status: "PENDING",
      },
    });

    res.status(201).json({
      message: "Archive registered successfully",
      archive,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to register archive",
    });
  }
};

// Get all archives
const getArchives = async (req, res) => {
  try {
    const archives = await prisma.archive.findMany({
      include: {
        region: true,
        zone: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(archives);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch archives",
    });
  }
};

// Get archive by ID
const getArchiveById = async (req, res) => {
  try {
    const { id } = req.params;

    const archive = await prisma.archive.findUnique({
      where: { id },
      include: {
        region: true,
        zone: true,
      },
    });

    if (!archive) {
      return res.status(404).json({
        message: "Archive not found",
      });
    }

    res.json(archive);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch archive",
    });
  }
};

// Update archive
const updateArchive = async (req, res) => {
  try {
    const { id } = req.params;

    const archive = await prisma.archive.update({
      where: { id },
      data: req.body,
    });

    res.json({
      message: "Archive updated successfully",
      archive,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update archive",
    });
  }
};

// Delete archive
const deleteArchive = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.archive.delete({
      where: { id },
    });

    res.json({
      message: "Archive deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete archive",
    });
  }
};

module.exports = {
  createArchive,
  getArchives,
  getArchiveById,
  updateArchive,
  deleteArchive,
};