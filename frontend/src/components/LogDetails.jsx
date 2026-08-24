function LogDetails({
  log,
  onClose,
  onAnalyze,
  analyzing
}) {

  if (!log) {
    return (
      <div className="details-empty">
        <p>
          Select a log to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="details-panel">

      <div className="details-header">

        <h2>Log Details</h2>

        <button onClick={onClose}>
          ✕
        </button>

      </div>

      <div className="detail-item">
        <strong>Timestamp</strong>
        <span>
          {new Date(
            log.timestamp
          ).toLocaleString()}
        </span>
      </div>

      <div className="detail-item">
        <strong>Source</strong>
        <span>{log.source}</span>
      </div>

      <div className="detail-item">
        <strong>IP Address</strong>
        <span>{log.ipAddress || "-"}</span>
      </div>

      <div className="detail-item">
        <strong>Event</strong>
        <span>{log.eventType}</span>
      </div>

      <div className="detail-item">
        <strong>Status</strong>
        <span>{log.status || "-"}</span>
      </div>

      <div className="detail-item">
        <strong>Severity</strong>
        <span>{log.severity}</span>
      </div>

      <div className="detail-item">
        <strong>Message</strong>
        <span>{log.message || "-"}</span>
      </div>

      {log.isAnomaly && (

        <div className="anomaly-section">

          <h3>
            🚨 Anomaly Detected
          </h3>

          <div className="score">
            Anomaly Score:{" "}
            <strong>
              {log.anomalyScore}
            </strong>
          </div>

          <p>
            {log.anomalyReason}
          </p>

        </div>

      )}

      {log.isAnomaly && (

        <div className="ai-section">

          <h3>🤖 AI Analysis</h3>

          {!log.aiExplanation && (

            <button
              className="ai-button"
              onClick={onAnalyze}
              disabled={analyzing}
            >
              {analyzing
                ? "Analyzing..."
                : "Analyze with AI"}
            </button>

          )}

          {log.aiExplanation && (

            <>

              <div className="ai-block">
                <strong>
                  Explanation
                </strong>

                <p>
                  {log.aiExplanation}
                </p>
              </div>

              <div className="ai-block">
                <strong>
                  Likely Root Cause
                </strong>

                <p>
                  {log.likelyRootCause}
                </p>
              </div>

              <div className="ai-block">
                <strong>
                  Recommended Next Step
                </strong>

                <p>
                  {log.recommendedNextStep}
                </p>
              </div>

            </>

          )}

        </div>

      )}

    </div>
  );
}

export default LogDetails;