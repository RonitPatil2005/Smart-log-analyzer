const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const analyzeAnomaly = async (log) => {

  if (!log) {
    throw new Error("Log is required for AI analysis");
  }

  if (!log.isAnomaly) {
    throw new Error(
      "AI analysis is only available for flagged anomalies"
    );
  }

  const prompt = `
You are a production log analysis assistant.

The application's own anomaly detection algorithm has already
flagged this log as anomalous.

Your job is NOT to decide whether the log is anomalous.

Your job is to:
1. Explain in plain English what happened.
2. Identify the most likely root cause.
3. Recommend the next troubleshooting step.

Be concise and practical.
Do not invent information that is not present in the log.
Clearly distinguish likely causes from confirmed facts.

Log information:

Timestamp: ${log.timestamp}
Source: ${log.source}
IP Address: ${log.ipAddress || "Not provided"}
Event Type: ${log.eventType}
Status: ${log.status || "Not provided"}
Severity: ${log.severity}
Message: ${log.message || "Not provided"}

The application's anomaly score is:
${log.anomalyScore}

The application's anomaly reason is:
${log.anomalyReason}

Return ONLY valid JSON in this exact structure:

{
  "explanation": "Plain-English explanation",
  "likelyRootCause": "Most likely root cause",
  "recommendedNextStep": "Recommended troubleshooting step"
}
`;

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
    input: prompt
  });

  const output = response.output_text;

  if (!output) {
    throw new Error(
      "OpenAI returned an empty response"
    );
  }

  let parsed;

  try {

    parsed = JSON.parse(output);

  } catch (error) {

    console.error(
      "OpenAI returned invalid JSON:",
      output
    );

    throw new Error(
      "AI returned an invalid response format"
    );
  }

  return {
    explanation:
      parsed.explanation || "",

    likelyRootCause:
      parsed.likelyRootCause || "",

    recommendedNextStep:
      parsed.recommendedNextStep || ""
  };
};

module.exports = {
  analyzeAnomaly
};