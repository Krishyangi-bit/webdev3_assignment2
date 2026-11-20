// Validation middleware, chained before controllers in studentRoutes.js

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Checks that :id is a positive integer
const validateId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return next(createError("Invalid student ID. It must be a positive integer.", 400));
  }
  req.studentId = id;
  next();
};

// Checks the request body for POST / PUT
const validateStudent = (req, res, next) => {
  const { name, email, course, age } = req.body || {};
  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) errors.push("name is required");
  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email)) errors.push("a valid email is required");
  if (!course || typeof course !== "string" || !course.trim()) errors.push("course is required");
  if (age === undefined || age === "" || !Number.isInteger(Number(age)) || Number(age) <= 0) {
    errors.push("age must be a positive integer");
  }

  if (errors.length) {
    const err = createError("Validation failed", 400);
    err.details = errors;
    return next(err);
  }
  next();
};

module.exports = { validateId, validateStudent };
