const Log = require("../models/Log");

const {
  explainAnomaly
} = require("../services/aiService");

// =========================================
// ANALYZE ONE ANOMALY
// =========================================

const analyzeAnomaly = async (req, res) => {
  try {
    const { id } = req.params;

    // ---------------------------------------
    // Validate ID
    // ---------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Log ID is required"
      });
    }

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
    // IMPORTANT:
    // Only analyze logs already flagged
    // by OUR anomaly detector.
    // ---------------------------------------

    if (!log.isAnomaly) {
      return res.status(400).json({
        success: false,
        message:
          "AI analysis is only available for flagged anomalies"
      });
    }

    // ---------------------------------------
    // Call AI service
    // ---------------------------------------

    const aiResult =
      await explainAnomaly(log);

    // ---------------------------------------
    // Save AI results
    // ---------------------------------------

    log.aiExplanation =
      aiResult.explanation;

    log.likelyRootCause =
      aiResult.likelyRootCause;

    log.recommendedNextStep =
      aiResult.recommendedNextStep;

    log.aiAnalysisStatus =
      "ANALYZED";

    await log.save();

    // ---------------------------------------
    // Return updated log
    // ---------------------------------------

    return res.status(200).json({
      success: true,
      message:
        "AI analysis completed successfully",
      data: log
    });

  } catch (error) {

    console.error(
      "AI analysis error:",
      error.message
    );

    // ---------------------------------------
    // If AI failed after we found an anomaly,
    // record the failure state.
    // ---------------------------------------

    try {
      if (req.params.id) {
        await Log.findByIdAndUpdate(
          req.params.id,
          {
            aiAnalysisStatus: "FAILED"
          }
        );
      }
    } catch (updateError) {
      console.error(
        "Failed to update AI status:",
        updateError.message
      );
    }

    return res.status(500).json({
      success: false,
      message: "AI analysis failed",
      error: error.message
    });
  }
};

// =========================================
// EXPORT
// =========================================

module.exports = {
  analyzeAnomaly
};