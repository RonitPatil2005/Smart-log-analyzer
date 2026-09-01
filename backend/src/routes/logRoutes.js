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
// GET /api/logs
// =========================================

router.get(
  "/",
  getLogs
);

// =========================================
// GET STATISTICS
// GET /api/logs/stats
// =========================================

router.get(
  "/stats",
  getStats
);

// =========================================
// GET ANOMALIES
// GET /api/logs/anomalies
// =========================================

router.get(
  "/anomalies",
  async (req, res, next) => {
    try {
      const Log = require("../models/Log");

      const anomalies = await Log.find({
        isAnomaly: true
      }).sort({
        anomalyScore: -1
      });

      res.status(200).json({
        success: true,
        count: anomalies.length,
        data: anomalies
      });
    } catch (error) {
      next(error);
    }
  }
);

// =========================================
// AI ANALYSIS
// POST /api/logs/:id/analyze
// =========================================

router.post(
  "/:id/analyze",
  analyzeLogWithAI
);

// =========================================
// GET SINGLE LOG
// GET /api/logs/:id
// =========================================

router.get(
  "/:id",
  getLogById
);

module.exports = router;