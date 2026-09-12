const { prisma } = require("../config/database");

const createNotification = async ({
  userId,
  title,
  message,
  type,
}) => {
  return prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
};

const getUserNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const markNotificationAsRead = async (id) => {
  return prisma.notification.update({
    where: { id },
    data: {
      isRead: true,
    },
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
};