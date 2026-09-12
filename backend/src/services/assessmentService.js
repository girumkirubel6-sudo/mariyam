const { prisma } = require("../config/database");

const createAssessment = async ({
  submissionId,
  reviewerId,
  decision,
  score,
  comments,
}) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error("Submission not found.");
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

  let status = "UNDER_REVIEW";

  if (decision === "APPROVED") {
    status = "APPROVED";
  } else if (decision === "REJECTED") {
    status = "REJECTED";
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status },
  });

  return assessment;
};

const getAssessments = async () => {
  return prisma.assessment.findMany({
    include: {
      submission: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getAssessmentBySubmission = async (submissionId) => {
  return prisma.assessment.findMany({
    where: {
      submissionId,
    },
    include: {
      submission: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentBySubmission,
};