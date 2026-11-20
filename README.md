# Student Management REST API

Lab Assignment 2 – Web Dev III (Node.js & Express). A REST API for student records that stores data in an in-memory array instead of a database. It comes with a minimal web frontend.

## Run

```bash
npm install
npm start
```

Open http://localhost:3000 to use the frontend. The API is served at http://localhost:3000/students.

## Project structure

```
app.js                        Express server setup, middleware and route mounting
routes/studentRoutes.js       Modular routing (express.Router) + middleware chaining
controllers/studentController.js  Business logic for CRUD (MVC controller)
middleware/logger.js          Custom logger (method, URL, status, time, duration)
middleware/validateStudent.js Validates :id and the request body
middleware/errorHandler.js    404 handler + central error handler
data/students.js              In-memory student array (the model/data layer)
public/                       Minimal frontend (HTML, CSS, JS)
```

## API

| Method | Endpoint        | Description          | Success | Errors   |
| ------ | --------------- | -------------------- | ------- | -------- |
| GET    | `/students`     | Get all students (optional `?course=BCA`) | 200 | – |
| GET    | `/students/:id` | Get one student      | 200     | 400, 404 |
| POST   | `/students`     | Create a student     | 201     | 400      |
| PUT    | `/students/:id` | Update a student     | 200     | 400, 404 |
| DELETE | `/students/:id` | Delete a student     | 200     | 400, 404 |

Unknown routes return `404`. Unexpected errors return `500`.

### Request body (POST / PUT)

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "course": "BCA",
  "age": 20
}
```

All fields are required. The email must be valid and not used by another student, and the age must be a positive integer.

### Response examples

```json
// 201 Created
{ "success": true, "message": "Student created", "data": { "id": 4, "name": "Rahul", ... } }

// 400 Bad Request
{ "success": false, "message": "Validation failed", "errors": ["email is required"] }

// 404 Not Found
{ "success": false, "message": "Student with ID 99 not found" }
```

## Testing with Postman

1. Start the server with `npm start`.
2. For POST and PUT, set **Body → raw → JSON** and send the JSON shown above.
3. Watch the terminal: the logger prints each request, e.g.
   `[2026-11-20T08:03:59.565Z] GET /students -> 200 (4ms)`

Data resets when the server restarts because no database is used.
