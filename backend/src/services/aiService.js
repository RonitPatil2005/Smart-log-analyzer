const OpenAI = require("openai");

// =========================================
// OPENAI CLIENT
// =========================================

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// =========================================
// ANALYZE ANOMALY
// =========================================

const analyzeAnomaly = async (log) => {
  try {

    console.log("=================================");
    console.log("Starting AI analysis");
    console.log("Log ID:", log._id);
    console.log(
      "Model:",
      process.env.OPENAI_MODEL || "gpt-5.6-luna"
    );
    console.log("=================================");

    // -----------------------------------------
    // IMPORTANT
    // AI DOES NOT DETECT THE ANOMALY.
    // Our algorithm already detected it.
    // -----------------------------------------

    const prompt = `
You are a senior production systems engineer helping investigate a log anomaly.

The application has ALREADY detected this log entry as anomalous using its own anomaly detection algorithm.

Your job is NOT to decide whether the log is anomalous.

Your job is to:

1. Explain in plain English what happened.
2. Identify the most likely technical root cause.
3. Recommend a practical next step for an engineer.

Use only the information available in the log.
Do not invent facts.
If the exact root cause cannot be known from the log, clearly state that it is a likely hypothesis.

Detected anomaly information:

Timestamp:
${log.timestamp}

Source:
${log.source}

IP Address:
${log.ipAddress || "Unknown"}

Event Type:
${log.eventType}

HTTP Status:
${log.status || "Unknown"}

Severity:
${log.severity}

Message:
${log.message || "No message"}

Anomaly Score:
${log.anomalyScore}

Detection Reason:
${log.anomalyReason || "Not specified"}
`;

    // -----------------------------------------
    // OPENAI RESPONSES API
    // -----------------------------------------

    const response = await client.responses.create({

      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-luna",

      input: prompt,

      // ---------------------------------------
      // Structured output
      // ---------------------------------------

      text: {
        format: {
          type: "json_schema",

          name: "anomaly_analysis",

          strict: true,

          schema: {
            type: "object",

            properties: {

              explanation: {
                type: "string"
              },

              likelyRootCause: {
                type: "string"
              },

              recommendedNextStep: {
                type: "string"
              }

            },

            required: [
              "explanation",
              "likelyRootCause",
              "recommendedNextStep"
            ],

            additionalProperties: false
          }
        }
      }

    });

    console.log(
      "OpenAI response received"
    );

    // -----------------------------------------
    // Get structured output
    // -----------------------------------------

    const output = response.output_text;

    console.log("AI output:");
    console.log(output);

    if (!output) {

      throw new Error(
        "OpenAI returned an empty response"
      );

    }

    // -----------------------------------------
    // Parse JSON
    // -----------------------------------------

    let parsed;

    try {

      parsed = JSON.parse(output);

    } catch (error) {

      console.error(
        "AI JSON parsing failed"
      );

      console.error(
        "Raw output:",
        output
      );

      throw new Error(
        "AI returned invalid JSON"
      );

    }

    // -----------------------------------------
    // Validate fields
    // -----------------------------------------

    if (
      typeof parsed.explanation !== "string" ||
      typeof parsed.likelyRootCause !== "string" ||
      typeof parsed.recommendedNextStep !== "string"
    ) {

      throw new Error(
        "AI response is missing required fields"
      );

    }

    // -----------------------------------------
    // Return clean result
    // -----------------------------------------

    return {

      explanation:
        parsed.explanation.trim(),

      likelyRootCause:
        parsed.likelyRootCause.trim(),

      recommendedNextStep:
        parsed.recommendedNextStep.trim()

    };

  } catch (error) {

    console.error("=================================");
    console.error("OPENAI ANALYSIS ERROR");
    console.error("=================================");

    console.error(
      "Message:",
      error.message
    );

    if (error.status) {

      console.error(
        "Status:",
        error.status
      );

    }

    if (error.code) {

      console.error(
        "Code:",
        error.code
      );

    }

    if (error.type) {

      console.error(
        "Type:",
        error.type
      );

    }

    console.error("=================================");

    throw error;
  }
};

// =========================================
// EXPORT
// =========================================

module.exports = {
  analyzeAnomaly
};