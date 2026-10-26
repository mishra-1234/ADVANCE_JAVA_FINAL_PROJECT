<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.cyber.dao.IncidentDAO" %>
<%
    // IncidentDAO ka object banakar database se dynamic counts fetch karna
    IncidentDAO incidentDAO = new IncidentDAO();
    int totalThreats = incidentDAO.getTotalThreatsCount();
    int criticalThreats = incidentDAO.getCriticalThreatsCount();
    int maliciousUrls = 9; // Agar alag method ho toh wahan se le sakte hain
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Threat Reports - CyberShield</title>
    <link rel="stylesheet" href="dashboard.css">
    <!-- Chart.js for graphs -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .reports-container { max-width: 1200px; margin: 30px auto; padding: 20px; color: #f8fafc; }
        .reports-header { display: flex; justify-content: space-between; align-items: center; background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155; margin-bottom: 20px; }
        .filter-group { display: flex; gap: 10px; }
        .filter-btn, .pdf-btn { background: #2563eb; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        .pdf-btn { background: #dc2626; }

        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155; text-align: center; }
        .metric-card h3 { font-size: 24px; color: #3b82f6; margin: 0; }

        .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .chart-box, .full-width-box { background: #1e293b; padding: 20px; border-radius: 10px; border: 1px solid #334155; margin-bottom: 20px; }

        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #334155; font-size: 14px; }
        th { color: #94a3b8; }
    </style>
</head>
<body style="background-color: #0f172a;">

<div class="reports-container">
    <!-- Header with Filters & PDF Export -->
    <div class="reports-header">
        <h2>Threat Reports Dashboard</h2>
        <div class="filter-group">
            <select class="filter-btn" style="background: #334155;">
                <option>Date: Last 30 Days</option>
                <option>Date: Last 7 Days</option>
            </select>
            <select class="filter-btn" style="background: #334155;">
                <option>Severity: All</option>
                <option>Critical Only</option>
            </select>
            <button class="pdf-btn" onclick="window.print()">Export PDF</button>
        </div>
    </div>

    <!-- Top Summary Metrics (Dynamic from Database) -->
    <div class="metrics-grid">
        <div class="metric-card">
            <p style="color: #94a3b8; margin:0;">Total Threats</p>
            <h3><%= totalThreats %></h3>
        </div>
        <div class="metric-card">
            <p style="color: #94a3b8; margin:0;">Critical Incidents</p>
            <h3 style="color: #dc2626;"><%= criticalThreats %></h3>
        </div>
        <div class="metric-card">
            <p style="color: #94a3b8; margin:0;">Malicious URLs Flagged</p>
            <h3 style="color: #f59e0b;"><%= maliciousUrls %></h3>
        </div>
    </div>

    <!-- Charts Row (Severity Donut & Category Bar) -->
    <div class="charts-grid">
        <div class="chart-box">
            <h4>Severity Distribution</h4>
            <canvas id="severityDonut" style="max-height: 220px;"></canvas>
        </div>
        <div class="chart-box">
            <h4>Threat Categories</h4>
            <canvas id="categoryBar" style="max-height: 220px;"></canvas>
        </div>
    </div>

    <!-- Threat Trend Line Chart -->
    <div class="full-width-box">
        <h4>Threat Trend (Last 30 Days)</h4>
        <canvas id="trendLine" style="max-height: 150px;"></canvas>
    </div>

    <!-- Top Threats Table -->
    <div class="full-width-box">
        <h4>Top Threats Table</h4>
        <table>
            <thead>
            <tr>
                <th>Threat ID</th>
                <th>Type / Vector</th>
                <th>Frequency</th>
                <th>Risk Level</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>THR-101</td>
                <td>SQL Injection Attempt</td>
                <td>45</td>
                <td><span style="color: #dc2626; font-weight: bold;">Critical</span></td>
            </tr>
            <tr>
                <td>THR-102</td>
                <td>Phishing Credential Harvester</td>
                <td>32</td>
                <td><span style="color: #f59e0b; font-weight: bold;">High</span></td>
            </tr>
            </tbody>
        </table>
    </div>

    <!-- Recent Malicious URLs -->
    <div class="full-width-box">
        <h4>Recent Malicious URLs</h4>
        <table>
            <thead>
            <tr>
                <th>URL / Domain</th>
                <th>Detected On</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>http://malicious-login-secure-verify.com</td>
                <td>2026-10-25 14:30</td>
                <td style="color: #dc2626;">Blocked</td>
            </tr>
            <tr>
                <td>http://fake-banking-update-portal.net</td>
                <td>2026-10-24 09:15</td>
                <td style="color: #dc2626;">Blocked</td>
            </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- Chart Initializations -->
<script>
    // Severity Donut Chart
    new Chart(document.getElementById('severityDonut'), {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{ data: [<%= criticalThreats %>, 35, 55, 26], backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6', '#10b981'] }]
        }
    });

    // Category Bar Chart
    new Chart(document.getElementById('categoryBar'), {
        type: 'bar',
        data: {
            labels: ['Malware', 'Phishing', 'DDoS', 'SQLi'],
            datasets: [{ label: 'Incidents', data: [30, 45, 20, 33], backgroundColor: '#3b82f6' }]
        }
    });

    // Trend Line Chart
    new Chart(document.getElementById('trendLine'), {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 10', 'Day 20', 'Day 30'],
            datasets: [{ label: 'Detections', data: [5, 12, 8, 15], borderColor: '#3b82f6', tension: 0.3 }]
        }
    });
</script>

</body>
</html>