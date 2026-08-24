function LogTable({ logs, onSelectLog }) {

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="table-container">

      <table>

        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source</th>
            <th>Event</th>
            <th>Status</th>
            <th>Severity</th>
            <th>Anomaly</th>
          </tr>
        </thead>

        <tbody>

          {logs.map((log) => (

            <tr
              key={log._id}
              onClick={() => onSelectLog(log)}
              className={
                log.isAnomaly
                  ? "anomaly-row"
                  : ""
              }
            >

              <td>
                {formatDate(log.timestamp)}
              </td>

              <td>
                {log.source}
              </td>

              <td>
                {log.eventType}
              </td>

              <td>
                {log.status || "-"}
              </td>

              <td>
                <span
                  className={`severity ${log.severity.toLowerCase()}`}
                >
                  {log.severity}
                </span>
              </td>

              <td>
                {log.isAnomaly ? (
                  <span className="anomaly-badge">
                    🚨 ANOMALY
                  </span>
                ) : (
                  <span className="normal-badge">
                    Normal
                  </span>
                )}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default LogTable;