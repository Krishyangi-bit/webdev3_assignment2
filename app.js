const express = require("express");
const path = require("path");

const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Custom middleware
app.use(logger);

// Routes
app.use("/students", studentRoutes);

// Error handling (must be registered last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
