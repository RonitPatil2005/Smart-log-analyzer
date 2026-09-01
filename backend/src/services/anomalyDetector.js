const calculateAnomalyScore = (log) => {
  let score = 0;

  const reasons = [];

 // HTTP STATUS ANALYSIS

  if (log.status >= 500) {
    score += 40;

    reasons.push(
      "HTTP 5xx server error"
    );

  } else if (log.status >= 400) {
    score += 20;

    reasons.push(
      "HTTP 4xx client error"
    );
  }


  // SEVERITY ANALYSIS
  

  if (log.severity === "CRITICAL") {
    score += 40;

    reasons.push(
      "CRITICAL severity"
    );

  } else if (log.severity === "ERROR") {
    score += 25;

    reasons.push(
      "ERROR severity"
    );

  } else if (log.severity === "WARNING") {
    score += 10;

    reasons.push(
      "WARNING severity"
    );
  }

  // -----------------------------------------
  // SENSITIVE ENDPOINT ANALYSIS
  // -----------------------------------------

  const eventType =
    (log.eventType || "").toLowerCase();

  if (
    eventType.includes("/admin") ||
    eventType.includes("/database")
  ) {
    score += 20;

    reasons.push(
      "Sensitive endpoint accessed"
    );
  }

  // FINAL DECISION

  const isAnomaly = score >= 50;

  return {
    isAnomaly,
    anomalyScore: score,
    anomalyReason:
      reasons.length > 0
        ? reasons.join("; ")
        : ""
  };
};

module.exports = {
  calculateAnomalyScore
};