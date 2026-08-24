const dotenv = require("dotenv");
const { faker } = require("@faker-js/faker");

const connectDB = require("../config/db");
const Log = require("../models/Log");

const {
  calculateAnomalyScore
} = require("../services/anomalyDetector");

dotenv.config();

// -----------------------------------------
// NORMAL LOG DATA
// -----------------------------------------

const sources = [
  "api-server-1",
  "api-server-2",
  "auth-service",
  "payment-service",
  "user-service"
];

const endpoints = [
  "GET /api/users",
  "GET /api/orders",
  "GET /api/products",
  "POST /api/orders",
  "GET /api/profile"
];

const severities = [
  "INFO",
  "INFO",
  "INFO",
  "WARNING"
];

// -----------------------------------------
// GENERATE NORMAL LOG
// -----------------------------------------

const generateNormalLog = () => {
  const statusOptions = [
    200,
    200,
    200,
    201,
    204
  ];

  const status =
    statusOptions[
      Math.floor(Math.random() * statusOptions.length)
    ];

  return {
    timestamp: faker.date.between({
      from: "2026-08-20T00:00:00.000Z",
      to: "2026-08-20T23:59:59.000Z"
    }),

    source:
      sources[
        Math.floor(Math.random() * sources.length)
      ],

    ipAddress: faker.internet.ip(),

    eventType:
      endpoints[
        Math.floor(Math.random() * endpoints.length)
      ],

    status,

    severity:
      severities[
        Math.floor(Math.random() * severities.length)
      ],

    message: "Request completed successfully"
  };
};

// -----------------------------------------
// GENERATE INTENTIONAL ANOMALIES
// -----------------------------------------

const generateAnomalies = () => {
  const anomalies = [];

  // ---------------------------------------
  // Anomaly 1
  // Internal server error
  // ---------------------------------------

  anomalies.push({
    timestamp: new Date(
      "2026-08-20T09:15:45.000Z"
    ),

    source: "payment-service",

    ipAddress: "10.0.0.55",

    eventType: "POST /api/payment",

    status: 500,

    severity: "ERROR",

    message:
      "Internal server error while processing payment"
  });

  // ---------------------------------------
  // Anomaly 2
  // Unauthorized admin access
  // ---------------------------------------

  anomalies.push({
    timestamp: new Date(
      "2026-08-20T09:16:10.000Z"
    ),

    source: "auth-service",

    ipAddress: "203.0.113.7",

    eventType: "GET /admin",

    status: 403,

    severity: "WARNING",

    message:
      "Access denied for protected admin endpoint"
  });

  // ---------------------------------------
  // Anomaly 3
  // Payment service unavailable
  // ---------------------------------------

  anomalies.push({
    timestamp: new Date(
      "2026-08-20T10:30:20.000Z"
    ),

    source: "payment-service",

    ipAddress: "192.168.1.25",

    eventType: "POST /api/payment",

    status: 503,

    severity: "CRITICAL",

    message:
      "Payment service temporarily unavailable"
  });

  // ---------------------------------------
  // Anomaly 4
  // Suspicious database endpoint
  // ---------------------------------------

  anomalies.push({
    timestamp: new Date(
      "2026-08-20T11:45:30.000Z"
    ),

    source: "api-server-2",

    ipAddress: "10.0.0.99",

    eventType: "DELETE /api/database",

    status: 403,

    severity: "CRITICAL",

    message:
      "Suspicious attempt to access restricted database operation"
  });

  return anomalies;
};

// -----------------------------------------
// SEED DATABASE
// -----------------------------------------

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    console.log("Clearing existing logs...");

    // Remove old logs
    await Log.deleteMany({});

    const logs = [];

    // ---------------------------------------
    // Generate 200 normal logs
    // ---------------------------------------

    for (let i = 0; i < 200; i++) {
      logs.push(generateNormalLog());
    }

    console.log("Generated 200 normal logs");

    // ---------------------------------------
    // Generate intentional anomalies
    // ---------------------------------------

    const anomalies = generateAnomalies();

    logs.push(...anomalies);

    console.log(
      `Generated ${anomalies.length} intentional anomalies`
    );

    // ---------------------------------------
    // RUN OUR ANOMALY DETECTOR
    // ---------------------------------------

    const logsWithDetection = logs.map((log) => {
      const detectionResult =
        calculateAnomalyScore(log);

      return {
        ...log,
        ...detectionResult
      };
    });

    // ---------------------------------------
    // SAVE EVERYTHING TO MONGODB
    // ---------------------------------------

    await Log.insertMany(logsWithDetection);

    // ---------------------------------------
    // COUNT DETECTED ANOMALIES
    // ---------------------------------------

    const detectedAnomalies =
      logsWithDetection.filter(
        (log) => log.isAnomaly === true
      );

    // ---------------------------------------
    // DISPLAY RESULT
    // ---------------------------------------

    console.log("-----------------------------------");

    console.log(
      `Inserted ${logsWithDetection.length} logs`
    );

    console.log(
      `Injected ${anomalies.length} known anomalies`
    );

    console.log(
      `Detected ${detectedAnomalies.length} anomalies`
    );

    console.log("-----------------------------------");

    // Display detected anomaly details
    detectedAnomalies.forEach((log, index) => {
      console.log(
        `Anomaly ${index + 1}:`
      );

      console.log(
        `  Source: ${log.source}`
      );

      console.log(
        `  Event: ${log.eventType}`
      );

      console.log(
        `  Status: ${log.status}`
      );

      console.log(
        `  Severity: ${log.severity}`
      );

      console.log(
        `  Score: ${log.anomalyScore}`
      );

      console.log(
        `  Reason: ${log.anomalyReason}`
      );

      console.log("-----------------------------------");
    });

    console.log(
      "Database seeding completed successfully."
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "Dataset generation failed:"
    );

    console.error(error.message);

    process.exit(1);
  }
};

// -----------------------------------------
// START
// -----------------------------------------

seedDatabase();