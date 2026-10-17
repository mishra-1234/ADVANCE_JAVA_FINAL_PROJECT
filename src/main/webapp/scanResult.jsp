<%@ page import="com.cyber.entity.UrlScan" %><%--
  Created by IntelliJ IDEA.
  User: hp
  Date: 10/17/2026
  Time: 10:31 PM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberShield - Security Analysis Report</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="urlScanner.css">
</head>
<body>
<div class="cyber-background-glow"></div>

<div class="scanner-wrapper">
    <!-- Brand Header -->
    <div class="brand-header">
        <div class="brand-icon">
            <svg viewBox="0 0 40 40" width="32" height="32" fill="none">
                <path d="M20 3 L34 8.5V19C34 27.5 28 33.8 20 37C12 33.8 6 27.5 6 19V8.5L20 3Z" fill="url(#shieldGrad)"/>
                <path d="M14.5 20L18 23.5L26 15.5" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                    <linearGradient id="shieldGrad" x1="6" y1="3" x2="34" y2="37" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#2563eb"/><stop offset="1" stop-color="#1e293b"/>
                    </linearGradient>
                </defs>
            </svg>
        </div>
        <h1>Cyber<strong>Shield</strong></h1>
    </div>

    <div class="scanner-card">
        <div class="card-title-group">
            <h2>Analysis Report</h2>
            <p>Threat Intelligence & Infrastructure Verification Results</p>
        </div>

        <%
            UrlScan scan = (UrlScan) request.getAttribute("scanResult");
            if (scan != null) {
                String riskClass = "badge-low";
                String riskText = scan.getRiskLevel();
                if ("High".equalsIgnoreCase(riskText)) {
                    riskClass = "badge-high";
                } else if ("Medium".equalsIgnoreCase(riskText)) {
                    riskClass = "badge-medium";
                }
        %>
        <div class="result-report-box">
            <div class="report-row">
                <span class="report-label">Target URL</span>
                <span class="report-value mono text-highlight"><%= scan.getScannedUrl() %></span>
            </div>
            <div class="report-divider"></div>
            <div class="report-row">
                <span class="report-label">HTTPS Encryption</span>
                <span class="report-value <%= scan.isHttpsEnabled() ? "text-success" : "text-danger" %>">
                            <%= scan.isHttpsEnabled() ? "✓ Secure (Enabled)" : "✗ Insecure (Disabled)" %>
                        </span>
            </div>
            <div class="report-divider"></div>
            <div class="report-row">
                <span class="report-label">Assessed Risk Level</span>
                <span class="status-badge <%= riskClass %>"><%= riskText %> Risk</span>
            </div>
            <div class="report-divider"></div>
            <div class="report-row">
                <span class="report-label">Timestamp</span>
                <span class="report-value"><%= scan.getScanDate() != null ? scan.getScanDate() : "Just now" %></span>
            </div>
        </div>
        <% } else { %>
        <div class="alert-box error">
            <span>⚠️ No scan diagnostics data found. Please run a new scan.</span>
        </div>
        <% } %>

        <div class="action-button-group">
            <a href="urlScanner.jsp" class="btn-secondary-glow">Scan Another URL</a>
            <a href="dashboard.html" class="btn-primary-glow text-center-link">Dashboard</a>
        </div>
    </div>
</div>
</body>
</html>
