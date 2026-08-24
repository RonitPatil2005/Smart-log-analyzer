const express = require("express");

const router = express.Router();

const {
  getLogs,
  getLogById,
  getStats,
  analyzeLogWithAI
} = require("../controllers/logController");

// =========================================
// GET ALL LOGS
// =========================================

router.get(
  "/",
  getLogs
);

// =========================================
// GET STATISTICS
// =========================================

router.get(
  "/stats",
  getStats
);

// =========================================
// GET SINGLE LOG
// =========================================

router.get(
  "/:id",
  getLogById
);

// =========================================
// AI ANALYSIS
// =========================================

router.post(
  "/:id/analyze",
  analyzeLogWithAI
);

module.exports = router;