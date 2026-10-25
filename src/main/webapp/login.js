/* ==========================================================================
   CyberShield — login.js
   Vanilla JS only.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggle();
    initInputLiveClear();
    initLoginForm();
});

/* --------------------------------------------------------------------------
1. Password show / hide
-------------------------------------------------------------------------- */
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (!toggleBtn || !passwordInput) return;

    const eyeOpen = toggleBtn.querySelector('.eye-open');
    const eyeClosed = toggleBtn.querySelector('.eye-closed');

    toggleBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';

        toggleBtn.classList.toggle('is-active', isPassword);
        toggleBtn.setAttribute('aria-pressed', String(isPassword));
        toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

        if (eyeOpen && eyeClosed) {
            eyeOpen.hidden = isPassword;
            eyeClosed.hidden = !isPassword;
        }
    });
}

/* --------------------------------------------------------------------------
   2 & 3. Email / password validation helpers
   -------------------------------------------------------------------------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Email address is required.';
    if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address.';
    return '';
}

function validatePassword(value) {
    if (!value) return 'Password is required.';
    if (value.length < 6) return 'Password must be at least 6 characters.';
    return '';
}

function setFieldState(fieldEl, errorEl, errorMessage) {
    if (errorMessage) {
        fieldEl.classList.add('is-invalid');
        fieldEl.classList.remove('is-valid');
        errorEl.textContent = errorMessage;
    } else {
        fieldEl.classList.remove('is-invalid');
        fieldEl.classList.add('is-valid');
        errorEl.textContent = '';
    }
}

/* --------------------------------------------------------------------------
   7. Input UX — clear error state as the user types
   -------------------------------------------------------------------------- */
function initInputLiveClear() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailField = document.getElementById('emailField');
    const passwordField = document.getElementById('passwordField');

    if (emailInput && emailField) {
        emailInput.addEventListener('input', () => {
            if (emailField.classList.contains('is-invalid')) {
                emailField.classList.remove('is-invalid');
                document.getElementById('emailError').textContent = '';
            }
        });
    }

    if (passwordInput && passwordField) {
        passwordInput.addEventListener('input', () => {
            if (passwordField.classList.contains('is-invalid')) {
                passwordField.classList.remove('is-invalid');
                document.getElementById('passwordError').textContent = '';
            }
        });
    }
}

/* --------------------------------------------------------------------------
   4 & 5. Form validation + login flow
   -------------------------------------------------------------------------- */
function initLoginForm() {
    const form = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const formMessage = document.getElementById('formMessage');
    if (!form || !loginBtn || !formMessage) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailField = document.getElementById('emailField');
    const passwordField = document.getElementById('passwordField');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    form.addEventListener('submit', (event) => {
        try {
            const emailErrorMsg = validateEmail(emailInput.value);
            const passwordErrorMsg = validatePassword(passwordInput.value);

            setFieldState(emailField, emailError, emailErrorMsg);
            setFieldState(passwordField, passwordError, passwordErrorMsg);

            if (emailErrorMsg || passwordErrorMsg) {
                event.preventDefault();
                showFormMessage(formMessage, 'Please fix the highlighted fields.', 'error');
                return;
            }
        } catch (error) {
            event.preventDefault();
            console.error('CyberShield: login validation failed unexpectedly.', error);
            showFormMessage(formMessage, 'Something went wrong. Please try again.', 'error');
        }
    });
}

function showFormMessage(el, message, type) {
    el.textContent = message;
    el.classList.remove('is-success', 'is-error', 'is-visible');
    if (!message) return;
    el.classList.add(type === 'success' ? 'is-success' : 'is-error', 'is-visible');
}

const ADMIN_PANEL_URL = 'adminlogin.jsp';

function openAdminPanel() {
    const btn = document.getElementById('adminPanelBtn');
    if (btn) {
        btn.classList.add('is-opening');
        const label = btn.querySelector('span:nth-child(2)');
        if (label) label.textContent = 'Opening...';
    }
    setTimeout(() => { window.location.href = ADMIN_PANEL_URL; }, 600);
}