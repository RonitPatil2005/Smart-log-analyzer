import { GoogleGenAI } from "@google/genai";

// =========================================
// GEMINI CLIENT
// =========================================

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =========================================
// ANALYZE ANOMALY
// =========================================

const analyzeAnomaly = async (log) => {
  try {
    console.log("=================================");
    console.log("Starting Gemini AI analysis");
    console.log("Log ID:", log._id);

    console.log(
      "Model:",
      process.env.GEMINI_MODEL || "gemini-3.6-flash"
    );

    console.log("=================================");

    // -----------------------------------------
    // AI DOES NOT DETECT THE ANOMALY.
    // OUR ALGORITHM ALREADY DETECTED IT.
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

    // =========================================
    // GEMINI API
    // =========================================

    const response = await client.models.generateContent({
      model:
        process.env.GEMINI_MODEL ||
        "gemini-3.6-flash",

      contents: prompt,

      // -----------------------------------------
      // STRUCTURED JSON OUTPUT
      // -----------------------------------------

      config: {
        responseMimeType: "application/json",

        responseSchema: {
          type: "object",

          properties: {
            explanation: {
              type: "string",
            },

            likelyRootCause: {
              type: "string",
            },

            recommendedNextStep: {
              type: "string",
            },
          },

          required: [
            "explanation",
            "likelyRootCause",
            "recommendedNextStep",
          ],
        },
      },
    });

    console.log("Gemini response received");

    // =========================================
    // GET GEMINI OUTPUT
    // =========================================

    const output = response.text;

    console.log("AI output:");
    console.log(output);

    if (!output) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // =========================================
    // PARSE JSON
    // =========================================

    let parsed;

    try {
      parsed = JSON.parse(output);

    } catch (error) {

      console.error(
        "Gemini JSON parsing failed"
      );

      console.error(
        "Raw output:",
        output
      );

      throw new Error(
        "Gemini returned invalid JSON"
      );
    }

    // =========================================
    // VALIDATE REQUIRED FIELDS
    // =========================================

    if (
      typeof parsed.explanation !== "string" ||
      typeof parsed.likelyRootCause !== "string" ||
      typeof parsed.recommendedNextStep !== "string"
    ) {
      throw new Error(
        "Gemini response is missing required fields"
      );
    }

    // =========================================
    // RETURN CLEAN RESULT
    // =========================================

    return {
      explanation:
        parsed.explanation.trim(),

      likelyRootCause:
        parsed.likelyRootCause.trim(),

      recommendedNextStep:
        parsed.recommendedNextStep.trim(),
    };

  } catch (error) {

    console.error("=================================");
    console.error("GEMINI ANALYSIS ERROR");
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

    console.error(
      "================================="
    );

    throw error;
  }
};

// =========================================
// EXPORT
// =========================================

export {
  analyzeAnomaly,
};