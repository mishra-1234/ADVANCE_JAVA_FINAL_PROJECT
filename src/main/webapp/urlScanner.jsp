<%--
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
    <title>CyberShield - URL Security Scanner</title>
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
            <h2>URL Security Scanner</h2>
            <p>Analyze target URLs instantly for SSL security, threat indicators, and risk metrics.</p>
        </div>

        <form action="scan-url" method="post" class="scanner-form" id="scanForm">
            <div class="input-group">
                <label for="url">Target URL Address</label>
                <div class="input-field-wrapper">
                        <span class="input-icon">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </span>
                    <input type="text" id="url" name="url" placeholder="https://example.com" required autocomplete="off">
                </div>
            </div>

            <button type="submit" class="btn-primary-glow" id="scanBtn">
                <span>Initialize Security Scan</span>
            </button>
        </form>

        <% String error = request.getParameter("error"); %>
        <% if (error != null) { %>
        <div class="alert-box error">
            <span>⚠️ <%= error %></span>
        </div>
        <% } %>

        <div class="card-footer-links">
            <a href="dashboard.html">&larr; Back to Operations Dashboard</a>
        </div>
    </div>
</div>
</body>
</html>
