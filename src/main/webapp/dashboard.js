/* ==========================================================================
   CyberShield — dashboard.js
   Vanilla JS only. Uses placeholder/sample data for now.
   Functions are clearly separated so they can later be rewired to call
   the Java Servlets (e.g. via fetch('incidents'), fetch('notifications'))
   instead of returning sample data.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadDashboardData();
    loadRecentIncidents();

    initSidebarToggle();
    initSidebarNavHighlight();
    initDropdowns();
    initTableFilter();
    initTableSearch();
    initLogout();
    initSquadPanel();
    initScrollReveal();
    initStatCounters();
});

/* --------------------------------------------------------------------------
   SESSION / USER INFO
   --------------------------------------------------------------------------
   The Servlet session currently stores: user, userId, userName, role.
   For now this reads sample data. Later, replace SAMPLE_USER with a call
   such as: fetch('user-info').then(r => r.json()).then(renderUser)
   or have the JSP/Servlet inject these values directly into the page
   (e.g. via a hidden <meta> tag or a small inline JSON block) so this
   function can read them instead of using SAMPLE_USER.
   -------------------------------------------------------------------------- */


async function loadUserInfo() {

    try {

        const response = await fetch('user-session');

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        console.log("User Session:", data);

        if (!data.loggedIn) {
            window.location.href = 'login.html';
            return;
        }

        const userName = data.userName;
        const role = data.role;

        const nameEl =
            document.getElementById('userNameDisplay');

        const roleEl =
            document.getElementById('userRoleDisplay');

        const avatarEl =
            document.getElementById('userAvatar');

        const greetingEl =
            document.getElementById('greetingName');

        if (nameEl)
            nameEl.textContent = userName;

        if (roleEl)
            roleEl.textContent = role;

        if (avatarEl)
            avatarEl.textContent = getInitials(userName);

        if (greetingEl)
            greetingEl.textContent =
                userName.split(' ')[0];

    } catch (error) {

        console.error(
            "Failed to load user session:",
            error
        );
    }
}

function getInitials(name) {
    if (!name) return 'U';
    return name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();
}

/* --------------------------------------------------------------------------
   DASHBOARD DATA (notifications + activity feed)
   --------------------------------------------------------------------------
   TODO (backend): replace with fetch('dashboard-summary') and
   fetch('notifications') calls to the Servlet layer.
   -------------------------------------------------------------------------- */
const SAMPLE_NOTIFICATIONS = [
    { type: 'danger', text: 'New Critical incident reported: Suspicious Login', time: '10 minutes ago' },
    { type: 'warning', text: 'INC-1020 escalated to Under Investigation', time: '1 hour ago' },
    { type: 'info', text: 'Monthly security report is ready to view', time: '3 hours ago' },
];

const SAMPLE_ACTIVITY = [
    { type: 'primary', text: 'New incident reported: "Phishing Email"', time: '28 Aug 2026, 10:12 AM' },
    { type: 'info', text: 'Incident INC-1002 assigned to Security Team', time: '27 Aug 2026, 4:45 PM' },
    { type: 'warning', text: 'Incident INC-1024 status changed to Investigating', time: '27 Aug 2026, 2:03 PM' },
    { type: 'success', text: 'Incident INC-1022 marked as Resolved', time: '26 Aug 2026, 9:30 AM' },
];

function loadDashboardData() {
    try {
        renderNotifications(SAMPLE_NOTIFICATIONS);
        renderActivity(SAMPLE_ACTIVITY);
    } catch (error) {
        console.error('CyberShield: failed to load dashboard data.', error);
    }
}

function renderNotifications(notifications) {
    const list = document.getElementById('notifList');
    const dot = document.getElementById('notifDot');
    const sidebarBadge = document.getElementById('sidebarNotifBadge');
    if (!list) return;

    list.innerHTML = '';
    notifications.forEach((notif) => {
        const li = document.createElement('li');
        li.className = 'notif-item';
        li.innerHTML = `
      <span class="notif-item__dot notif-item__dot--${notif.type}" aria-hidden="true"></span>
      <span class="notif-item__text">
        <p>${escapeHtml(notif.text)}</p>
        <span>${escapeHtml(notif.time)}</span>
      </span>
    `;
        list.appendChild(li);
    });

    const count = notifications.length;
    if (dot) dot.textContent = String(count);
    if (sidebarBadge) sidebarBadge.textContent = String(count);
}

function renderActivity(activity) {
    const list = document.getElementById('activityList');
    if (!list) return;

    list.innerHTML = '';
    activity.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
      <span class="activity-item__dot activity-item__dot--${item.type}" aria-hidden="true"></span>
      <span class="activity-item__text">
        <p>${escapeHtml(item.text)}</p>
        <span>${escapeHtml(item.time)}</span>
      </span>
    `;
        list.appendChild(li);
    });
}

/* --------------------------------------------------------------------------
   RECENT INCIDENTS TABLE
   --------------------------------------------------------------------------
   TODO (backend): replace SAMPLE_INCIDENTS with
   fetch('incidents?scope=recent').then(r => r.json())
   -------------------------------------------------------------------------- */
const SAMPLE_INCIDENTS = [
    { id: 'INC-1001', title: 'Phishing Email', category: 'Phishing', severity: 'high', status: 'investigating', date: '28 Aug 2026' },
    { id: 'INC-1002', title: 'Suspicious Login', category: 'Unauthorized Access', severity: 'critical', status: 'open', date: '27 Aug 2026' },
    { id: 'INC-1003', title: 'Malware Detected', category: 'Malware', severity: 'medium', status: 'resolved', date: '26 Aug 2026' },
    { id: 'INC-1004', title: 'Ransomware Alert', category: 'Ransomware', severity: 'critical', status: 'open', date: '25 Aug 2026' },
    { id: 'INC-1005', title: 'Unusual File Access', category: 'Insider Threat', severity: 'low', status: 'closed', date: '24 Aug 2026' },
    { id: 'INC-1006', title: 'Data Exfiltration Attempt', category: 'Data Breach', severity: 'critical', status: 'investigating', date: '23 Aug 2026' },
];

const SEVERITY_LABELS = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
const STATUS_LABELS = { open: 'Open', investigating: 'Under Investigation', resolved: 'Resolved', closed: 'Closed' };

function loadRecentIncidents() {
    try {
        renderIncidentTable(SAMPLE_INCIDENTS);
    } catch (error) {
        console.error('CyberShield: failed to load recent incidents.', error);
    }
}

function renderIncidentTable(incidents) {
    const tbody = document.getElementById('incidentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    incidents.forEach((incident) => {
        const tr = document.createElement('tr');
        tr.dataset.status = incident.status;
        tr.dataset.search = `${incident.id} ${incident.title} ${incident.category}`.toLowerCase();

        tr.innerHTML = `
      <td class="id-cell">${escapeHtml(incident.id)}</td>
      <td>${escapeHtml(incident.title)}</td>
      <td>${escapeHtml(incident.category)}</td>
      <td><span class="badge badge--${incident.severity}">${SEVERITY_LABELS[incident.severity]}</span></td>
      <td><span class="badge badge--${incident.status}">${STATUS_LABELS[incident.status]}</span></td>
      <td>${escapeHtml(incident.date)}</td>
      <td>
        <button type="button" class="row-action" aria-label="View ${escapeHtml(incident.id)}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.7"/></svg>
        </button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
}

/* --------------------------------------------------------------------------
   Sidebar toggle (mobile)
   -------------------------------------------------------------------------- */
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!toggleBtn || !sidebar || !overlay) return;

    const closeSidebar = () => {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        toggleBtn.setAttribute('aria-expanded', 'false');
    };

    const toggleSidebar = () => {
        const isOpen = sidebar.classList.toggle('is-open');
        overlay.classList.toggle('is-visible', isOpen);
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
    };

    toggleBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
    });
}

/* --------------------------------------------------------------------------
   Sidebar nav active-state highlighting
   -------------------------------------------------------------------------- */
function initSidebarNavHighlight() {
    const navItems = document.querySelectorAll('.nav-item');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    navItems.forEach((item) => {
        item.addEventListener('click', () => {
            navItems.forEach((el) => el.classList.remove('is-active'));
            item.classList.add('is-active');

            // Close mobile sidebar after a navigation choice
            if (sidebar && sidebar.classList.contains('is-open')) {
                sidebar.classList.remove('is-open');
                if (overlay) overlay.classList.remove('is-visible');
            }
            // TODO (backend/routing): load the relevant page/section here,
            // e.g. showPage(item.dataset.page) once multiple views exist.
        });
    });
}

/* --------------------------------------------------------------------------
   Notification + profile dropdowns
   -------------------------------------------------------------------------- */
function initDropdowns() {
    setupDropdown('notifBtn', 'notifPanel');
    setupDropdown('profileBtn', 'profilePanel');

    // Close any open dropdown when clicking outside of it
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.dropdown').forEach((dropdown) => {
            if (!dropdown.contains(event.target)) {
                const panel = dropdown.querySelector('.dropdown__panel');
                const trigger = dropdown.querySelector('[aria-haspopup]');
                if (panel) panel.classList.remove('is-open');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

function setupDropdown(triggerId, panelId) {
    const trigger = document.getElementById(triggerId);
    const panel = document.getElementById(panelId);
    if (!trigger || !panel) return;

    trigger.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !panel.classList.contains('is-open');

        // Close all other dropdowns first
        document.querySelectorAll('.dropdown__panel.is-open').forEach((p) => p.classList.remove('is-open'));
        document.querySelectorAll('[aria-haspopup]').forEach((t) => t.setAttribute('aria-expanded', 'false'));

        panel.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
    });
}

/* --------------------------------------------------------------------------
   Incident table: status filter chips
   -------------------------------------------------------------------------- */
function initTableFilter() {
    const chips = document.querySelectorAll('#tableFilters .filter-chip');
    if (!chips.length) return;

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('is-active'));
            chip.classList.add('is-active');
            applyTableFilters();
        });
    });
}

/* --------------------------------------------------------------------------
   Incident table: search box
   -------------------------------------------------------------------------- */
function initTableSearch() {
    const searchInput = document.getElementById('incidentSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => applyTableFilters());
}

function applyTableFilters() {
    const activeChip = document.querySelector('#tableFilters .filter-chip.is-active');
    const statusFilter = activeChip ? activeChip.dataset.filter : 'all';
    const searchInput = document.getElementById('incidentSearch');
    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const rows = document.querySelectorAll('#incidentTableBody tr');
    const emptyState = document.getElementById('tableEmptyState');
    let visibleCount = 0;

    rows.forEach((row) => {
        const matchesStatus = statusFilter === 'all' || row.dataset.status === statusFilter;
        const matchesSearch = !searchTerm || row.dataset.search.includes(searchTerm);
        const isVisible = matchesStatus && matchesSearch;

        row.classList.toggle('is-hidden', !isVisible);
        if (isVisible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
}

/* --------------------------------------------------------------------------
   Logout — with confirmation, then redirect to the logout Servlet
   -------------------------------------------------------------------------- */
function initLogout() {
    const logoutButtons = [
        document.getElementById('logoutBtn'),
        document.getElementById('profileLogoutBtn'),
    ].filter(Boolean);

    logoutButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const confirmed = window.confirm('Are you sure you want to log out?');
            if (confirmed) logoutUser();
        });
    });
}

function logoutUser() {
    try {
        showToast('Logging out...');
        // TODO (backend): the "logout" Servlet should invalidate the session
        // (session.invalidate()) and then redirect to login.html.
        // Since the Servlet is not wired up in this frontend-only preview,
        // we navigate to it directly; the Servlet itself will handle the
        // redirect to login.html once implemented.
        setTimeout(() => {
            window.location.href = 'logout';
        }, 600);
    } catch (error) {
        console.error('CyberShield: logout failed unexpectedly.', error);
        // Fallback: still send the user to the login page
        window.location.href = 'login.html';
    }
}

/* --------------------------------------------------------------------------
   Fun: Security Squad mascot panel (original characters)
   -------------------------------------------------------------------------- */
const SQUAD_QUOTES = {
    ironclad: '"Suit up. Every incident report makes the whole network stronger." — Ironclad',
    webwatch: '"I\'ve got eyes on every endpoint. Nothing slips past the web." — WebWatch',
    mystiguard: '"Some threats need more than a firewall. Good thing I brought backup." — MystiGuard',
};

function initSquadPanel() {
    const fab = document.getElementById('squadFab');
    const panel = document.getElementById('squadPanel');
    const closeBtn = document.getElementById('squadClose');
    const cards = document.querySelectorAll('.squad-card');
    const quote = document.getElementById('squadQuote');
    if (!fab || !panel) return;

    const togglePanel = () => {
        const willOpen = !panel.classList.contains('is-open');
        panel.classList.toggle('is-open', willOpen);
        panel.setAttribute('aria-hidden', String(!willOpen));
        fab.setAttribute('aria-expanded', String(willOpen));
    };

    fab.addEventListener('click', togglePanel);
    if (closeBtn) closeBtn.addEventListener('click', togglePanel);

    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((c) => c.classList.remove('is-active'));
            card.classList.add('is-active');
            const hero = card.dataset.hero;
            if (quote && SQUAD_QUOTES[hero]) {
                quote.style.opacity = '0';
                setTimeout(() => {
                    quote.textContent = SQUAD_QUOTES[hero];
                    quote.style.opacity = '1';
                }, 120);
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('is-open')) togglePanel();
    });
}

/* --------------------------------------------------------------------------
   Scroll reveal (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        revealEls.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Stat counter animation
   -------------------------------------------------------------------------- */
function animateCount(el, targetValue, duration = 1200) {
    const startTime = performance.now();
    function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(targetValue * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = targetValue;
    }
    requestAnimationFrame(step);
}

function initStatCounters() {
    const counters = document.querySelectorAll('.stat-card__value[data-count]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
        counters.forEach((el) => animateCount(el, Number(el.dataset.count) || 0));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                animateCount(entry.target, Number(entry.target.dataset.count) || 0);
                obs.unobserve(entry.target);
            });
        },
        { threshold: 0.4 }
    );
    counters.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Toast helper
   -------------------------------------------------------------------------- */
let toastTimeoutId = null;
function showToast(message) {
    try {
        const toastEl = document.getElementById('toast');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('is-visible');
        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => toastEl.classList.remove('is-visible'), 2800);
    } catch (error) {
        console.error('CyberShield: unable to display toast message.', error);
    }
}