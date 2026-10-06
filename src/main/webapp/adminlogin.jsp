<%--
  Created by IntelliJ IDEA.
  User: hp
  Date: 10/2/2026
  Time: 10:07 AM
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <meta name="description" content="Restricted sign in for CyberShield administrators.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="adminlogin.css">
</head>
<body>

<div class="bg-grid" aria-hidden="true"></div>

<main class="stage" id="stage">

    <!-- top notch tabs (same idea as the reference) -->
    <nav class="notch" aria-label="Page navigation">
        <a href="index.html">Home</a>
        <span class="notch__active" aria-current="page">Admin</span>
    </nav>

    <a href="index.html" class="brand" aria-label="CyberShield home">
        <svg viewBox="0 0 40 40" width="34" height="34" fill="none" aria-hidden="true">
            <path d="M20 3 L34 8.5V19C34 27.5 28 33.8 20 37C12 33.8 6 27.5 6 19V8.5L20 3Z" fill="#3b82f6"/>
            <path d="M14.5 20L18 23.5L26 15.5" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Cyber<strong>Shield</strong></span>
    </a>

    <!-- faint watermark shield behind the form -->
    <svg class="watermark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 3 L34 8.5V19C34 27.5 28 33.8 20 37C12 33.8 6 27.5 6 19V8.5L20 3Z" fill="currentColor"/>
    </svg>

    <!-- ============ FORM ============ -->
    <section class="panel">
        <p class="panel__kicker">Restricted area</p>
        <h1 class="panel__title">Admin sign in</h1>
        <p class="panel__sub">Not an administrator? <a href="login.html">Go to user login</a></p>

        <form id="adminForm" action="adminLogin" method="post" novalidate>

            <div class="field" id="emailField">
                <label for="email">Admin email</label>
                <div class="field__box">
                    <input type="email" id="email" name="email" autocomplete="username"
                           placeholder="admin@cybershield.com" required>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="M4 6h16v12H4z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 7l8 6 8-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <p class="field__error" id="emailError" role="alert"></p>
            </div>

            <div class="field" id="passwordField">
                <label for="password">Password</label>
                <div class="field__box">
                    <input type="password" id="password" name="password" autocomplete="current-password"
                           placeholder="Enter your password" required>
                    <button type="button" class="eye" id="togglePassword" aria-label="Show password" aria-pressed="false">
                        <svg class="eye__open" viewBox="0 0 24 24" width="19" height="19" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.6"/></svg>
                        <svg class="eye__closed" viewBox="0 0 24 24" width="19" height="19" fill="none" hidden><path d="M3 3l18 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9.9 5.2A10.4 10.4 0 0112 5c6.4 0 10 7 10 7a17.7 17.7 0 01-3.4 4.2M6.7 6.7C4.1 8.3 2 12 2 12s3.6 7 10 7a10.4 10.4 0 004.1-.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.9 14.1a3 3 0 004.2-4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
                    </button>
                </div>
                <p class="field__error" id="passwordError" role="alert"></p>
                <p class="field__hint" id="capsHint" role="status">Caps Lock is on.</p>
            </div>

            <label class="check">
                <input type="checkbox" name="rememberMe" id="rememberMe">
                <span class="check__box" aria-hidden="true"></span>
                Keep me signed in on this device
            </label>

            <button type="submit" class="btn" id="loginBtn">
                <span class="btn__label">Sign in to admin panel</span>
                <span class="btn__spinner" aria-hidden="true"></span>
            </button>

            <p class="form-msg" id="formMessage" role="status" aria-live="polite"></p>
        </form>

        <p class="panel__foot">
            <span class="dot" aria-hidden="true"></span>
            Encrypted connection. Admin activity is logged.
        </p>
    </section>

    <!-- ============ VISUAL ============ -->
    <aside class="visual" aria-hidden="true">
        <div class="radar" id="radar">
            <i class="radar__ring r1"></i><i class="radar__ring r2"></i><i class="radar__ring r3"></i>
            <i class="radar__sweep"></i>
            <i class="blip b1"></i><i class="blip b2"></i><i class="blip b3"></i>
            <div class="radar__core">
                <svg viewBox="0 0 40 40" width="64" height="64" fill="none">
                    <path d="M20 3 L34 8.5V19C34 27.5 28 33.8 20 37C12 33.8 6 27.5 6 19V8.5L20 3Z" fill="url(#g)"/>
                    <path d="M14.5 20L18 23.5L26 15.5" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <defs><linearGradient id="g" x1="6" y1="3" x2="34" y2="37" gradientUnits="userSpaceOnUse"><stop stop-color="#60a5fa"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>
                </svg>
            </div>
        </div>
        <div class="chip chip--a"><b>0</b> active threats</div>
        <div class="chip chip--b"><b>24/7</b> monitoring</div>
        <div class="chip chip--c"><b>RBAC</b> enforced</div>
    </aside>

    <footer class="links">
        <a href="index.html">Back to site</a>
        <a href="contact.html">Help</a>
        <span class="status"><span class="dot" aria-hidden="true"></span>All systems secure</span>
    </footer>
</main>

<script src="adminlogin.js"></script>

</body>
</html>
