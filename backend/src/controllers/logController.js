const Log = require("../models/Log");

const {
  analyzeAnomaly
} = require("../services/aiService");

// =========================================
// GET ALL LOGS
// =========================================

const getLogs = async (req, res) => {
  try {

    const logs = await Log.find()
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });

  } catch (error) {

    console.error(
      "Get logs error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message
    });
  }
};


// =========================================
// GET SINGLE LOG
// =========================================

const getLogById = async (req, res) => {
  try {

    const { id } = req.params;

    const log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Log not found"
      });
    }

    res.status(200).json({
      success: true,
      data: log
    });

  } catch (error) {

    console.error(
      "Get log error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch log",
      error: error.message
    });
  }
};


// =========================================
// GET STATISTICS
// =========================================

const getStats = async (req, res) => {
  try {

    const totalLogs = await Log.countDocuments();

    const anomalies = await Log.countDocuments({
      isAnomaly: true
    });

    const critical = await Log.countDocuments({
      severity: "CRITICAL"
    });

    const errors = await Log.countDocuments({
      severity: "ERROR"
    });

    const warnings = await Log.countDocuments({
      severity: "WARNING"
    });

    const normal = await Log.countDocuments({
      isAnomaly: false
    });

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        anomalies,
        critical,
        errors,
        warnings,
        normal
      }
    });

  } catch (error) {

    console.error(
      "Get stats error:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message
    });
  }
};


// =========================================
// ANALYZE ANOMALY WITH AI
// =========================================

const analyzeLogWithAI = async (req, res) => {

  try {

    const { id } = req.params;

    console.log(
      "AI analysis requested for:",
      id
    );

    // ---------------------------------------
    // Find log
    // ---------------------------------------

    const log = await Log.findById(id);

    if (!log) {

      return res.status(404).json({
        success: false,
        message: "Log not found"
      });

    }

    // ---------------------------------------
    // AI ONLY ANALYZES DETECTED ANOMALIES
    // ---------------------------------------

    if (!log.isAnomaly) {

      return res.status(400).json({
        success: false,
        message:
          "AI analysis is only available for anomalous logs"
      });

    }

    // ---------------------------------------
    // Call Gemini AI
    // ---------------------------------------

    console.log(
      "Sending anomaly to AI..."
    );

    const aiResult =
      await analyzeAnomaly(log);

    // ---------------------------------------
    // IMPORTANT
    // DO NOT SAVE AI ANALYSIS TO MONGODB
    // ---------------------------------------

    const temporaryLog = {

      ...log.toObject(),

      aiExplanation:
        aiResult.explanation,

      likelyRootCause:
        aiResult.likelyRootCause,

      recommendedNextStep:
        aiResult.recommendedNextStep,

      aiAnalysisStatus:
        "ANALYZED"

    };

    console.log(
      "AI analysis generated temporarily"
    );

    // ---------------------------------------
    // RETURN TEMPORARY RESULT
    // ---------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "AI analysis completed successfully",

      data:
        temporaryLog

    });

  } catch (error) {

    console.error(
      "AI analysis failed:",
      error.message
    );

    // ---------------------------------------
    // DO NOT SAVE FAILED STATUS TO DATABASE
    // ---------------------------------------

    return res.status(500).json({

      success: false,

      message:
        "AI analysis failed",

      error:
        error.message

    });
  }
};


// =========================================
// EXPORT CONTROLLERS
// =========================================

module.exports = {
  getLogs,
  getLogById,
  getStats,
  analyzeLogWithAI
};