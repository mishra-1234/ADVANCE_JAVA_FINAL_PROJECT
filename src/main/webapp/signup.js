/* ==========================================================================
   CyberShield — register.js
   Vanilla JS only. Frontend validation only, no backend connection.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    initPolicyLinks();
    initLiveClear();
    initPasswordStrength();
    initRegisterForm();
});

/* --------------------------------------------------------------------------
   11. Password visibility — works for both password fields
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach((toggleBtn) => {
        const targetId = toggleBtn.dataset.target;
        const input = document.getElementById(targetId);
        if (!input) return;

        const eyeOpen = toggleBtn.querySelector('.eye-open');
        const eyeClosed = toggleBtn.querySelector('.eye-closed');

        toggleBtn.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';

            toggleBtn.classList.toggle('is-active', isPassword);
            toggleBtn.setAttribute('aria-pressed', String(isPassword));
            toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

            if (eyeOpen && eyeClosed) {
                eyeOpen.hidden = isPassword;
                eyeClosed.hidden = !isPassword;
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Terms & Privacy Policy links — informational only
   -------------------------------------------------------------------------- */
function initPolicyLinks() {
    const termsLink = document.getElementById('termsLink');
    const privacyLink = document.getElementById('privacyLink');
    const note = document.getElementById('policyNote');
    if (!note) return;

    const showNote = () => {
        note.textContent = 'Terms and Privacy Policy will be available soon.';
        note.classList.add('is-visible');
        clearTimeout(initPolicyLinks._timeoutId);
        initPolicyLinks._timeoutId = setTimeout(() => note.classList.remove('is-visible'), 4000);
    };

    if (termsLink) termsLink.addEventListener('click', showNote);
    if (privacyLink) privacyLink.addEventListener('click', showNote);
}

/* --------------------------------------------------------------------------
   Validation helpers (1–4, 5, 7)
   -------------------------------------------------------------------------- */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMPLOYEE_ID_PATTERN = /^[A-Za-z0-9]+$/;

function validateFullName(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your full name.';
    if (trimmed.length < 3) return 'Full name must be at least 3 characters.';
    return '';
}

function validateEmployeeId(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter your employee ID.';
    if (!EMPLOYEE_ID_PATTERN.test(trimmed)) return 'Employee ID may only contain letters and numbers.';
    return '';
}

function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Please enter a valid email address.';
    if (!EMAIL_PATTERN.test(trimmed)) return 'Please enter a valid email address.';
    return '';
}

function validateDepartment(value) {
    if (!value) return 'Please select your department.';
    return '';
}

function getPasswordChecks(value) {
    return {
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[^A-Za-z0-9]/.test(value),
    };
}

function validatePassword(value) {
    if (!value) return 'Please create a password.';
    const checks = getPasswordChecks(value);
    if (!checks.length) return 'Password must contain at least 8 characters.';
    if (!checks.upper) return 'Password must include an uppercase letter.';
    if (!checks.lower) return 'Password must include a lowercase letter.';
    if (!checks.number) return 'Password must include a number.';
    if (!checks.special) return 'Password must include a special character.';
    return '';
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return 'Please confirm your password.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
}

function setFieldState(fieldEl, errorEl, errorMessage) {
    if (errorMessage) {
        fieldEl.classList.add('is-invalid');
        fieldEl.classList.remove('is-valid');
        if (errorEl) errorEl.textContent = errorMessage;
    } else {
        fieldEl.classList.remove('is-invalid');
        fieldEl.classList.add('is-valid');
        if (errorEl) errorEl.textContent = '';
    }
}

/* --------------------------------------------------------------------------
   10. Input UX — clear errors as the user types, re-validate where useful
   -------------------------------------------------------------------------- */
function initLiveClear() {
    const simpleFields = [
        { input: 'fullName', field: 'fullNameField', error: 'fullNameError' },
        { input: 'employeeId', field: 'employeeIdField', error: 'employeeIdError' },
        { input: 'email', field: 'emailField', error: 'emailError' },
    ];

    simpleFields.forEach(({ input, field, error }) => {
        const inputEl = document.getElementById(input);
        const fieldEl = document.getElementById(field);
        const errorEl = document.getElementById(error);
        if (!inputEl || !fieldEl) return;
        inputEl.addEventListener('input', () => {
            fieldEl.classList.remove('is-invalid');
            if (errorEl) errorEl.textContent = '';
        });
    });

    const departmentEl = document.getElementById('department');
    const departmentField = document.getElementById('departmentField');
    const departmentError = document.getElementById('departmentError');
    if (departmentEl && departmentField) {
        departmentEl.addEventListener('change', () => {
            departmentField.classList.remove('is-invalid');
            if (departmentError) departmentError.textContent = '';
        });
    }

    const termsCheckbox = document.getElementById('termsCheckbox');
    const termsField = document.getElementById('termsField');
    const termsError = document.getElementById('termsError');
    if (termsCheckbox && termsField) {
        termsCheckbox.addEventListener('change', () => {
            if (termsCheckbox.checked) {
                termsField.classList.remove('is-invalid');
                if (termsError) termsError.textContent = '';
            }
        });
    }

    // Confirm password re-checks live against the current password value
    const passwordEl = document.getElementById('password');
    const confirmEl = document.getElementById('confirmPassword');
    const confirmField = document.getElementById('confirmPasswordField');
    const confirmError = document.getElementById('confirmPasswordError');

    if (passwordEl) {
        passwordEl.addEventListener('input', () => {
            const passwordField = document.getElementById('passwordField');
            passwordField.classList.remove('is-invalid');
            document.getElementById('passwordError').textContent = '';

            if (confirmEl && confirmEl.value) {
                const mismatch = validateConfirmPassword(passwordEl.value, confirmEl.value);
                setFieldState(confirmField, confirmError, mismatch);
            }
        });
    }

    if (confirmEl) {
        confirmEl.addEventListener('input', () => {
            confirmField.classList.remove('is-invalid');
            confirmError.textContent = '';
        });
    }
}

/* --------------------------------------------------------------------------
   6. Password strength indicator
   -------------------------------------------------------------------------- */
function initPasswordStrength() {
    const passwordEl = document.getElementById('password');
    const meter = document.getElementById('strengthMeter');
    const label = document.getElementById('strengthLabel');
    if (!passwordEl || !meter || !label) return;

    passwordEl.addEventListener('input', () => {
        const value = passwordEl.value;
        meter.classList.remove('is-weak', 'is-medium', 'is-strong');
        label.classList.remove('is-weak', 'is-medium', 'is-strong');

        if (!value) {
            label.textContent = '';
            return;
        }

        const checks = getPasswordChecks(value);
        const passedCount = Object.values(checks).filter(Boolean).length;

        let level = 'weak';
        if (passedCount >= 5 && value.length >= 10) {
            level = 'strong';
        } else if (passedCount >= 3) {
            level = 'medium';
        }

        meter.classList.add(`is-${level}`);
        label.classList.add(`is-${level}`);
        label.textContent = `Password strength: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    });
}

/* --------------------------------------------------------------------------
   9 & 12. Full form validation + fake loading / success flow
   -------------------------------------------------------------------------- */
function initRegisterForm() {
    const form = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const formMessage = document.getElementById('formMessage');
    if (!form || !registerBtn || !formMessage) return;

    const fields = {
        fullName: {
            input: document.getElementById('fullName'),
            field: document.getElementById('fullNameField'),
            error: document.getElementById('fullNameError'),
            validate: (v) => validateFullName(v),
        },
        employeeId: {
            input: document.getElementById('employeeId'),
            field: document.getElementById('employeeIdField'),
            error: document.getElementById('employeeIdError'),
            validate: (v) => validateEmployeeId(v),
        },
        email: {
            input: document.getElementById('email'),
            field: document.getElementById('emailField'),
            error: document.getElementById('emailError'),
            validate: (v) => validateEmail(v),
        },
        department: {
            input: document.getElementById('department'),
            field: document.getElementById('departmentField'),
            error: document.getElementById('departmentError'),
            validate: (v) => validateDepartment(v),
        },
        password: {
            input: document.getElementById('password'),
            field: document.getElementById('passwordField'),
            error: document.getElementById('passwordError'),
            validate: (v) => validatePassword(v),
        },
    };

    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordField = document.getElementById('confirmPasswordField');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    const termsCheckbox = document.getElementById('termsCheckbox');
    const termsField = document.getElementById('termsField');
    const termsError = document.getElementById('termsError');

    const btnLabel = registerBtn.querySelector('.btn__label');

    form.addEventListener('submit', (event) => {

        try {
            let firstInvalidEl = null;

            Object.values(fields).forEach(({input, field, error, validate}) => {
                const message = validate(input.value);

                setFieldState(field, error, message);

                if (message && !firstInvalidEl) {
                    firstInvalidEl = input;
                }
            });

            const confirmMessage = validateConfirmPassword(
                fields.password.input.value,
                confirmPasswordInput.value
            );

            setFieldState(
                confirmPasswordField,
                confirmPasswordError,
                confirmMessage
            );

            if (confirmMessage && !firstInvalidEl) {
                firstInvalidEl = confirmPasswordInput;
            }

            let termsMessage = '';

            if (!termsCheckbox.checked) {

                termsMessage = 'Please accept the Terms & Conditions.';

                termsField.classList.add('is-invalid');
                termsError.textContent = termsMessage;

                if (!firstInvalidEl) {
                    firstInvalidEl = termsCheckbox;
                }

            } else {

                termsField.classList.remove('is-invalid');
                termsError.textContent = '';
            }

            const hasErrors = Boolean(
                firstInvalidEl ||
                Object.values(fields).some(
                    ({input, validate}) => validate(input.value)
                ) ||
                confirmMessage ||
                termsMessage
            );

            if (hasErrors) {

                event.preventDefault();

                showFormMessage(
                    formMessage,
                    'Please fix the highlighted fields.',
                    'error'
                );

                if (firstInvalidEl) {
                    firstInvalidEl.focus();
                }

                return;
            }

            // Validation successful
            // DO NOT prevent form submission.
            // Browser will submit to RegisterServlet.

            registerBtn.disabled = true;
            btnLabel.textContent = 'Creating Account...';

        } catch (error) {

            event.preventDefault();

            console.error(
                'CyberShield: registration validation failed unexpectedly.',
                error
            );

            showFormMessage(
                formMessage,
                'Something went wrong. Please try again.',
                'error'
            );
        }
    });

    function runLoadingState(form, registerBtn, btnLabel, formMessage) {
        form.classList.add('is-loading');
        registerBtn.disabled = true;
        const originalLabel = btnLabel.textContent;
        btnLabel.textContent = 'Creating Account...';
        showFormMessage(formMessage, '', null);

        setTimeout(() => {
            form.classList.remove('is-loading');
            registerBtn.disabled = false;
            btnLabel.textContent = originalLabel;
            showFormMessage(
                formMessage,
                'Account created successfully! Backend registration will be connected soon.',
                'success'
            );
        }, 1500);
    }

    function showFormMessage(el, message, type) {
        el.textContent = message;
        el.classList.remove('is-success', 'is-error', 'is-visible');
        if (!message) return;
        el.classList.add(type === 'success' ? 'is-success' : 'is-error', 'is-visible');
    }
}