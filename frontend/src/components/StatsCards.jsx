function StatsCards({ logs }) {
  const totalLogs = logs.length;

  const anomalies = logs.filter(
    (log) => log.isAnomaly
  ).length;

  const critical = logs.filter(
    (log) => log.severity === "CRITICAL"
  ).length;

  const errors = logs.filter(
    (log) => log.severity === "ERROR"
  ).length;

  return (
    <div className="stats-grid">

      <div className="stat-card">
        <span>Total Logs</span>
        <strong>{totalLogs}</strong>
      </div>

      <div className="stat-card anomaly-card">
        <span>Anomalies</span>
        <strong>{anomalies}</strong>
      </div>

      <div className="stat-card critical-card">
        <span>Critical</span>
        <strong>{critical}</strong>
      </div>

      <div className="stat-card">
        <span>Errors</span>
        <strong>{errors}</strong>
      </div>

    </div>
  );
}

export default StatsCards;