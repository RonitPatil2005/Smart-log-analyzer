# Smart Log Analyzer & Anomaly Detector

A full-stack web application for analyzing application logs, detecting anomalous events, storing anomaly information, and using AI to explain detected anomalies.

The project uses a React frontend, Node.js/Express backend, MongoDB for persistence, and OpenAI for optional AI-powered anomaly explanation.

---

## 📌 Project Overview

Modern applications generate a large number of logs every day. Manually checking these logs to identify unusual behavior, errors, or suspicious activity can be difficult and time-consuming.

The Smart Log Analyzer addresses this problem by:

- Storing application logs in MongoDB
- Detecting suspicious/anomalous logs using a backend anomaly detection algorithm
- Assigning an anomaly score
- Recording the reason for the anomaly
- Displaying logs and anomalies in a web dashboard
- Providing detailed information for individual logs
- Using OpenAI to explain already-detected anomalies
- Providing a likely root cause
- Providing a recommended next step for engineers

### Important Design Principle

AI is **not responsible for detecting anomalies**.

The backend anomaly detection logic first determines whether a log is anomalous.

AI is used only after an anomaly has been detected to provide:

1. Explanation
2. Likely root cause
3. Recommended next step

This separation ensures that the anomaly detection requirement is implemented independently from the AI layer.

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │    React Frontend   │
                         │    Vite Dashboard   │
                         └──────────┬──────────┘
                                    │
                              HTTP REST API
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Node.js + Express │
                         │      Backend        │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌─────────────────┐ ┌───────────────┐
        │ Anomaly        │ │ AI Service      │ │ MongoDB       │
        │ Detector       │ │ OpenAI API      │ │ Database      │
        └────────────────┘ └─────────────────┘ └───────────────┘
