const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
const errorHandler = require("../middlewares/errorHandler");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Connect to database
connectDB();

// Routes
app.use("/api/users", require("../routes/userRoutes"));
// app.use("/api/budgets", require("../routes/budgetRoutes"));
// app.use("/api/projects", require("../routes/projectRoutes"));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
