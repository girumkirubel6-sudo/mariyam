const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create region
const createRegion = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Region name is required",
      });
    }

    const existingRegion = await prisma.region.findFirst({
      where: {
        OR: [
          { name },
          ...(code ? [{ code }] : []),
        ],
      },
    });

    if (existingRegion) {
      return res.status(400).json({
        message: "Region already exists",
      });
    }

    const region = await prisma.region.create({
      data: {
        name,
        code,
        description,
      },
    });

    res.status(201).json({
      message: "Region created successfully",
      region,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create region",
    });
  }
};

// Get all regions
const getRegions = async (req, res) => {
  try {
    const regions = await prisma.region.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(regions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch regions",
    });
  }
};

// Get one region
const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;

    const region = await prisma.region.findUnique({
      where: { id },
      include: {
        zones: true,
      },
    });

    if (!region) {
      return res.status(404).json({
        message: "Region not found",
      });
    }

    res.json(region);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch region",
    });
  }
};

// Update region
const updateRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const region = await prisma.region.update({
      where: { id },
      data: {
        name,
        code,
        description,
      },
    });

    res.json({
      message: "Region updated successfully",
      region,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update region",
    });
  }
};

// Delete region
const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.region.delete({
      where: { id },
    });

    res.json({
      message: "Region deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete region",
    });
  }
};

module.exports = {
  createRegion,
  getRegions,
  getRegionById,
  updateRegion,
  deleteRegion,
};