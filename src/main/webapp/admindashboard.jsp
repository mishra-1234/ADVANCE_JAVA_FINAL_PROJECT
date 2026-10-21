<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberShield · Database Admin Console</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admindashboard.css">
</head>
<body>

<div class="bg"></div>

<div class="app" id="app">
    <!-- Sidebar Navigation -->
    <aside class="side">
        <div class="brand">
            <svg class="shield" viewBox="0 0 64 72" aria-hidden="true">
                <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#22f0ff"/>
                        <stop offset="1" stop-color="#2cffb0"/>
                    </linearGradient>
                </defs>
                <path class="s-out" d="M32 3 6 13v20c0 18 11 30 26 36 15-6 26-18 26-36V13z" fill="none" stroke="url(#g)" stroke-width="3"/>
                <path class="s-in" d="M32 14 16 20v13c0 11 7 19 16 23 9-4 16-12 16-23V20z" fill="url(#g)" opacity=".18"/>
                <path d="m23 35 7 7 12-15" fill="none" stroke="url(#g)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div><b>CyberShield</b><small>Database Admin</small></div>
        </div>

        <nav class="nav" id="nav">
            <span class="pill" id="pill"></span>

            <!-- 1. Dashboard -->
            <button data-view="dashboard">
                <svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
                <span>Dashboard</span>
            </button>

            <!-- 2. URL Scanner -->
            <button data-view="scans">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.03-.42 1.98-1.07 2.75z"/></svg>
                <span>URL Scanner</span>
            </button>

            <!-- 3. Live Incidents -->
            <button class="active" data-view="users">
                <svg viewBox="0 0 24 24"><path d="M12 2 1 21h22zm1 14h-2v-2h2zm0-4h-2V8h2z"/></svg>
                <span>Live Incidents</span>
            </button>

            <!-- 4. Reports -->
            <button data-view="reports">
                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
                <span>Reports</span>
            </button>

            <!-- 5. Logout -->
            <button id="logoutBtn" style="margin-top: 15px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 15px;">
                <svg viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                <span>Logout</span>
            </button>
        </nav>

        <div class="me"><div class="av">AD</div><div><b>System Admin</b><small>Database Lead</small></div></div>
    </aside>

    <!-- Main Workspace -->
    <main class="main">
        <header class="top">
            <div>
                <h1 id="title">Security Incidents Management</h1>
                <p id="sub">Live database records fetched directly from MySQL</p>
            </div>
            <div class="status"><i></i>DB Connected</div>
        </header>

        <!-- View 1: Dashboard Section -->
        <section class="view" id="dashboard">
            <div class="card">
                <h3 style="font-family:'Rajdhani',sans-serif; font-size:22px; color:#fff; margin-bottom:12px;">Network Overview</h3>
                <p style="color:#8899a6; font-size:14px;">Welcome to CyberShield Control Center. System security parameters are optimal and database streams are active.</p>
            </div>
        </section>

        <!-- View 2: URL Scanner Section -->
        <section class="view" id="scans">
            <div class="card">
                <h3 style="font-family:'Rajdhani',sans-serif; font-size:22px; color:#fff; margin-bottom:12px;">URL & Domain Threat Scanner</h3>
                <p style="color:#8899a6; font-size:14px; margin-bottom:16px;">Enter a URL or IP address to run a real-time security heuristic scan.</p>
                <div style="display:flex; gap:12px;">
                    <input type="text" placeholder="https://example.com/suspicious-path" style="flex:1; background:#07090e; border:1px solid rgba(34,240,255,0.15); padding:10px 14px; border-radius:6px; color:#fff; outline:none;">
                    <button class="ghost" style="padding:10px 20px; cursor:pointer; font-weight:600;">Scan URL</button>
                </div>
            </div>
        </section>

        <!-- View 3: Live Incidents Section (Main Database Table) -->
        <section class="view show" id="users">
            <div class="card">
                <div class="bar">
                    <h3>Database Incident Records</h3>
                    <input id="q" type="search" placeholder="Search title, category, severity, reporter...">
                </div>
                <div class="tw">
                    <table>
                        <thead>
                        <tr>
                            <th>Incident ID</th>
                            <th>Title & Category</th>
                            <th>Severity</th>
                            <th>Reported By</th>
                            <th>Date & Time</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody id="uBody">
                        <!-- Database dynamic records render here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- View 4: Reports Section -->
        <section class="view" id="reports">
            <div class="card">
                <h3 style="font-family:'Rajdhani',sans-serif; font-size:22px; color:#fff; margin-bottom:12px;">Security & Audit Reports</h3>
                <p style="color:#8899a6; font-size:14px; margin-bottom:16px;">Export comprehensive incident logs and database metrics.</p>
                <button class="ghost" style="padding:10px 20px; cursor:pointer; font-weight:600;" onclick="alert('Generating PDF Audit Report...')">Download PDF Report</button>
            </div>
        </section>
    </main>
</div>

<!-- Logout Confirmation Modal -->
<div class="modal" id="modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:100; place-items:center;">
    <div class="card" style="width:360px; text-align:center;">
        <h3>Confirm Logout</h3>
        <p style="color:#8899a6; font-size:13px; margin:12px 0 20px;">Are you sure you want to end your active admin session?</p>
        <div style="display:flex; gap:10px; justify-content:center;">
            <button id="stay" class="ghost" style="padding:8px 16px; cursor:pointer;">Stay</button>
            <button id="confirm" style="padding:8px 16px; background:#ff4d6d; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Logout</button>
        </div>
    </div>
</div>

<!-- Dynamic JS Loader with Cache-Busting -->
<script src="admindashboard.js?v=<%= System.currentTimeMillis() %>"></script>

</body>
</html>