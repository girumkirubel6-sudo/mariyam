// Create a standard success response
const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Create a standard error response
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// Convert a value to a number safely
const toNumber = (value, defaultValue = null) => {
  const number = Number(value);

  return Number.isNaN(number) ? defaultValue : number;
};

// Convert empty strings to null
const emptyToNull = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  return value;
};

// Create a safe filename
const createSafeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");
};

// Generate a simple unique filename
const generateFilename = (originalName) => {
  const timestamp = Date.now();
  const safeName = createSafeFilename(originalName);

  return `${timestamp}-${safeName}`;
};

module.exports = {
  successResponse,
  errorResponse,
  toNumber,
  emptyToNull,
  createSafeFilename,
  generateFilename,
};