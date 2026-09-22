/* ==========================================================================
   CyberShield — script.js
   Vanilla JS only. No dependencies, no backend calls.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initSmoothScroll();
    initNavbarScrollState();
    initScrollReveal();
    initStatCounters();
    initDashboardFilter();
    initReportButtons();
});

/* --------------------------------------------------------------------------
   1. Mobile hamburger menu
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const hamburger = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
        const isOpen = navLinks.classList.toggle('is-open');
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu whenever a nav link is clicked (mobile UX expectation)
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navLinks.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
}

/* --------------------------------------------------------------------------
   2. Smooth scrolling for in-page navigation links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            event.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* --------------------------------------------------------------------------
   3. Navbar background/shadow change on scroll
   -------------------------------------------------------------------------- */
function initNavbarScrollState() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const updateNavbarState = () => {
        navbar.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    updateNavbarState();
    window.addEventListener('scroll', updateNavbarState, { passive: true });
}

/* --------------------------------------------------------------------------
   4. Scroll reveal animation using IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if (!('IntersectionObserver' in window)) {
        // Fallback: just show everything if the API isn't supported
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
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. Statistic / dashboard counter animation
   -------------------------------------------------------------------------- */
function animateCount(el, targetValue, duration = 1400) {
    const startValue = 0;
    const startTime = performance.now();
    const suffix = el.dataset.suffix || '';

    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out for a natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(startValue + (targetValue - startValue) * eased);

        el.textContent = `${currentValue}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = `${targetValue}${suffix}`;
        }
    }

    requestAnimationFrame(step);
}

function initStatCounters() {
    const counterEls = document.querySelectorAll('[data-count]');
    const heroStatEl = document.querySelector('.hero__stats .stat__value[data-suffix]');

    const countersToWatch = [...counterEls, heroStatEl].filter(Boolean);
    if (!countersToWatch.length) return;

    if (!('IntersectionObserver' in window)) {
        countersToWatch.forEach((el) => {
            const target = Number(el.dataset.count || el.textContent) || 0;
            animateCount(el, target);
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = Number(el.dataset.count || el.textContent) || 0;
                animateCount(el, target);
                obs.unobserve(el);
            });
        },
        { threshold: 0.4 }
    );

    countersToWatch.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   6. Fake dashboard interaction — filter incidents by status
   -------------------------------------------------------------------------- */
function initDashboardFilter() {
    const filterChips = document.querySelectorAll('.filter-chip');
    const tableRows = document.querySelectorAll('#incidentTable tbody tr');
    if (!filterChips.length || !tableRows.length) return;

    filterChips.forEach((chip) => {
        chip.addEventListener('click', () => {
            const filterValue = chip.dataset.filter;

            filterChips.forEach((c) => {
                c.classList.remove('is-active');
                c.setAttribute('aria-selected', 'false');
            });
            chip.classList.add('is-active');
            chip.setAttribute('aria-selected', 'true');

            tableRows.forEach((row) => {
                const matches = filterValue === 'all' || row.dataset.status === filterValue;
                row.classList.toggle('is-hidden', !matches);
            });
        });
    });
}

/* --------------------------------------------------------------------------
   7. Report Incident buttons — placeholder message (no backend yet)
   -------------------------------------------------------------------------- */
function initReportButtons() {
    const reportButtons = document.querySelectorAll('.js-report-btn');
    if (!reportButtons.length) return;

    reportButtons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            showToast('Please login to report a cybersecurity incident.');
        });
    });
}

/* --------------------------------------------------------------------------
   8. Toast helper — small, reusable, error-safe
   -------------------------------------------------------------------------- */
let toastTimeoutId = null;

function showToast(message) {
    try {
        let toastEl = document.querySelector('.toast');

        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            toastEl.setAttribute('role', 'status');
            toastEl.setAttribute('aria-live', 'polite');
            document.body.appendChild(toastEl);
        }

        toastEl.textContent = message;
        toastEl.classList.add('is-visible');

        if (toastTimeoutId) clearTimeout(toastTimeoutId);
        toastTimeoutId = setTimeout(() => {
            toastEl.classList.remove('is-visible');
        }, 3200);
    } catch (error) {
        // Fail silently in the unlikely event the DOM isn't ready
        console.error('CyberShield: unable to display toast message.', error);
    }
}