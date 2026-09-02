# 🚀 Smart Log Analyzer & Anomaly Detector

A full-stack web application for analyzing application logs, detecting anomalous events, and using AI to explain detected anomalies.

The application uses a **React frontend**, **Node.js and Express backend**, **MongoDB for data persistence**, and the **Google Gemini API** for AI-powered anomaly analysis.

---

## 🌐 Live Demo :  
https://smart-log-analyzer-six.vercel.app/


## 📌 Project Overview

Modern applications generate a large number of logs every day. Manually analyzing these logs to identify unusual behavior, errors, or suspicious activity can be difficult and time-consuming.

Smart Log Analyzer helps simplify this process by providing a centralized dashboard for monitoring logs and investigating anomalies.

The application can:

- 📋 Store application logs in MongoDB
- 🔍 Detect suspicious or anomalous logs using a backend anomaly detection algorithm
- 📊 Assign an anomaly score
- 📝 Record the reason for anomaly detection
- 📈 Display log statistics and anomalies in a dashboard
- 🔎 Search and filter logs
- 📄 Display detailed information for individual logs
- 🚨 Highlight anomalous and critical logs
- 🤖 Use Gemini AI to explain detected anomalies
- 🧠 Provide a likely technical root cause
- 💡 Recommend the next step for engineers

---

# ✨ Key Features

## 📊 Dashboard

The dashboard provides an overview of application logs, including:

- Total Logs
- Total Anomalies
- Critical Logs
- Error Logs

This allows users to quickly understand the current state of the log data.

---

## 🔎 Search and Filter Logs

Users can easily search and filter logs based on:

- Search functionality
- Severity level
- All logs
- Anomalies only
- Normal logs

This makes it easier to investigate specific events and issues.

---

## 🚨 Anomaly Detection

The application includes a backend anomaly detection algorithm.

The system analyzes log properties such as:

- HTTP status code
- Severity level
- Event type
- Sensitive endpoints
- Error patterns

---

## 🤖 AI-Powered Anomaly Analysis

The project uses the Google Gemini API to provide additional analysis for detected anomalies.

Important Design Principle :

- AI does not detect anomalies.

- The backend anomaly detection algorithm is responsible for determining whether a log is anomalous.

- Gemini AI is used only after an anomaly has already been detected.

Gemini provides:

- Explanation – Explains what happened in simple language.
- Likely Root Cause – Identifies a possible technical cause based on the available log information.
- Recommended Next Step – Suggests a practical action for an engineer.

---

## 🖥️ User Interface

The application provides a simple dashboard for monitoring logs and investigating anomalies.

When a normal log is selected, users can view:

- Timestamp
- Source
- IP Address
- HTTP Status
- Severity
- Message
-Anomalous Log

When an anomalous log is selected, users can additionally view:

- 🚨 Anomaly Score
- 📝 Detection Reason
- 🤖 AI Explanation
- 🧠 Likely Root Cause
- 💡 Recommended Next Step

This allows engineers to quickly investigate suspicious events.

---

## 🛠️ Technology Stack

Frontend :
- React.js
- Vite
- CSS
- Axios

Backend :
- Node.js
- Express.js
- Database
- MongoDB
- Mongoose

AI :
- Google Gemini API
- @google/genai

Deployment :
- Vercel – Frontend
- Render – Backend

---

## ⚙️ Installation and Setup

1️⃣ Clone the Repository : 
git clone <your-repository-url>
cd smart-log-analyzer

2️⃣ Install Backend Dependencies :
cd backend
npm install

Create a .env file inside the backend directory:

 - PORT=5000
 - MONGO_URI=your_mongodb_connection_string
 - GEMINI_API_KEY=your_gemini_api_key
 - GEMINI_MODEL=your_gemini_model

Start the backend : 
 - npm run dev

3️⃣ Install Frontend Dependencies

Open another terminal and run:

- cd frontend
- npm install
- npm run dev

## 🔐 Environment Variables

The backend requires:

- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- GEMINI_API_KEY=your_gemini_api_key
- GEMINI_MODEL=your_gemini_model

## ⚠️ Never commit your .env file or API keys to GitHub.

Make sure your .gitignore file contains:
- .env

---

## 🎯 Future Improvements

Possible future improvements include:

- 📈 Log analytics and charts
- ⏱️ Real-time log monitoring
- 🔔 Alert notifications
- 📁 Log file upload support
- 📊 Historical anomaly trends
- 👤 User authentication
- 📤 Export logs and analysis reports
- 🔄 WebSocket-based real-time updates
- 💡 Key Learning Outcomes

## Through this project, I worked with:

- Full-stack MERN application development
- REST API development
- MongoDB database integration
- Backend anomaly detection logic
- AI API integration using Gemini
- Structured AI responses
- Environment variable management
- Error handling and debugging
- Frontend and backend deployment
