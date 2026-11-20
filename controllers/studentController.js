// Controller: business logic for student CRUD operations
const students = require("../data/students");

const notFoundError = (id) => {
  const err = new Error(`Student with ID ${id} not found`);
  err.status = 404;
  return err;
};

const nextId = () => (students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1);

const buildStudent = ({ name, email, course, age }) => ({
  name: name.trim(),
  email: email.trim().toLowerCase(),
  course: course.trim(),
  age: Number(age),
});

const emailTaken = (email, ignoreId) =>
  students.some((s) => s.email === email.trim().toLowerCase() && s.id !== ignoreId);

// GET /students  (optional ?course= filter)
const getAllStudents = (req, res) => {
  const { course } = req.query;
  const result = course
    ? students.filter((s) => s.course.toLowerCase() === course.toLowerCase())
    : students;

  res.status(200).json({ success: true, count: result.length, data: result });
};

// GET /students/:id
const getStudentById = (req, res, next) => {
  const student = students.find((s) => s.id === req.studentId);
  if (!student) return next(notFoundError(req.studentId));

  res.status(200).json({ success: true, data: student });
};

// POST /students
const createStudent = (req, res, next) => {
  if (emailTaken(req.body.email)) {
    const err = new Error("A student with this email already exists");
    err.status = 400;
    return next(err);
  }

  const student = { id: nextId(), ...buildStudent(req.body) };
  students.push(student);

  res.status(201).json({ success: true, message: "Student created", data: student });
};

// PUT /students/:id
const updateStudent = (req, res, next) => {
  const index = students.findIndex((s) => s.id === req.studentId);
  if (index === -1) return next(notFoundError(req.studentId));

  if (emailTaken(req.body.email, req.studentId)) {
    const err = new Error("A student with this email already exists");
    err.status = 400;
    return next(err);
  }

  students[index] = { id: req.studentId, ...buildStudent(req.body) };
  res.status(200).json({ success: true, message: "Student updated", data: students[index] });
};

// DELETE /students/:id
const deleteStudent = (req, res, next) => {
  const index = students.findIndex((s) => s.id === req.studentId);
  if (index === -1) return next(notFoundError(req.studentId));

  const [removed] = students.splice(index, 1);
  res.status(200).json({ success: true, message: "Student deleted", data: removed });
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
