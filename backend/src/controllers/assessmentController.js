const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Create assessment
const createAssessment = async (req, res) => {
  try {
    const {
      submissionId,
      reviewerId,
      decision,
      score,
      comments,
    } = req.body;

    if (!submissionId || !decision) {
      return res.status(400).json({
        message: "Submission and decision are required",
      });
    }

    const assessment = await prisma.assessment.create({
      data: {
        submissionId,
        reviewerId,
        decision,
        score,
        comments,
      },
    });

    // Update submission status
    let status = "UNDER_REVIEW";

    if (decision === "APPROVED") {
      status = "APPROVED";
    }

    if (decision === "REJECTED") {
      status = "REJECTED";
    }

    await prisma.submission.update({
      where: {
        id: submissionId,
      },
      data: {
        status,
      },
    });

    res.status(201).json({
      message: "Assessment completed successfully",
      assessment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create assessment",
    });
  }
};

// Get all assessments
const getAssessments = async (req, res) => {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        submission: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(assessments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch assessments",
    });
  }
};

// Get assessment by submission
const getAssessmentBySubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const assessments = await prisma.assessment.findMany({
      where: {
        submissionId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(assessments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch assessment",
    });
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentBySubmission,
};