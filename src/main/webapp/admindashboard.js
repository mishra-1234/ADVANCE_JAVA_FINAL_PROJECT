/* ==========================================================================
   CyberShield — Dynamic Database Admin Dashboard Controller
   ========================================================================== */

const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const titles = {
    dashboard: ['Dashboard', 'Live overview of your protected network'],
    scans: ['URL Scanner', 'Analyze external links, endpoints and domains'],
    users: ['Security Incidents Management', 'Review and resolve reported cybersecurity incidents'],
    reports: ['Security Reports', 'Audit logs and threat analytics export']
};

const sevColors = {
    critical: '#ff4d6d',
    high: '#ffb84d',
    medium: '#22f0ff',
    low: '#2cffb0'
};

let adminIncidents = [];

/* ==========================================================================
   Database Fetching Logic
   ========================================================================== */
async function fetchAdminIncidents() {
    const tbody = document.getElementById('uBody');
    if (!tbody) return;

    try {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#22f0ff; padding:20px;">Fetching dynamic records from database...</td></tr>`;

        const response = await fetch('/AD-PROJECT/get-admin-incidents');
        if (!response.ok) {
            throw new Error(`HTTP Error Status: ${response.status}`);
        }

        const data = await response.json();
        adminIncidents = Array.isArray(data) ? data : [];

        renderIncidents('');

    } catch (error) {
        console.error('Error loading database incidents:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#ff4d6d; padding:20px; font-weight:600;">⚠️ Database Connection Error: ${error.message}</td></tr>`;
    }
}

const row = (i, content) => `<tr style="animation-delay:${i * .05}s">${content}</tr>`;

function renderIncidents(filterText = '') {
    const tbody = document.getElementById('uBody');
    if (!tbody) return;

    if (!adminIncidents || adminIncidents.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888; padding:25px;">No incidents recorded in the database.</td></tr>`;
        return;
    }

    const filtered = adminIncidents.filter(inc => {
        const searchText = (inc.title + ' ' + inc.category + ' ' + inc.reportedBy + ' ' + inc.severity).toLowerCase();
        return searchText.includes(filterText.toLowerCase());
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#888; padding:25px;">No records match your search criteria.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((inc, i) => {
        const rawSev = (inc.severity || 'medium').toLowerCase();
        const badgeColor = sevColors[rawSev] || '#22f0ff';

        return row(i, `
            <td><b>INC-${100 + Number(inc.id)}</b></td>
            <td>
                <div style="font-weight:600; color:#fff;">${escapeHtml(inc.title)}</div>
                <small style="color:#22f0ff; text-transform:capitalize;">${escapeHtml(inc.category)}</small>
            </td>
            <td><span class="tag" style="--c:${badgeColor}">${rawSev.toUpperCase()}</span></td>
            <td>${escapeHtml(inc.reportedBy || 'Anonymous')}</td>
            <td><small>${escapeHtml(inc.date || 'N/A')}</small></td>
            <td>
                <button class="ghost" onclick="resolveIncident(${inc.id})" style="padding:5px 12px; font-size:12px; cursor:pointer;">Resolve</button>
            </td>
        `);
    }).join('');
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

function resolveIncident(id) {
    if (confirm(`Mark Incident INC-${100 + Number(id)} as Resolved?`)) {
        alert(`Incident INC-${100 + Number(id)} status updated.`);
    }
}

/* ==========================================================================
   Navigation & UI Handlers
   ========================================================================== */
const nav = $('#nav'), pill = $('#pill');

function movePill() {
    const a = $('.nav button.active');
    if (!a || !pill) return;
    pill.style.height = a.offsetHeight + 'px';
    pill.style.transform = `translateY(${a.offsetTop}px)`;
}

const viewHooks = {
    dashboard() {},
    scans() {},
    users() { fetchAdminIncidents(); },
    reports() {}
};

function go(viewName) {
    $$('.nav button[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === viewName));$$
    ('.view').forEach(s => {
        s.classList.remove('show');
        if (s.id === viewName) {
            void s.offsetWidth;
            s.classList.add('show');
        }
    });

    if (titles[viewName]) {
        if ($('#title')) $('#title').textContent = titles[viewName][0];
        if ($('#sub')) $('#sub').textContent = titles[viewName][1];
    }

    if (viewHooks[viewName]) {
        viewHooks[viewName]();
    }
    movePill();
}

if (nav) {
    nav.addEventListener('click', e => {
        const b = e.target.closest('button[data-view]');
        if (b) go(b.dataset.view);
    });
}

// Logout Modal Handlers
const modal = $('#modal');
if ($('#logoutBtn')) $('#logoutBtn').onclick = () => modal.style.display = 'grid';
if ($('#stay')) $('#stay').onclick = () => modal.style.display = 'none';
if ($('#confirm')) $('#confirm').onclick = () => { window.location.href = 'dashboard.html'; };

// Live Search Input Listener
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('q');
    if (searchInput) {
        searchInput.addEventListener('input', e => renderIncidents(e.target.value));
    }

    // Auto Load Default View
    go('users');
});

addEventListener('resize', movePill);