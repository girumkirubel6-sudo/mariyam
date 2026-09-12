// Check whether required fields exist
const validateRequiredFields = (data, fields) => {
  const missingFields = [];

  fields.forEach((field) => {
    if (
      data[field] === undefined ||
      data[field] === null ||
      String(data[field]).trim() === ""
    ) {
      missingFields.push(field);
    }
  });

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password
const isValidPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};

// Validate ID
const isValidId = (id) => {
  return id !== undefined && id !== null && String(id).trim() !== "";
};

module.exports = {
  validateRequiredFields,
  isValidEmail,
  isValidPassword,
  isValidId,
};