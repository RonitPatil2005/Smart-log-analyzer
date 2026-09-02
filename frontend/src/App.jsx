import { useEffect, useState } from "react";

import {
  getLogs,
  analyzeLog
} from "./services/api";

import StatsCards from "./components/StatsCards.jsx";
import LogTable from "./components/LogTable.jsx";
import LogDetails from "./components/LogDetails.jsx";

import "./App.css";

function App() {

  // ========================================
  // STATE
  // ========================================

  const [logs, setLogs] = useState([]);

  const [selectedLog, setSelectedLog] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [error, setError] =
    useState("");

  // Search
  const [search, setSearch] =
    useState("");

  // Severity filter
  const [severityFilter, setSeverityFilter] =
    useState("ALL");

  // Anomaly filter
  const [anomalyFilter, setAnomalyFilter] =
    useState("ALL");


  // ========================================
  // LOAD LOGS
  // ========================================

  useEffect(() => {

    const loadLogs = async () => {

      try {

        const result = await getLogs();

        const fetchedLogs =
          result.data || [];

        // ------------------------------------
        // RESTORE AI ANALYSIS FROM SESSION
        // STORAGE
        // ------------------------------------

        const logsWithAnalysis =
          fetchedLogs.map((log) => {

            const savedAnalysis =
              sessionStorage.getItem(
                `ai-analysis-${log._id}`
              );

            if (savedAnalysis) {

              try {

                const aiAnalysis =
                  JSON.parse(savedAnalysis);

                return {
                  ...log,
                  aiAnalysis
                };

              } catch (error) {

                console.error(
                  "Failed to restore AI analysis:",
                  error
                );

                return log;

              }

            }

            return log;

          });

        setLogs(logsWithAnalysis);

      } catch (err) {

        console.error(err);

        setError(
          "Unable to load logs."
        );

      } finally {

        setLoading(false);

      }

    };

    loadLogs();

  }, []);


  // ========================================
  // FILTER LOGS
  // ========================================

  const filteredLogs = logs.filter(
    (log) => {

      const searchValue =
        `${log.source || ""}
        ${log.eventType || ""}
        ${log.status || ""}
        ${log.severity || ""}
        ${log.message || ""}
        ${log.ipAddress || ""}`
          .toLowerCase();

      const matchesSearch =
        searchValue.includes(
          search.toLowerCase()
        );

      const matchesSeverity =
        severityFilter === "ALL" ||
        log.severity === severityFilter;

      const matchesAnomaly =
        anomalyFilter === "ALL" ||
        (
          anomalyFilter === "ANOMALY" &&
          log.isAnomaly === true
        ) ||
        (
          anomalyFilter === "NORMAL" &&
          log.isAnomaly === false
        );

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesAnomaly
      );

    }
  );


  // ========================================
  // RESET FILTERS
  // ========================================

  const resetFilters = () => {

    setSearch("");
    setSeverityFilter("ALL");
    setAnomalyFilter("ALL");

  };


  // ========================================
  // AI ANALYSIS
  // ========================================

  const handleAnalyze = async () => {

    if (!selectedLog) {
      return;
    }

    try {

      setAnalyzing(true);

      const result =
        await analyzeLog(
          selectedLog._id
        );

      const updatedLog =
        result.data;


      // ------------------------------------
      // SAVE AI ANALYSIS IN SESSION STORAGE
      // ------------------------------------

      if (updatedLog.aiAnalysis) {

        sessionStorage.setItem(
          `ai-analysis-${updatedLog._id}`,
          JSON.stringify(
            updatedLog.aiAnalysis
          )
        );

      }


      // ------------------------------------
      // UPDATE LOG TABLE
      // ------------------------------------

      setLogs((currentLogs) =>
        currentLogs.map((log) =>
          log._id === updatedLog._id
            ? updatedLog
            : log
        )
      );


      // ------------------------------------
      // UPDATE SELECTED LOG
      // ------------------------------------

      setSelectedLog(
        updatedLog
      );


    } catch (err) {

      console.error(
        "AI analysis failed:",
        err
      );

      alert(
        "AI analysis failed. Please try again."
      );

    } finally {

      setAnalyzing(false);

    }

  };


  // ========================================
  // UI
  // ========================================

  return (

    <div className="app">

      {/* ==================================
          HEADER
      ================================== */}

      <header className="header">

        <div>

          <h1>
            Smart Log Analyzer
          </h1>

          <p>
            Monitor logs, detect anomalies,
            and investigate issues with AI
          </p>

        </div>

      </header>


      {/* ==================================
          MAIN
      ================================== */}

      <main className="container">


        {/* STATISTICS */}

        <StatsCards
          logs={logs}
        />


        {/* ==================================
            FILTER TOOLBAR
        ================================== */}

        <div className="toolbar">


          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search logs..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />


          {/* SEVERITY */}

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Severity
            </option>

            <option value="INFO">
              Info
            </option>

            <option value="WARNING">
              Warning
            </option>

            <option value="ERROR">
              Error
            </option>

            <option value="CRITICAL">
              Critical
            </option>

          </select>


          {/* ANOMALY */}

          <select
            value={anomalyFilter}
            onChange={(e) =>
              setAnomalyFilter(
                e.target.value
              )
            }
          >

            <option value="ALL">
              All Logs
            </option>

            <option value="ANOMALY">
              Anomalies Only
            </option>

            <option value="NORMAL">
              Normal Only
            </option>

          </select>


          {/* RESET */}

          <button
            className="reset-button"
            onClick={resetFilters}
          >
            Reset
          </button>

        </div>


        {/* ==================================
            FILTER RESULT COUNT
        ================================== */}

        {!loading && !error && (

          <div className="result-count">

            Showing{" "}

            <strong>
              {filteredLogs.length}
            </strong>

            {" "}of{" "}

            <strong>
              {logs.length}
            </strong>

            {" "}logs

          </div>

        )}


        {/* ==================================
            LOADING
        ================================== */}

        {loading && (

          <div className="loading">
            Loading logs...
          </div>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="error">
            {error}
          </div>

        )}


        {/* ==================================
            LOG TABLE
        ================================== */}

        {!loading && !error && (

          <LogTable
            logs={filteredLogs}
            onSelectLog={
              setSelectedLog
            }
          />

        )}

      </main>


      {/* ==================================
          LOG DETAILS
      ================================== */}

      {selectedLog && (

        <LogDetails
          log={selectedLog}
          onClose={() =>
            setSelectedLog(null)
          }
          onAnalyze={
            handleAnalyze
          }
          analyzing={
            analyzing
          }
        />

      )}

    </div>

  );

}

export default App;