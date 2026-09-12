const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create submission
const createSubmission = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      literatureId,
      archiveId,
      manuscriptId,
      submittedBy,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        message: "Title and submission type are required",
      });
    }

    const submission = await prisma.submission.create({
      data: {
        title,
        type,
        description,
        literatureId,
        archiveId,
        manuscriptId,
        submittedBy,
        status: "SUBMITTED",
      },
    });

    res.status(201).json({
      message: "Submission created successfully",
      submission,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create submission",
    });
  }
};

// Get all submissions
const getSubmissions = async (req, res) => {
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
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch submissions",
    });
  }
};

// Get pending submissions
const getPendingSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      where: {
        status: "SUBMITTED",
      },
      include: {
        literature: true,
        archive: true,
        manuscript: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    res.json(submissions);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch pending submissions",
    });
  }
};

// Get submission by ID
const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        literature: true,
        archive: true,
        manuscript: true,
      },
    });

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.json(submission);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch submission",
    });
  }
};

// Update submission status
const updateSubmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "SUBMITTED",
      "UNDER_REVIEW",
      "APPROVED",
      "REJECTED",
      "COLLECTED",
      "ARCHIVED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid submission status",
      });
    }

    const submission = await prisma.submission.update({
      where: { id },
      data: { status },
    });

    res.json({
      message: "Submission status updated successfully",
      submission,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update submission status",
    });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
};