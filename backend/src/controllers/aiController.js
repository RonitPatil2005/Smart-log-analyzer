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
    // Only analyze logs already flagged
    // by our anomaly detector
    // ---------------------------------------

    if (!log.isAnomaly) {

      return res.status(400).json({
        success: false,
        message:
          "AI analysis is only available for flagged anomalies"
      });

    }


    // ---------------------------------------
    // Call Gemini AI service
    // ---------------------------------------

    const aiResult =
      await explainAnomaly(log);


    // ---------------------------------------
    // IMPORTANT
    // Do NOT save AI analysis to MongoDB.
    //
    // Create a temporary response object
    // only for the frontend.
    // ---------------------------------------

    const responseLog = {

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


    // ---------------------------------------
    // Return temporary AI analysis
    // ---------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "AI analysis completed successfully",

      data: responseLog

    });


  } catch (error) {

    console.error(
      "AI analysis error:",
      error.message
    );


    // ---------------------------------------
    // IMPORTANT
    // Do NOT save FAILED status to MongoDB.
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
// EXPORT
// =========================================

module.exports = {
  analyzeAnomaly
};