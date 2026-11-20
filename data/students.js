// In-memory data store (no database). Data resets when the server restarts.
const students = [
  { id: 1, name: "Rahul", email: "rahul@example.com", course: "BCA", age: 20 },
  { id: 2, name: "Priya", email: "priya@example.com", course: "BTech", age: 21 },
  { id: 3, name: "Amit", email: "amit@example.com", course: "BCA", age: 19 },
];

module.exports = students;
