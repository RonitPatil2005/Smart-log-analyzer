const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    // =========================================
    // BASIC LOG INFORMATION
    // =========================================

    timestamp: {
      type: Date,
      required: [true, "Timestamp is required"]
    },

    source: {
      type: String,
      required: [true, "Source is required"],
      trim: true
    },

    ipAddress: {
      type: String,
      trim: true
    },

    eventType: {
      type: String,
      required: [true, "Event type is required"],
      trim: true
    },

    status: {
      type: Number,
      min: [100, "Status code must be at least 100"],
      max: [599, "Status code cannot exceed 599"]
    },

    severity: {
      type: String,
      required: [true, "Severity is required"],
      enum: {
        values: [
          "INFO",
          "WARNING",
          "ERROR",
          "CRITICAL"
        ],
        message:
          "Severity must be INFO, WARNING, ERROR, or CRITICAL"
      }
    },

    message: {
      type: String,
      trim: true
    },

    // =========================================
    // ANOMALY DETECTION
    // =========================================
    // IMPORTANT:
    // These values are produced by OUR anomaly
    // detection algorithm, NOT by AI.
    // =========================================

    isAnomaly: {
      type: Boolean,
      default: false
    },

    anomalyScore: {
      type: Number,
      default: 0,
      min: 0
    },

    anomalyReason: {
      type: String,
      default: "",
      trim: true
    },

    // =========================================
    // AI ANALYSIS
    // =========================================
    // AI is used ONLY after the log has already
    // been flagged as an anomaly.
    // =========================================

    aiExplanation: {
      type: String,
      default: "",
      trim: true
    },

    likelyRootCause: {
      type: String,
      default: "",
      trim: true
    },

    recommendedNextStep: {
      type: String,
      default: "",
      trim: true
    },

    // =========================================
    // AI ANALYSIS STATUS
    // =========================================

    aiAnalysisStatus: {
      type: String,
      enum: {
        values: [
          "NOT_ANALYZED",
          "ANALYZED",
          "FAILED"
        ],
        message:
          "Invalid AI analysis status"
      },
      default: "NOT_ANALYZED"
    }
  },

  // =========================================
  // AUTOMATIC DATABASE TIMESTAMPS
  // =========================================

  {
    timestamps: true
  }
);

// =========================================
// DATABASE INDEXES
// =========================================

// Latest logs first
logSchema.index({
  timestamp: -1
});

// Quickly find anomalies and sort by score
logSchema.index({
  isAnomaly: 1,
  anomalyScore: -1
});

// Quickly filter by source
logSchema.index({
  source: 1
});

// Quickly filter by severity
logSchema.index({
  severity: 1
});

// =========================================
// EXPORT MODEL
// =========================================

module.exports = mongoose.model(
  "Log",
  logSchema
);