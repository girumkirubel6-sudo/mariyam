const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      regions,
      zones,
      literature,
      archives,
      manuscripts,
      submissions,
      pendingSubmissions,
      approvedSubmissions,
      collectedSubmissions,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.region.count(),

      prisma.zone.count(),

      prisma.literature.count(),

      prisma.archive.count(),

      prisma.manuscript.count(),

      prisma.submission.count(),

      prisma.submission.count({
        where: {
          status: "SUBMITTED",
        },
      }),

      prisma.submission.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.submission.count({
        where: {
          status: "COLLECTED",
        },
      }),
    ]);

    res.json({
      users,
      regions,
      zones,
      literature,
      archives,
      manuscripts,
      submissions,
      pendingSubmissions,
      approvedSubmissions,
      collectedSubmissions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load dashboard statistics",
    });
  }
};

// Get recent submissions
const getRecentSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      include: {
        literature: true,
        archive: true,
        manuscript: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch recent submissions",
    });
  }
};

module.exports = {
  getDashboardStats,
  getRecentSubmissions,
};