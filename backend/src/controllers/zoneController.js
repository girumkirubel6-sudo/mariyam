const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create zone
const createZone = async (req, res) => {
  try {
    const { name, code, description, regionId } = req.body;

    if (!name || !regionId) {
      return res.status(400).json({
        message: "Zone name and region are required",
      });
    }

    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }

    const zone = await prisma.zone.create({
      data: {
        name,
        code,
        description,
        regionId,
      },
    });

    res.status(201).json({
      message: "Zone created successfully",
      zone,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create zone",
    });
  }
};

// Get all zones
const getZones = async (req, res) => {
  try {
    const zones = await prisma.zone.findMany({
      include: {
        region: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(zones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch zones",
    });
  }
};

// Get zones by region
const getZonesByRegion = async (req, res) => {
  try {
    const { regionId } = req.params;

    const zones = await prisma.zone.findMany({
      where: {
        regionId,
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(zones);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch zones",
    });
  }
};

// Get one zone
const getZoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await prisma.zone.findUnique({
      where: { id },
      include: {
        region: true,
      },
    });

    if (!zone) {
      return res.status(404).json({
        message: "Zone not found",
      });
    }

    res.json(zone);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch zone",
    });
  }
};

// Update zone
const updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, regionId } = req.body;

    const zone = await prisma.zone.update({
      where: { id },
      data: {
        name,
        code,
        description,
        regionId,
      },
    });

    res.json({
      message: "Zone updated successfully",
      zone,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update zone",
    });
  }
};

// Delete zone
const deleteZone = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.zone.delete({
      where: { id },
    });

    res.json({
      message: "Zone deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete zone",
    });
  }
};

module.exports = {
  createZone,
  getZones,
  getZonesByRegion,
  getZoneById,
  updateZone,
  deleteZone,
};s