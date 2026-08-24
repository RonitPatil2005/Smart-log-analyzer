require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const logRoutes = require("./routes/logRoutes");

const app = express();

// =========================================
// ENVIRONMENT VARIABLES
// =========================================

const PORT = process.env.PORT || 5000;

// =========================================
// MIDDLEWARE
// =========================================

app.use(cors());

app.use(express.json());

// =========================================
// HEALTH CHECK
// =========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Log Analyzer API is running"
  });
});

// =========================================
// LOG ROUTES
// =========================================

app.use(
  "/api/logs",
  logRoutes
);

// =========================================
// ERROR HANDLER
// =========================================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

// =========================================
// START SERVER
// =========================================

const startServer = async () => {
  try {

    // -----------------------------------------
    // Connect MongoDB first
    // -----------------------------------------

    await connectDB();

    console.log(
      "MongoDB connected successfully"
    );

    // -----------------------------------------
    // Start Express server
    // -----------------------------------------

    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

      console.log(
        `OpenAI configured: ${
          process.env.OPENAI_API_KEY
            ? "YES"
            : "NO"
        }`
      );

      console.log(
        `OpenAI model: ${
          process.env.OPENAI_MODEL ||
          "not configured"
        }`
      );

    });

  } catch (error) {

    console.error(
      "Failed to start server:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
};

startServer();