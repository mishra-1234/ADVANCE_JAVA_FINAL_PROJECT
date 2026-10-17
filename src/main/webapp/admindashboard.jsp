<%--
  Created by IntelliJ IDEA.
  User: hp
  Date: 10/6/2026
  Time: 9:38 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>CyberShield · Admin Console</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admindashboard.css">
</head>
<body>

<div class="bg"></div>

<div class="app" id="app">
    <aside class="side">
        <div class="brand">
            <svg class="shield" viewBox="0 0 64 72" aria-hidden="true">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22f0ff"/><stop offset="1" stop-color="#2cffb0"/></linearGradient></defs>
                <path class="s-out" d="M32 3 6 13v20c0 18 11 30 26 36 15-6 26-18 26-36V13z" fill="none" stroke="url(#g)" stroke-width="3"/>
                <path class="s-in" d="M32 14 16 20v13c0 11 7 19 16 23 9-4 16-12 16-23V20z" fill="url(#g)" opacity=".18"/>
                <path d="m23 35 7 7 12-15" fill="none" stroke="url(#g)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div><b>CyberShield</b><small>Admin console</small></div>
        </div>

        <nav class="nav" id="nav">
            <span class="pill" id="pill"></span>
            <button class="active" data-view="dashboard"><svg viewBox="0 0 24 24"><path d="M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z"/></svg><span>Dashboard</span></button>
            <button data-view="users"><svg viewBox="0 0 24 24"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 2c-3 0-8 1.5-8 4v2h16v-2c0-2.500-5-4-8-4zM8 14c-.3 0-.7 0-1 .1C4.800 14.500 2 15.700 2 18v2h5v-2c0-1.700.8-3 2.200-4A9 9 0 0 0 8 14z"/></svg><span>Manage Users</span></button>
            <button data-view="scans"><svg viewBox="0 0 24 24"><path d="M12 8v5l4 2-.8 1.400L10.500 14V8zm0-6a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/></svg><span>Scan History</span></button>
            <button data-view="threats"><svg viewBox="0 0 24 24"><path d="M12 2 1 21h22zm1 14h-2v-2h2zm0-4h-2V8h2z"/></svg><span>Threat Records</span><i class="dot" id="threatDot">3</i></button>
            <button class="logout" id="logoutBtn"><svg viewBox="0 0 24 24"><path d="M16 17v-3H9v-4h7V7l5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg><span>Logout</span></button>
        </nav>

        <div class="me"><div class="av">AD</div><div><b>Admin</b><small>Security lead</small></div></div>
    </aside>

    <main class="main">
        <header class="top">
            <div><h1 id="title">Dashboard</h1><p id="sub">Live overview of your protected network</p></div>
            <div class="status"><i></i>All shields active</div>
        </header>

        <section class="view show" id="dashboard">
            <div class="stats" id="stats"></div>
            <div class="grid2">
                <div class="card">
                    <h3>Threats blocked this week</h3>
                    <svg id="chart" viewBox="0 0 600 220" preserveAspectRatio="none"></svg>
                    <div class="days" id="days"></div>
                </div>
                <div class="card radar-card">
                    <h3>Perimeter scan</h3>
                    <div class="radar"><div class="sweep"></div><b style="--x:68%;--y:30%"></b><b style="--x:30%;--y:62%;--d:1.2s"></b><b style="--x:58%;--y:74%;--d:2.4s"></b><span>Scanning</span></div>
                </div>
            </div>
            <div class="card"><h3>Live activity</h3><ul class="feed" id="feed"></ul></div>
        </section>

        <section class="view" id="users">
            <div class="card">
                <div class="bar"><h3>Team members</h3><input id="q" type="search" placeholder="Search by name or role"></div>
                <div class="tw"><table><thead><tr><th>User</th><th>Role</th><th>Last active</th><th>Access</th></tr></thead><tbody id="uBody"></tbody></table></div>
            </div>
        </section>

        <section class="view" id="scans">
            <div class="card"><h3>Recent scans</h3>
                <div class="tw"><table><thead><tr><th>Scan</th><th>Target</th><th>Started</th><th>Result</th><th>Progress</th></tr></thead><tbody id="sBody"></tbody></table></div>
            </div>
        </section>

        <section class="view" id="threats">
            <div class="card">
                <div class="bar"><h3>Detected threats</h3>
                    <div class="chips" id="chips"><button class="on" data-f="all">All</button><button data-f="Critical">Critical</button><button data-f="High">High</button><button data-f="Medium">Medium</button></div>
                </div>
                <div class="tw"><table><thead><tr><th>Threat</th><th>Source IP</th><th>Severity</th><th>Status</th></tr></thead><tbody id="tBody"></tbody></table></div>
            </div>
        </section>
    </main>
</div>

<div class="modal" id="modal"><div class="box">
    <svg viewBox="0 0 24 24"><path d="M16 17v-3H9v-4h7V7l5 5zM14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
    <h2>Sign out of CyberShield?</h2><p>Your shields keep running. You'll need to sign in again to manage them.</p>
    <div class="acts"><button class="ghost" id="stay">Stay signed in</button><button class="solid" id="confirm">Log out</button></div>
</div></div>

<div class="lock" id="lock"><div>
    <svg viewBox="0 0 64 72"><path d="M32 3 6 13v20c0 18 11 30 26 36 15-6 26-18 26-36V13z" fill="none" stroke="#22f0ff" stroke-width="3"/><rect x="22" y="32" width="20" height="15" rx="3" fill="#22f0ff"/><path d="M26 32v-5a6 6 0 0 1 12 0v5" fill="none" stroke="#22f0ff" stroke-width="3"/></svg>
    <h2>You're signed out</h2><p>The network is still protected.</p>
    <button class="solid" id="again">Sign back in</button>
</div></div>

<script src="admindashboard.js"></script>

</body>
</html>
