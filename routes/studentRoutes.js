const express = require("express");
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const { validateId, validateStudent } = require("../middleware/validateStudent");

// Middleware chaining: validation runs before each controller
router.get("/", getAllStudents);
router.get("/:id", validateId, getStudentById);
router.post("/", validateStudent, createStudent);
router.put("/:id", validateId, validateStudent, updateStudent);
router.delete("/:id", validateId, deleteStudent);

module.exports = router;
