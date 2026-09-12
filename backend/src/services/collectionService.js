const { prisma } = require("../config/database");

const createCollection = async ({
  submissionId,
  collectedBy,
  collectionDate,
  collectionLocation,
  notes,
}) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error("Submission not found.");
  }

  if (submission.status !== "APPROVED") {
    throw new Error(
      "Only approved submissions can be collected."
    );
  }

  const collection = await prisma.collection.create({
    data: {
      submissionId,
      collectedBy,
      collectionDate,
      collectionLocation,
      notes,
    },
  });

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "COLLECTED",
    },
  });

  return collection;
};

const getCollections = async () => {
  return prisma.collection.findMany({
    include: {
      submission: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getCollectionById = async (id) => {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      submission: true,
    },
  });
};

const archiveCollection = async (submissionId) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new Error("Submission not found.");
  }

  if (submission.status !== "COLLECTED") {
    throw new Error(
      "Only collected submissions can be archived."
    );
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "ARCHIVED",
    },
  });

  return {
    message: "Submission archived successfully.",
  };
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  archiveCollection,
};